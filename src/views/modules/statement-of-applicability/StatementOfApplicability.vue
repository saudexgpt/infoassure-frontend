<template>
  <el-card>

    <el-button
      v-if="selectedClient !== ''"
      class="pull-right"
      type="default"
      icon="el-icon-refresh"
      circle
      @click="fetchSOA()"
    />
    <!-- <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="10"
          :md="10"
        >
          <el-select
            v-model="selectedClient"
            value-key="id"
            placeholder="Select Client"
            style="width: 100%;"
            @input="fetchSOA(); fetchReportSummary()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client"
              :label="client.name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside> -->
    <div
      v-if="selectedClient !== ''"
    >
      <b-tabs
        content-class="mt-1"
      >
        <b-tab lazy>
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Details</span>
          </template>
          <el-button
            type="primary"
            @click="exportToExcel('soaTable')"
          >
            Export
          </el-button>
          <el-collapse v-if="!downloading">

            <el-collapse-item
              v-for="(soa, soa_index) in soas"
              :key="soa_index"
              :title="soa.name"
              :name="soa.id"
            >
              <div class="table-responsive">
                <el-table
                  :data="soa.controls"
                  style="width: 100%"
                  height="450"
                >
                  <el-table-column
                    fixed
                    label="Control"
                    width="250"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Control Description"
                    width="400"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.description }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Control Applicable"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <select
                        v-model="scope.row.soa.applicable"
                        placeholder="Applicable"
                        style="width: 100%"
                        @input="saveSOA('applicable', $event, scope.row.soa.id)"
                      >
                        <option value="Yes">
                          Yes
                        </option>
                        <option value="No">
                          No
                        </option>
                      </select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Control Implemented"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <select
                        v-model="scope.row.soa.implemented"
                        placeholder="Implemented"
                        style="width: 100%"
                        @input="saveSOA('implemented', $event, scope.row.soa.id)"
                      >
                        <option value="Yes">
                          Yes
                        </option>
                        <option value="No">
                          No
                        </option>
                      </select>
                    </template>
                  </el-table-column>
                  <el-table-column label="REASONS FOR SELECTION">
                    <el-table-column
                      label="Legal/Contractual Requirement"
                      width="150"
                    >
                      <template slot-scope="scope">
                        <select
                          v-model="scope.row.soa.legal_requirement"
                          placeholder="Implemented"
                          style="width: 100%"
                          @input="saveSOA('legal_requirement', $event, scope.row.soa.id)"
                        >
                          <option value="Yes">
                            Yes
                          </option>
                          <option value="No">
                            No
                          </option>
                        </select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Business Requirement"
                      width="150"
                    >
                      <template slot-scope="scope">
                        <select
                          v-model="scope.row.soa.business_requirement"
                          placeholder="business_requirement"
                          style="width: 100%"
                          @input="saveSOA('business_requirement', $event, scope.row.soa.id)"
                        >
                          <option value="Yes">
                            Yes
                          </option>
                          <option value="No">
                            No
                          </option>
                        </select>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="Result of Risk Assessment"
                      width="150"
                    >
                      <template slot-scope="scope">
                        <select
                          v-model="scope.row.soa.result_of_risk_assessment"
                          placeholder="result_of_risk_assessment"
                          style="width: 100%"
                          @input="saveSOA('result_of_risk_assessment', $event, scope.row.soa.id)"
                        >
                          <option value="Yes">
                            Yes
                          </option>
                          <option value="No">
                            No
                          </option>
                        </select>
                      </template>
                    </el-table-column>

                  </el-table-column>
                  <el-table-column
                    label="Description of Controls/Justification for Exclusion"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.justification_of_exclusion"
                        placeholder="Description of Controls/Justification for Exclusion"
                        style="width: 100%"
                        @blur="saveSOA('justification_of_exclusion', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Reference to Control Document/Evidence"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.reference_to_control_document"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('reference_to_control_document', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Assets"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.assets"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('assets', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Risk"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.risk"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('risk', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Issue"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.issue"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('issue', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="Additional Controls Required (if any)"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.addition_control_required"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('addition_control_required', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="R"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.r"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('r', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="A"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.a"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('a', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="C"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.c"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('c', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="I"
                    width="250"
                  >
                    <template slot-scope="scope">
                      <textarea
                        v-model="scope.row.soa.i"
                        placeholder="Type here..."
                        style="width: 100%"
                        @blur="saveSOA('i', $event, scope.row.soa.id)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
          <table
            v-else
            id="soaTable"
            data-cols-width="30,50,70,30,30,30,30,30,50,30,30,50,30,30,30,30,30,30"
            class="table-responsive"
          >
            <thead>
              <tr>
                <th
                  rowspan="2"
                  style="font-size: 14px;"
                  data-f-sz="14"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                ><div
                  style="width: 150px;"
                >AREA</div></th>
                <th
                  rowspan="2"
                  style="font-size: 14px;"
                  data-f-sz="14"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                ><div
                  style="width: 250px;"
                >CONTROL</div></th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                  :data-a-wrap="true"
                ><div
                  style="width: 250px;"
                >Control Description</div></th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Control Applicable</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Control Implemented</th>
                <th
                  colspan="3"
                  style="font-size: 14px;"
                  data-f-sz="14"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >REASONS FOR SELECTION</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Description of Controls/Justification for Exclusion</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Reference to Control Document/Evidence</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Asset</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Risk</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Issue</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Additional Controls Required (if any)</th>
                <th
                  rowspan="2"
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >R</th>
                <th
                  rowspan="2"
                  data-fill-color="46035a"
                  data-f-color="ffffff"
                >A</th>
                <th
                  rowspan="2"
                  data-fill-color="46035a"
                  data-f-color="ffffff"
                >C</th>
                <th
                  rowspan="2"
                  data-fill-color="46035a"
                  data-f-color="ffffff"
                >I</th>
              </tr>
              <tr>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Legal/Contractual Requirement</th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Business Requirement</th>
                <th
                  data-fill-color="333333"
                  data-f-color="ffffff"
                >Result of Risk Assessment</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="soa in soas"
              >
                <tr :key="soa.name">
                  <td data-a-v="top">
                    {{ soa.name }}
                  </td>
                  <td
                    v-for="cell in 17"
                    :key="`${cell}-i`"
                  />
                </tr>
                <tr
                  v-for="control in soa.controls"
                  :key="control.id"
                >
                  <td />
                  <td data-a-v="top">
                    {{ control.name }}
                  </td>
                  <td
                    data-a-wrap="true"
                    data-a-v="top"
                  >

                    {{ control.description }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.applicable }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.implemented }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.legal_requirement }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.business_requirement }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.result_of_risk_assessment }}
                  </td>
                  <td
                    data-a-wrap="true"
                    data-a-v="top"
                  >
                    {{ control.soa.justification_of_exclusion }}
                  </td>
                  <td
                    data-a-wrap="true"
                    data-a-v="top"
                  >
                    {{ control.soa.reference_to_control_document }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.assets }}
                  </td>
                  <td
                    data-a-wrap="true"
                    data-a-v="top"
                  >
                    {{ control.soa.risk }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.issue }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.addition_control_required }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.r }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.a }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.c }}
                  </td>
                  <td data-a-v="top">
                    {{ control.soa.i }}
                  </td>
                </tr>
                <tr :key="`${soa.name}-total`">
                  <td
                    data-fill-color="2E37B4"
                    data-f-color="ffffff"
                  >Totals: </td>
                  <td
                    data-fill-color="2E37B4"
                    data-f-color="ffffff"
                  >{{ soa.controls.length }}</td>
                  <td
                    data-fill-color="2E37B4"
                    data-f-color="ffffff"
                  />
                  <td
                    data-fill-color="2E37B4"
                    data-f-color="ffffff"
                  >{{ getTotal('applicable', soa.controls) }}</td>
                  <td
                    data-fill-color="2E37B4"
                    data-f-color="ffffff"
                  >{{ getTotal('implemented', soa.controls) }}</td>
                  <td
                    v-for="cell in 13"
                    :key="`${cell}-total`"
                  />
                </tr>
                <tr :key="`${soa.name}-border`">
                  <td
                    v-for="cell in 18"
                    :key="`${cell}-border`"
                    data-fill-color="000000"
                  />
                </tr>
              </template>
            </tbody>
          </table>
        </b-tab>
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="BarChartIcon" />
            <span>Summary</span>
          </template>
          <b-tabs
            content-class="mt-1"
            pills
          >
            <b-tab
              lazy
            >
              <template #title>
                <feather-icon icon="BarChartIcon" />
                <span>Graphical View</span>
              </template>
              <graphical-summary :summary="summary" />
            </b-tab>
            <b-tab
              lazy
            >
              <template #title>
                <feather-icon icon="ListIcon" />
                <span>Tabular View</span>
              </template>
              <tabular-summary
                :data="summary.tabular_presentations"
                :selected-client="selectedClient"
              />
            </b-tab>
          </b-tabs>
        </b-tab>
      </b-tabs>
    </div>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import TableToExcel from '@linways/table-to-excel'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import GraphicalSummary from './partials/GraphicalSummary.vue'
