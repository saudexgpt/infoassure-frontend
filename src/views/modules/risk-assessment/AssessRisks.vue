<template>
  <el-card>
    <div v-if="selectedClient !== ''">
      <el-tabs content-class="mt-1">
        <el-tab lazy>
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>View Assessments</span>
          </template>
          <view-risk-assessment
            v-loading="loading"
            :selected-client="selectedClient"
            :standard-id="standardId"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :assessment-module="assessmentModule"
          />
        </el-tab>
        <el-tab lazy>
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>Assessment Summary</span>
          </template>
          <risk-assessment-summary :selected-client="selectedClient" :standard-id="standardId" />
        </el-tab>
        <!-- <el-tab
          lazy
        >
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>Risk Ranking Matrix</span>
          </template>
          <risk-ranking-matrix />
        </el-tab> -->
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
// import Assessment from './partials/Assessment.vue'
import ViewRiskAssessment from './ViewRiskAssessment.vue'
// import RiskRankingMatrix from './RiskRankingMatrix.vue'
import RiskAssessmentSummary from './partials/Summary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // Assessment,
    ViewRiskAssessment,
    // RiskRankingMatrix,
    RiskAssessmentSummary
  },
  props: {
    selectedClient: {
      type: Object,
      required: true
    },
    standardId: {
      type: Number,
      required: true
    },
    assessmentModule: {
      type: String,
      default: () => 'ra'
    }
  },
  data() {
    return {
      clients: [],
      impacts: [],
      likelihoods: [],
      risk_assessments: [],
      loading: false
    }
  },
  created() {
    this.setMatrix()
  },
  methods: {
    checkPermission,
    // fetchRiskAssessments(load = true) {
    //
    //   this.loading = load
    //   const fetchRiskAssessmentsResource = new Resource('risk-assessment/fetch-risk_assessments')
    //   fetchRiskAssessmentsResource.list({ client_id: this.selectedClient.id, standard_id: this.standardId })
    //     .then(response => {
    //       this.risk_assessments = response.risk_assessments
    //       this.loading = false
    //     }).catch(() => { this.loading = false })
    // },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      this.loading = true
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.loading = false
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    }
  }
}
</script>
