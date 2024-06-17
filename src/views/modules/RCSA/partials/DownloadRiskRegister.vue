<template>
  <div>
    <div
      v-if="downloading"
      class="table-responsive"
    >
      <table
        id="riskAssessmentTable"
        class="table table-bordered table-striped"
      >
        <thead>
          <tr>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Business Unit</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Business Process</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >RISK ID</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >RISK TYPE</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >RISK DESCRIPTION</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Impact/Outcome</th>
            <th
              v-for="impact_data in riskAssessments[0].impact_data"
              :key="`${impact_data.slug}_pre`"
              div

              data-fill-color="333333"
              data-f-color="ffffff"
            > {{ impact_data.name }}</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Impact of Occurence</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Likelihood of Occurence</th>
            <!-- <th

                data-fill-color="333333"
                data-f-color="ffffff"
              >Impact Rationale</th> -->
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Overall Rating</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Inherent Risk Rating</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Control/Mitigating Actions</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Control Effectiveness Level</th>
            <th
              v-for="impact_data in riskAssessments[0].revised_impact_data"
              :key="`${impact_data.slug}_post`"

              data-fill-color="333333"
              data-f-color="ffffff"
            > {{ impact_data.name }}</th>
            <th
              data-fill-color="45058d"
              data-f-color="ffffff"
            >Impact of Occurence</th>
            <th
              data-fill-color="45058d"
              data-f-color="ffffff"
            >Likelihood of Occurence</th>
            <!-- <th

                data-fill-color="333333"
                data-f-color="ffffff"
              >Impact Rationale</th> -->
            <th
              data-fill-color="45058d"
              data-f-color="ffffff"
            >Overall Rating</th>
            <th
              data-fill-color="45058d"
              data-f-color="ffffff"
            >Residual Risk Rating</th>
            <th

              data-fill-color="333333"
              data-f-color="ffffff"
            >Primary Risk Owners</th>
            <th
              data-fill-color="46035a"
              data-f-color="ffffff"
            >Key Risk Indicator</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(assessment, index) in riskAssessments"
            :key="index"
          >
            <td>
              <div style="width: 250px">
                {{ assessment.business_unit }}
              </div>
            </td>
            <td>
              <div style="width: 250px">
                {{ assessment.business_process }}
              </div>
            </td>
            <td>{{ assessment.risk_id }}</td>
            <td>{{ assessment.type }}</td>
            <td>
              <div style="width: 300px">
                {{ assessment.vulnerability_description }}
              </div>
            </td>
            <td>
              <div style="width: 250px">
                {{ assessment.outcome }}
              </div>
            </td>
            <td
              v-for="(impact_data, impact_data_index) in assessment.impact_data"
              :key="impact_data_index"
            >

              {{ impact_data.impact_value }}

            </td>
            <td>

              {{ assessment.impact_of_occurence }}

            </td>
            <td>

              {{ assessment.likelihood_of_occurence }}

            </td>
            <!-- <td>

                <div style="width: 300px">
                  <span v-html="assessment.impact_rationale" />
                </div>
              </td> -->
            <td>

              {{ assessment.overall_risk_rating }}

            </td>
            <td
              :data-fill-color="customClass(assessment, 'risk_category')"
              data-f-color="ffffff"
            >
              {{ assessment.risk_category }}
            </td>
            <td
              width="250"
            >
              {{ assessment.recommended_control }}
            </td>
            <td>

              <!-- <el-button
                  v-if="assessment.overall_risk_rating !== null && assessment.overall_risk_rating > 0"
                  size="mini"
                  type="danger"
                  plain
                  @click="treatRisk(assessment)"
                >
                  Treat
                </el-button> -->
              {{ assessment.assessment_option }}

            </td>
            <td
              v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
              :key="`${revised_impact_data_index}_post`"
            >
              {{ impact_data.impact_value }}

            </td>
            <td>
              {{ assessment.revised_impact_of_occurence }}
            </td>
            <td>
              {{ assessment.revised_likelihood_of_occurence }}
            </td>
            <!-- <td>

                <div style="width: 300px">
                  <span v-html="assessment.revised_impact_rationale" />
                </div>
              </td> -->
            <td>
              {{ assessment.revised_overall_risk_rating }}
            </td>
            <td
              :data-fill-color="customClass(assessment, 'revised_risk_category')"
              data-f-color="ffffff"
            >
              <div
                v-loading="assessment.loader"
              >{{ assessment.revised_risk_category }}
              </div>
            </td>
            <td>
              {{ assessment.risk_owner }}
            </td>
            <td>
              {{ assessment.key_risk_indicator }}
            </td>
          </tr>
        </tbody>
      </table>
      <!--This is where the table id KRIAssessmentTable is defined-->
      <k-r-i-assessment
        :selected-client="selectedClient"
        :standard-id="0"
        :assessment-module="'rcsa'"
        mode="download"
      />
    </div>
    <div v-else>
      <div
        align="center"
        style="margin: 50px;"
      >
        <el-button
          :loading="downloading"
          type="primary"

          @click="exportTableToExcel('riskAssessmentTable', 'KRIAssessmentTable')"
        >
          <feather-icon
            icon="DownloadIcon"
            class="mr-50"
          />
          <span class="align-middle">Export</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import TableToExcel from '@linways/table-to-excel'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import KRIAssessment from './KRIAssessment.vue'