import TabularSummary from './partials/TabularSummary.vue'

export default {
  components: {
    BTabs,
    BTab,
    GraphicalSummary,
    TabularSummary,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true,
    },
    standardId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      downloading: false,
      loading: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'ra_id',
        'risk_owner',
        'asset',
        'asset_type.name',
        'threat_impact_description',
        'vulnerability_description',
        'existing_controls',
        'likelihood_justification',
        'risk_likelihood_id',
        'confidentiality',
        'integrity',
        'availability',
        'impact_value',
        'risk_value',
        'risk_category',
      ],
      options: {
        headings: {
          ra_id: 'RA-ID',
          'asset_type.name': 'Asset Type',
          risk_likelihood_id: 'Likelihood Value',
          threat_impact_description: 'Applicable Threat',
          vulnerability_description: 'Applicable Vulnerability Description',
          confidentiality: 'C',
          integrity: 'I',
          availability: 'A',
          risk_category: 'Risk Category',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: ['ra_id'],
        // filterable: false,
        filterable: [
          // 'risk_owner', 'asset',
        ],
        cellClasses: {
          risk_category: [
            {
              class: 'btn-danger',
              condition: row => row.risk_category === 'High',
            },
            {
              class: 'btn-warning',
              condition: row => row.risk_category === 'Medium',
            },
            {
              class: 'btn-success',
              condition: row => row.risk_category === 'Low',
            },
          ],
        },
      },
      risk_assessments: [],
      clients: [],
      searchTerm: '',
      soas: [],
      summary: {},
    }
  },
  created() {
    this.fetchSOA()
    this.fetchReportSummary()
  },
  methods: {
    checkPermission,
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    },
    getTotal(field, controls) {
      let count = 0
      controls.forEach(control => {
        if (control.soa[field] === 'Yes') {
          count += 1
        }
      })
      return count
    },
    saveSOA(field, event, id) {
      // const app = this
      const params = {
        field, value: event.target.value,
      }
      const fetchClientsResource = new Resource('soa/update-soa')
      fetchClientsResource.update(id, params)
        .then(() => {
        })
    },
    fetchSOA(load = true) {
      const app = this
      app.loading = load
      const fetchSOAsResource = new Resource('soa/fetch-soa')
      fetchSOAsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId })
        .then(response => {
          app.soas = response.soas
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchReportSummary() {
      const app = this
      const param = { client_id: app.selectedClient.id, standard_id: app.standardId }
      const fetchConsultingsResource = new Resource('reports/soa-summary')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.summary = response
          // app.chart_report.series = response.series
          // app.chart_report.xAxis.categories = response.categories
          // app.chart_report.subtitle.text = response.subtitle
        })
    },
    exportToExcel(id) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: `${app.selectedClient.name}-SOADetails.xlsx`,
          sheet: {
            name: 'Sheet 1',
          },
        })
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
<style scoped>
table, th, td {
  border:1px solid #cccccc;
  border-collapse: collapse;
  padding: 5px
}
</style>
