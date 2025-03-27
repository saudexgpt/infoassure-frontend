<template>
  <div v-loading="loading">
    <div slot="header">
      <span>
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
        <!-- <el-button
          size="mini"
          type="success"

          @click="isCreateSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Create</span>
        </el-button> -->
      </span>
      <!-- <create-risk-assessment
        v-if="isCreateSidebarActive"
        v-model="isCreateSidebarActive"
        :standard-id="standardId"
        :selected-client="selectedClient"
        :assessment-module="assessmentModule"
        @submit="fetchRiskAssessments"
      /> -->
    </div>
    <p />
    <div
      v-if="riskAssessments.length > 0"
      class="table-responsive"
    >
      <b-tabs
        content-class="mt-1"
      >
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Process Level Risk Universe</span>
          </template>

          <table
            id="riskAssessmentTable"
            class="table table-bordered table-striped"
          >
            <thead>
              <tr>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Business Unit</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Business Process</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >RISK ID</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >RISK TYPE</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >RISK DESCRIPTION</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Impact/Outcome</th>
                <th
                  v-for="impact_data in riskAssessments[0].impact_data"
                  :key="`${impact_data.slug}_pre`"
                  div

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                > {{ impact_data.name }}</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Impact of Occurence</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Likelihood of Occurence</th>
                <!-- <th

              data-fill-color="333333"
              data-b-a-s="thin" data-f-color="ffffff"
            >Impact Rationale</th> -->
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Overall Rating</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Inherent Risk Rating</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Control/Mitigating Actions</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Control Effectiveness Level</th>
                <th
                  v-for="impact_data in riskAssessments[0].revised_impact_data"
                  :key="`${impact_data.slug}_post`"

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                > {{ impact_data.name }}</th>
                <th
                  data-fill-color="45058d"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Impact of Occurence</th>
                <th
                  data-fill-color="45058d"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Likelihood of Occurence</th>
                <!-- <th

              data-fill-color="333333"
              data-b-a-s="thin" data-f-color="ffffff"
            >Impact Rationale</th> -->
                <th
                  data-fill-color="45058d"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Overall Rating</th>
                <th
                  data-fill-color="45058d"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Residual Risk Rating</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Primary Risk Owners</th>
                <th
                  data-fill-color="46035a"
                  data-b-a-s="thin"
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
                  <div style="width: 300px">
                    <!-- eslint-disable-next-line vue/no-v-html-->
                    <span v-html="assessment.outcome" />
                  </div>
                </td>
                <td
                  v-for="(impact_data, impact_data_index) in assessment.impact_data"
                  :key="impact_data_index"
                >

                  {{ formatImpactValue(impact_data.impact_value) }}

                </td>
                <td>

                  {{ assessment.impact_of_occurence }}

                </td>
                <td>

                  {{ assessment.likelihood_of_occurence }}

                </td>
                <td>

                  {{ assessment.overall_risk_rating }}

                </td>
                <td
                  :style="`background: #${assessment.level_color}`"
                  :data-fill-color="assessment.level_color"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  {{ assessment.risk_category }}
                </td>
                <td>
                  <div style="width: 300px">

                    <!--eslint-disable-next-line vue/no-v-html -->
                    <span v-html="assessment.recommended_control" />
                  </div>
                </td>
                <td>
                  {{ assessment.control_effectiveness_level }}

                </td>
                <td
                  v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
                  :key="`${revised_impact_data_index}_post`"
                >
                  {{ formatImpactValue(impact_data.impact_value) }}

                </td>
                <td>
                  {{ assessment.revised_impact_of_occurence }}
                </td>
                <td>
                  {{ assessment.revised_likelihood_of_occurence }}
                </td>
                <td>
                  {{ assessment.revised_overall_risk_rating }}
                </td>
                <td
                  :style="`background: #${assessment.revised_level_color}`"
                  :data-fill-color="assessment.revised_level_color"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >
                  <div>{{ assessment.revised_risk_category }}
                  </div>
                </td>
                <td>
                  {{ assessment.risk_owner }}
                </td>
                <td>
                  <div style="width: 300px">
                    <!--eslint-disable-next-line vue/no-v-html -->
                    <span v-html="assessment.key_risk_indicator" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </b-tab>
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="AlertTriangleIcon" />
            <span>Key Risk Indicator Assessment</span>
          </template>

          <div
            v-if="downloading"
          >
            <table
              id="KRIAssessmentTable"
              class="table table-bordered table-striped"
            >
              <thead>
                <tr>
                  <th
                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-b-a-s="thin"
                    :rowspan="2"
                    colspan="4"
                  />
                  <th
                    v-for="quarterCount in 4"
                    :key="quarterCount"
                    data-fill-color="3A61C2"
                    data-f-color="ffffff"
                    data-a-h="center"
                    data-b-a-s="thin"
                    :colspan="12"
                    style="text-align: center;"
                  >Quater {{ quarterCount }}</th>
                </tr>
                <tr>
                  <th
                    v-for="monthCount in 12"
                    :key="monthCount"
                    data-fill-color="673AC2"
                    data-f-color="ffffff"
                    data-a-h="center"
                    data-b-a-s="thin"
                    :colspan="4"
                    style="text-align: center;"
                  >Month {{ monthCount }}</th>
                </tr>
                <tr>
                  <th

                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-b-a-s="thin"
                  >KRI</th>
                  <th

                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-b-a-s="thin"
                  >Frequency of Assessment</th>
                  <th

                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-b-a-s="thin"
                  >Unit of Measurement</th>
                  <th

                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-b-a-s="thin"
                  >Comment</th>
                  <th
                    v-for="weekCount in 48"
                    :key="weekCount"
                    data-fill-color="333333"
                    data-f-color="ffffff"
                    data-a-h="center"
                    data-b-a-s="thin"
                    style="text-align: center;"
                  >Week {{ weekCount }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(assessment, index) in riskAssessments"
                  :key="index"
                >
                  <td data-b-a-s="thin">
                    <div style="width: 250px">
                      {{ assessment.kri }}
                    </div>
                  </td>
                  <td data-b-a-s="thin">
                    <div style="width: 250px">
                      {{ assessment.frequency_of_assessment }}
                    </div>
                  </td>
                  <td data-b-a-s="thin">
                    {{ assessment.unit_of_measurement }}
                  </td>
                  <td data-b-a-s="thin">
                    <div style="width: 300px">
                      {{ assessment.comment }}
                    </div>
                  </td>
                  <td
                    v-for="(no_of_assessment, assess_index) in number_of_assessments[assessment.frequency_of_assessment]"
                    :key="assess_index"
                    :colspan="parseInt(48 / number_of_assessments[assessment.frequency_of_assessment])"
                    :data-fill-color="assessment.assessments[no_of_assessment][1].slice(1)"
                    data-f-color="000000"
                    data-a-h="center"
                    data-b-a-s="thin"
                    :style="`padding: 20px; background: ${assessment.assessments[no_of_assessment][1]}; color: #000000;`"
                  >
                    {{ assessment.assessments[no_of_assessment][0] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <k-r-i-assessment
            v-else
            :risk-assessments="riskAssessments"
            mode="manage"
          />
        </b-tab>
      </b-tabs>
    </div>
    <div v-else>
      <el-empty />
    </div>
  </div>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import KRIAssessment from './KRIAssessment.vue'

export default {
  components: {
    KRIAssessment,
    BTabs,
    BTab,
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
      downloading: false,
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      riskAssessments: [],
      clients: [],
      searchTerm: '',
      categories: [],
      assessment_options: ['Effective', 'Ineffective', 'Sub-optimal'],
      selectedAssetTypeId: '',
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
    customClassName({
      row, column,
    }) {
      if (column.label === 'Risk Category') {
        if (row.risk_category === 'High') {
          return 'btn-danger'
        } if (row.risk_category === 'Medium') {
          return 'btn-warning'
        }
        if (row.risk_category === 'Low') {
          return 'btn-success'
        }
      }
      if (column.label === 'Revised Risk') {
        if (row.revised_risk_category === 'High') {
          return 'btn-danger'
        } if (row.revised_risk_category === 'Medium') {
          return 'btn-warning'
        }
        if (row.revised_risk_category === 'Low') {
          return 'btn-success'
        }
      }
      return ''
    },
    formatImpactValue(value) {
      const app = this
      let valueStr = ''
      app.impacts.forEach(impact => {
        // eslint-disable-next-line radix
        if (parseInt(value) === parseInt(impact.value)) {
          valueStr = impact.name
        }
      })
      return valueStr
    },
    // customClass(row, opt) {
    //   if (opt === 'risk_category') {
    //     if (row.risk_category === 'High') {
    //       return 'DD2C2C'
    //     } if (row.risk_category === 'Medium') {
    //       return 'F0C63E'
    //     }
    //     if (row.risk_category === 'Low') {
    //       return '3BD135'
    //     }
    //   }
    //   if (opt === 'revised_risk_category') {
    //     if (row.revised_risk_category === 'High') {
    //       return 'DD2C2C'
    //     } if (row.revised_risk_category === 'Medium') {
    //       return 'F0C63E'
    //     }
    //     if (row.revised_risk_category === 'Low') {
    //       return '3BD135'
    //     }
    //   }
    //   return ''
    // },
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('rcsa/fetch-risk-assessments')
      fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId, module: app.assessmentModule })
        .then(response => {
          app.riskAssessments = response.risk_assessments
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateField(value, field, assessment, subField = '') {
      const app = this
      const params = {
        field, value, sub_field: subField,
      }
      // eslint-disable-next-line no-param-reassign
      // assessment.loader = true
      const fetchClientsResource = new Resource('rcsa/update-risk-assessment-fields')
      fetchClientsResource.update(assessment.id, params)
        .then(() => {
          // app.risk_assessments[assessment.index] = response
          app.fetchRiskAssessments(false)
          // eslint-disable-next-line no-param-reassign
          assessment.loader = false
        }).catch(() => {
          // eslint-disable-next-line no-param-reassign
          assessment.loader = false
        })
    },
    treatRisk(assessment) {
      const app = this
      const riskValue = assessment.risk_value
      const riskAppetite = app.risk_appetite
      if (riskValue <= riskAppetite) {
        app.treatment_comment = `Your Risk Value of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk, it's up to you.`
        app.treatment_alert_type = 'success'
        app.showTreatmentOption = false
      }
      if (riskValue > riskAppetite) {
        app.treatment_comment = `Your Risk Value of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        app.treatment_alert_type = 'error'
        app.showTreatmentOption = true
      }
      app.selectedAssessment = assessment
      app.showTreatmentModal = true
    },
    formatIds(value, option) {
      const app = this
      const { likelihoods } = app
      const { impacts } = app
      let val = ''
      if (option === 'likelihood') {
        likelihoods.forEach(likelihood => {
          if (value === likelihood.id) {
            val = `${likelihood.id}-${likelihood.name}`
          }
        })
      }
      if (option === 'impact') {
        impacts.forEach(impact => {
          if (value === impact.id) {
            val = `${impact.id}-${impact.name}`
          }
        })
      }
      return val
    },
    exportTableToExcel(id1, id2) {
      const app = this
      app.downloading = true
      setTimeout(() => {
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