export default {
  components: {
    KRIAssessment,
  },
  directives: {
    Ripple,
  },
  props: {
    standardId: {
      type: Number,
      required: true,
    },
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    likelihoods: {
      type: Array,
      default: () => ({}),
    },
    impacts: {
      type: Array,
      default: () => ({}),
    },
    assessmentModule: {
      type: String,
      default: () => ('rcsa'),
    },
  },
  data() {
    return {
      createAssetModal: false,
      createAssetTypeModal: false,
      showTreatmentModal: false,
      loading: false,
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      riskAssessments: [],
      clients: [],
      searchTerm: '',
      categories: [],
      asset_types: [],
      assets: [],
      assessment_options: ['Effective', 'Ineffective', 'Sub-optimal'],
      downloading: false,
      selectedAssetTypeId: '',
      risk_appetite: null,
      selectedAssessment: '',
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentOption: false,
    }
  },
  created() {
    this.fetchRiskAssessments()
  },
  methods: {
    checkPermission,
    customClass(row, opt) {
      if (opt === 'risk_category') {
        if (row.risk_category === 'High') {
          return 'DD2C2C'
        } if (row.risk_category === 'Medium') {
          return 'F0C63E'
        }
        if (row.risk_category === 'Low') {
          return '3BD135'
        }
      }
      if (opt === 'revised_risk_category') {
        if (row.revised_risk_category === 'High') {
          return 'DD2C2C'
        } if (row.revised_risk_category === 'Medium') {
          return 'F0C63E'
        }
        if (row.revised_risk_category === 'Low') {
          return '3BD135'
        }
      }
      return ''
    },
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('risk-assessment/fetch-risk_assessments')
      fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId, module: app.assessmentModule })
        .then(response => {
          app.riskAssessments = response.risk_assessments
          app.risk_appetite = response.risk_appetite
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    exportTableToExcel(id1, id2) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        // TableToExcel.convert(document.getElementById(id), {
        //   name: 'RiskAssessmentTable.xlsx',
        //   sheet: {
        //     name: 'Sheet 1',
        //   },
        // })
        const table1 = document.getElementById(id1)
        const table2 = document.getElementById(id2)
        const book = TableToExcel.tableToBook(table1, { sheet: { name: 'Risk Universe - User Engagement' } })
        TableToExcel.tableToSheet(book, table2, { sheet: { name: 'Key Risk Indicator Assessment' } })
        TableToExcel.save(book, 'Risk-Register.xlsx')
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
