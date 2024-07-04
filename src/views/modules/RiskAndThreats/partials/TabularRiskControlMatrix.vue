<template>
  <div>
    <!-- <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            filterable
            @input="fetchRisks()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit.id"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside> -->
    <div v-if="form.business_unit_id !== ''">
      <el-button
        type="primary"
        @click="exportToExcel('RCMReport')"
      >
        Export
      </el-button>
      <p />
      <div class="table-responsive">
        <table
          id="RCMReport"
          v-loading="loading"
          class="table table-bordered"
        >
          <thead>
            <tr>
              <template v-if="assessmentModule === 'rcsa'">
                <th

                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="14"
                >
                  <div style="width: 10px">
                    L1
                  </div>
                </th>
                <th

                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="14"
                >
                  <div style="width: 10px">
                    L2
                  </div>
                </th>
                <th

                  data-fill-color="333333"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="14"
                >
                  <div style="width: 10px">
                    L3
                  </div>
                </th>
              </template>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  PROCESS ID
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 150px">
                  DEPARTMENT/BUSINESS UNIT
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  PROCESS
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  RISK NO.
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  RISK CATEGORY
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  RISK SUB-CATEGORY
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 150px">
                  RISK OWNER
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  RISK DESCRIPTION
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  IMPACT/OUTCOME
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  CONTROL NO.
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  CONTROL LOCATION
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  CONTROL DESCRIPTION
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  CONTROL OWNER
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  FREQUENCY
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  CONTROL TYPE
                </div>
              </th>
              <th
                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  NATURE OF CONTROL
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  APPLICATION USED
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  COMPENSATING CONTROL
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  TEST PROCEDURES
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  SAMPLE SIZE
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  DATA REQUIRED
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  LINK TO EVIDENCE
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  TEST CONCLUSION
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  GAP DESCRIPTION
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  TOD IMPROVEMENT OPPORTUNITY (IF ANY)
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  RECOMMENDATION
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  RESPONSIBILITY
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  TIMELINE
                </div>
              </th>
              <th

                data-fill-color="333333"
                data-f-color="ffffff"
                style="font-size: 14px;"
                data-f-sz="14"
              >
                <div style="width: 250px">
                  TOD GAP STATUS
                </div>
              </th>
            </tr>
          </thead>
          <!-- <tbody v-if="!downloading">
            <template
              v-for="(report, index) in risk_registers"
            >

              <tr :key="index">
                <template v-if="assessmentModule === 'rcsa'">
                  <td>
                    {{ (report.teams.split(',').length > 0) ? report.teams.split(',')[0] : '' }}
                  </td>
                  <td>
                    {{ (report.teams.split(',').length > 1) ? report.teams.split(',')[1] : '' }}
                  </td>
                  <td>
                    {{ (report.teams.split(',').length > 2) ? report.teams.split(',')[2] : '' }}
                  </td>
                </template>
                <td>
                  {{ report.generated_process_id }}
                </td>
                <td>
                  {{ report.business_unit }}
                </td>
                <td>{{ report.business_process }}</td>
                <td>{{ report.risk_id }}</td>
                <td>
                  {{ report.type }}
                </td>
                <td>
                  {{ report.sub_type }}
                </td>
                <td>
                  <input
                    v-model="report.risk_owner"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'risk_owner', report)"
                  >
                </td>
                <td>
                  <textarea
                    v-model="report.vulnerability_description"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'vulnerability_description', report)"
                  />
                </td>
                <td>
                  <textarea
                    v-model="report.outcome"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'outcome', report)"
                  />
                </td>
                <td>{{ report.control_no }}</td>
                <td>
                  <select
                    v-model="report.control_location"
                    class="form-control"
                    @change="updateField($event, 'control_location', report)"
                  >
                    <option
                      label="Business Unit"
                      value="Business Unit"
                    />
                    <option
                      label="Centralised"
                      value="Centralised"
                    />
                    <option
                      label="N/A"
                      value="N/A"
                    />
                  </select>
                </td>
                <td>
                  <textarea
                    v-model="report.control_description"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'control_description', report)"
                  />
                </td>
                <td>
                  <input
                    v-model="report.control_owner"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'control_owner', report)"
                  >
                </td>
                <td>
                  <select
                    v-model="report.control_frequency"
                    class="form-control"
                    @change="updateField($event, 'control_frequency', report)"
                  >
                    <option
                      v-for="(frequency, freg_index) in control_frequencies"
                      :key="freg_index"
                      :value="frequency"
                      :label="frequency"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.control_type"
                    placeholder="Select Type"
                    class="form-control"
                    @change="updateField($event, 'control_type', report)"
                  >
                    <option
                      label="Preventive"
                      value="Preventive"
                    />
                    <option
                      label="Detective"
                      value="Detective"
                    />
                    <option
                      label="N/A"
                      value="N/A"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.nature_of_control"
                    class="form-control"
                    @change="updateField($event, 'nature_of_control', report)"
                  >
                    <option
                      label="Automated"
                      value="Automated"
                    />
                    <option
                      label="Hybrid"
                      value="Hybrid"
                    />
                    <option
                      label="Manual"
                      value="Manual"
                    />
                    <option
                      label="N/A"
                      value="N/A"
                    />
                  </select>
                </td>
                <td>
                  <input
                    v-model="report.application_used_for_control"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'application_used_for_control', report)"
                  >
                </td>
                <td>
                  <textarea
                    v-model="report.compensating_control"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'compensating_control', report)"
                  />
                </td>
                <td>
                  <textarea
                    v-model="report.test_procedures"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'test_procedures', report)"
                  />
                </td>
                <td>
                  <input
                    v-model="report.sample_size"
                    type="number"
                    min="1"
                    @blur="updateField($event, 'sample_size', report)"
                  >
                </td>
                <td>
                  <textarea
                    v-model="report.data_required"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'data_required', report)"
                  />
                </td>
                <td>
                  <a
                    :href="baseServerUrl+'storage/'+report.link_to_evidence"
                    target="_blank"
                    style="color: #409EFF;"
                  >Click link to evidence</a></td>
                <td>
                  <select
                    v-model="report.test_conclusion"
                    placeholder="Select"
                    class="form-control"
                    @change="updateField($event, 'test_conclusion', report)"
                  >
                    <option
                      label="Adequate"
                      value="Adequate"
                    />
                    <option
                      label="Inadequate"
                      value="Inadequate"
                    />
                    <option
                      label="Sub-optimal"
                      value="Sub-optimal"
                    />
                  </select>
                </td>
                <td>
                  <textarea
                    v-model="report.gap_description"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'gap_description', report)"
                  />
                </td>
                <td>
                  <textarea
                    v-model="report.tod_improvement_opportunity"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'tod_improvement_opportunity', report)"
                  />
                </td>
                <td>
                  <textarea
                    v-model="report.recommendation"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'recommendation', report)"
                  />
                </td>
                <td>
                  <input
                    v-model="report.responsibility"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'responsibility', report)"
                  >
                </td>
                <td>
                  <input
                    v-model="report.timeline"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'timeline', report)"
                  >
                </td>
                <td>
                  <input
                    v-model="report.tod_gap_status"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'tod_gap_status', report)"
                  >
                </td>
              </tr>
            </template>

          </tbody> -->
          <tbody>
            <template
              v-for="(report, index) in risk_registers"
            >

              <tr :key="index">
                <template v-if="assessmentModule === 'rcsa'">
                  <td>
                    {{ report.l1 }}
                  </td>
                  <td>
                    {{ report.l2 }}
                  </td>
                  <td>
                    {{ report.sub_unit }}
                  </td>
                </template>
                <td>
                  {{ report.generated_process_id }}
                </td>
                <td>
                  {{ report.business_unit }}
                </td>
                <td>{{ report.business_process }}</td>
                <td>{{ report.risk_id }}</td>
                <td>{{ report.type }}</td>
                <td>{{ report.sub_type }}</td>
                <td>
                  {{ report.risk_owner }}
                </td>
                <td>
                  {{ report.vulnerability_description }}
                </td>
                <td>
                  <!-- eslint-disable-next-line vue/no-v-html-->
                  <span v-html="report.outcome" />
                </td>
                <td>{{ report.control_no }}</td>
                <td>
                  {{ report.control_location }}
                </td>
                <td>
                  {{ report.control_description }}
                </td>
                <td>
                  {{ report.control_owner }}
                </td>
                <td>
                  {{ report.control_frequency }}
                </td>
                <td>
                  {{ report.control_type }}
                </td>
                <td>
                  {{ report.nature_of_control }}
                </td>
                <td>
                  {{ report.application_used_for_control }}
                </td>
                <td>
                  {{ report.compensating_control }}
                </td>
                <td>
                  {{ report.test_procedures }}
                </td>
                <td>
                  {{ report.sample_size }}
                </td>
                <td>
                  {{ report.data_required }}
                </td>
                <td>
                  <a
                    v-if="report.link_to_evidence !== null"
                    :href="baseServerUrl+'storage/'+report.link_to_evidence"
                  >{{ baseServerUrl+'storage/'+report.link_to_evidence }}</a>
                </td>
                <td>
                  {{ report.test_conclusion }}
                </td>
                <td>
                  {{ report.gap_description }}
                </td>
                <td>
                  {{ report.tod_improvement_opportunity }}
                </td>
                <td>
                  {{ report.recommendation }}
                </td>
                <td>
                  {{ report.responsibility }}
                </td>
                <td>
                  {{ report.timeline }}
                </td>
                <td>
                  {{ report.tod_gap_status }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
// import {
//   BButton,
// } from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import TableToExcel from '@linways/table-to-excel'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    clientId: {
      type: Number,
      default: null,
    },
    businessUnitId: {
      type: Number,
      default: null,
    },
    assessmentModule: {
      type: String,
      default: () => { 'ra' },
    },
  },
  data() {
    return {
      loading: false,
      downloading: false,
      control_frequencies: ['Per Transaction', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Biannually', 'Annually', 'N/A', 'Per Merchant', 'Per Terminal Request'],
      risk_types: [],
      risk_registers: [],
      clients: [],
      business_units: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      form: {
        client_id: '',
        business_unit_id: '',
      },
      selectedRisk: null,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  watch: {
    businessUnitId() {
      this.form.client_id = this.clientId
      this.form.business_unit_id = this.businessUnitId
      this.fetchRisks()
    },
  },
  created() {
    this.form.client_id = this.clientId
    this.form.business_unit_id = this.businessUnitId
    this.fetchRiskCategories()
    this.fetchRisks()
  },
  methods: {
    checkPermission,
    fetchRiskCategories() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      fetchEntryResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.risk_types = response.categories
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    // fetchBusinessUnits() {
    //   const app = this
    //   app.form.business_unit_id = ''
    //   const fetchCriteriaResource = new Resource('business-units/fetch-business-units')
    //   fetchCriteriaResource.list({ client_id: app.form.client_id })
    //     .then(response => {
    //       app.business_units = response.business_units
    //     }).catch(() => { app.loading = false })
    // },
    fetchRisks() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource.list({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.risk_registers = response.risk_registers
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateField($event, field, assessment) {
      const app = this
      const params = { field, value: $event.target.value }
      const updateResource = new Resource('update-risk-register')
      updateResource.update(assessment.id, params)
        .then(() => {
          app.$emit('reload')
        })
    },
    exportToExcel(id) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'RCM-Report.xlsx',
          sheet: {
            name: 'Sheet 1',
          },
        })
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('risk-assessment/destroy')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchRisks()
            app.loading = false
          })
      }
    },
  },
}
</script>
      <style lang="scss" >
      @import '@core/scss/vue/libs/vue-good-table.scss';
      </style>
