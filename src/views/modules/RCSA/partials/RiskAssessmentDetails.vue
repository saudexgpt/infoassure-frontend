<template>
  <div v-loading="loading">
    <div slot="header">
      <span>
        <el-button
          size="mini"
          type="success"

          @click="isCreateSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Create</span>
        </el-button>
      </span>
      <!-- CREATE NEW RISK ASSESSMENT-->
      <create-risk-assessment
        v-if="isCreateSidebarActive"
        v-model="isCreateSidebarActive"
        :standard-id="standardId"
        :selected-client="selectedClient"
        :assessment-module="assessmentModule"
        @submit="fetchRiskAssessments"
      />
    </div>
    <p />
    <div
      v-if="riskAssessments.length > 0"
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
        <tbody v-if="!downloading">
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
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.outcome" />
              </div>
            </td>
            <td
              v-for="(impact_data, impact_data_index) in assessment.impact_data"
              :key="impact_data_index"
            >

              <select
                v-model="impact_data.impact_value"
                placeholder="Select Impact Value"
                @change="updateField($event.target.value, 'impact_data', assessment, impact_data.slug)"
              >
                <option
                  v-for="(impact, c_index) in impacts"
                  :key="c_index + index"
                  :label="`${impact.value}-${impact.name}`"
                  :value="impact.value"
                />
              </select>

            </td>
            <td>

              <span v-loading="assessment.loader">{{ assessment.impact_of_occurence }}</span>

            </td>
            <td>

              <select
                v-model="assessment.likelihood_of_occurence"
                placeholder="Select Likelihood Value"
                @change="updateField($event.target.value, 'likelihood_of_occurence', assessment)"
              >
                <option
                  v-for="(likelihood, l_index1) in likelihoods"
                  :key="l_index1"
                  :label="`${likelihood.value}-${likelihood.name}`"
                  :value="likelihood.value"
                />
              </select>

            </td>
            <!-- <td>

              <div style="width: 300px">
                <span v-html="assessment.impact_rationale" />
              </div>
            </td> -->
            <td>

              <span v-loading="assessment.loader">{{ assessment.overall_risk_rating }}</span>

            </td>
            <td :style="`background: #${assessment.level_color}`">
              <div
                v-loading="assessment.loader"
              >{{ assessment.risk_category }}
              </div>
            </td>
            <td
              width="250"
            >
              <textarea
                v-model="assessment.recommended_control"
                placeholder="Recommend control"
                type="text"
                @blur="updateField($event.target.value, 'recommended_control', assessment)"
              />
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
              <select
                v-model="assessment.control_effectiveness_level"
                placeholder="Select"
                @change="updateField($event.target.value, 'control_effectiveness_level', assessment)"
              >
                <option
                  v-for="(assessment_option, option_index) in assessment_options"
                  :key="option_index"
                  :label="assessment_option"
                  :value="assessment_option"
                />
              </select>

            </td>
            <td
              v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
              :key="`${revised_impact_data_index}_post`"
            >
              <select
                v-model="impact_data.impact_value"
                placeholder="Select Impact Value"
                @change="updateField($event.target.value, 'revised_impact_data', assessment, impact_data.slug )"
              >
                <option
                  v-for="(impact, r_index) in impacts"
                  :key="r_index + index"
                  :label="`${impact.value}-${impact.name}`"
                  :value="impact.value"
                />
              </select>

            </td>
            <td>
              <span v-loading="assessment.loader">{{ assessment.revised_impact_of_occurence }}</span>

            </td>
            <td>
              <select
                v-model="assessment.revised_likelihood_of_occurence"
                placeholder="Select"
                @change="updateField($event.target.value, 'revised_likelihood_of_occurence', assessment)"
              >
                <option
                  v-for="(likelihood, l_index) in likelihoods"
                  :key="l_index"
                  :label="`${likelihood.value}-${likelihood.name}`"
                  :value="likelihood.value"
                />
                <option
                  value="0"
                  label="N/A"
                />
              </select>
            </td>
            <!-- <td>

              <div style="width: 300px">
                <span v-html="assessment.revised_impact_rationale" />
              </div>
            </td> -->
            <td>
              <span v-loading="assessment.loader">{{ assessment.revised_overall_risk_rating }}</span>

            </td>
            <td :style="`background: #${assessment.revised_level_color}`">
              <div
                v-loading="assessment.loader"
              >{{ assessment.revised_risk_category }}
              </div>
            </td>
            <td>
              {{ assessment.risk_owner }}
            </td>
            <td>
              <textarea
                v-model="assessment.key_risk_indicator"
                placeholder=""
                type="text"
                @blur="updateField($event.target.value, 'key_risk_indicator', assessment)"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
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
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.outcome" />
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
              :data-fill-color="assessment.level_color"
              data-b-a-s="thin"
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
              :data-fill-color="assessment.revised_level_color"
              data-b-a-s="thin"
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
    </div>
    <div v-else>
      <el-empty />
    </div>
  </div>
</template>

<script>
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateRiskAssessment from './CreateRiskAssessment.vue'

export default {
  components: {
    CreateRiskAssessment,
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
      assessment_options: ['Effective', 'Ineffective', 'Sub-optimal'],
      downloading: false,
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
    createAsset(asseTypeId) {
      const app = this
      if (asseTypeId === '' || asseTypeId === null) {
        app.$alert('Please select an asset type')
      } else {
        app.selectedAssetTypeId = asseTypeId
        app.createAssetModal = true
      }
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
  },
}
</script>
  <style lang="scss" >
  @import '@core/scss/vue/libs/vue-good-table.scss';
  </style>
