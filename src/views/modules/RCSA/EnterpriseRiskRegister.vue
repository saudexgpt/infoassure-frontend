<template>
  <el-card v-loading="loading">
    <div slot="header">
      <h4>Enterprise Risk Register</h4>
    </div>
    <p />
    <div
      v-if="riskAssessments.length > 0"
    >
      <b-row>
        <b-col md="9">
          <table
            id="riskAssessmentTable"
            class="table table-bordered table-striped table-responsive"
          >
            <thead>
              <tr>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >REF</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Risk Category</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >RISK Sub-Category</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Risk Description</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Impact/Outcome</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Impact Rating</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Control/Mitigating Actions</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Likelihood Rating</th>
                <!-- <th

              data-fill-color="333333"
              data-b-a-s="thin" data-f-color="ffffff"
            >Impact Rationale</th> -->
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Risk Score</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Control Effectiveness</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Risk Status</th>
                <th

                  data-fill-color="333333"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                >Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(assessment, index) in riskAssessments"
                :key="index"
              >
                <td>
                  <div>
                    {{ assessment.risk_id }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ assessment.type }}
                  </div>
                </td>
                <td>{{ assessment.sub_type }}</td>
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
                <td>

                  {{ assessment.impact_of_occurence }}

                </td>
                <td>
                  <div style="width: 300px">
                    {{ assessment.recommended_control }}
                  </div>
                </td>
                <td>

                  {{ assessment.likelihood_of_occurence }}

                </td>
                <td>

                  {{ assessment.overall_risk_rating }}

                </td>
                <td>
                  {{ assessment.control_effectiveness_level }}
                </td>
                <td>
                  {{ assessment.status }}
                </td>
                <td>
                  {{ assessment.comments }}
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col md="3">
          <aside>
            <div align="center">
              <h4>Assessment Summary</h4>
              <img
                :src="changeImpactImage(average_risk_score)"
              >
              <h4><strong>{{ overall_rating }}</strong></h4>
            </div>
            <p>
              Overall Impact Rating: <strong>{{ overall_impact_rating }}</strong><br>
              Overall Likelihood Rating: <strong>{{ overall_likelihood_rating }}</strong><br>
              Average Risk Score: <strong>{{ average_risk_score }}</strong><br>
            </p>
          </aside>
        </b-col>
      </b-row>

    </div>
    <div v-else>
      <el-empty />
    </div>
  </el-card>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BRow, BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    assessmentModule: {
      type: String,
      default: () => ('rcsa'),
    },
  },
  data() {
    return {
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
      overall_impact_rating: 0,
      overall_likelihood_rating: 0,
      average_risk_score: 0,
      overall_rating: 'None',
    }
  },
  created() {
    this.fetchRiskAssessments()
  },
  methods: {
    checkPermission,
    changeImpactImage(score) {
      const app = this
      if (score >= 15) {
        app.overall_rating = 'Very high'
        return 'images/project-icons/very-high.png'
      } if (score >= 8 && score <= 14) {
        app.overall_rating = 'High'
        return 'images/project-icons/high.png'
      } if (score >= 4 && score <= 7) {
        app.overall_rating = 'Medium'
        return 'images/project-icons/medium.png'
      } if (score >= 1 && score <= 3) {
        app.overall_rating = 'Low'
        return 'images/project-icons/low.png'
      }
      app.overall_rating = 'None'
      return 'images/project-icons/no-impact-level.png'
    },
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('rcsa/calculate-enterprise-risk-register')
      fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId, module: app.assessmentModule })
        .then(response => {
          app.riskAssessments = response.risk_assessments
          app.overall_impact_rating = response.overall_impact_rating
          app.overall_likelihood_rating = response.overall_likelihood_rating
          app.average_risk_score = response.average_risk_score
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
