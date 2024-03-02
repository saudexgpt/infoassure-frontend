<template>
  <el-card>
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="10"
          :md="10"
        >
          <el-select
            v-model="matrix"
            placeholder="Select Matrix"
            style="width: 100%;"
            @input="setMatrix()"
          >
            <el-option
              value="3x3"
              label="3x3 Matrix"
            />
            <el-option
              value="5x5"
              label="5x5 Matrix"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <div v-if="selectedClient !== ''">
      <b-tabs
        content-class="mt-1"
      >
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Risk Assessment Details</span>
          </template>

          <assessment

            v-loading="loading"
            :selected-client="selectedClient"
            :standard-id="standardId"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :matrix="matrix"
            @submit="fetchRiskAssessments(false)"
          />
          <view-risk-assessment
            v-loading="loading"
            :selected-client="selectedClient"
            :standard-id="standardId"
            :risk-assessments="risk_assessments"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :matrix="matrix"
            @reload="fetchRiskAssessments(false)"
          />
        </b-tab>
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>Risk Assessment Summary</span>
          </template>
          <risk-assessment-summary
            :selected-client="selectedClient"
            :standard-id="standardId"
          />
        </b-tab>
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>Risk Ranking Matrix</span>
          </template>
          <risk-ranking-matrix :matrix="matrix" />
        </b-tab>
      </b-tabs>
    </div>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import Assessment from './partials/Assessment.vue'
import ViewRiskAssessment from './ViewRiskAssessment.vue'
import RiskRankingMatrix from './RiskRankingMatrix.vue'
import RiskAssessmentSummary from './partials/Summary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    Assessment,
    ViewRiskAssessment,
    RiskRankingMatrix,
    RiskAssessmentSummary,
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
      clients: [],
      matrix: '3x3',
      impacts: [],
      likelihoods: [],
      risk_assessments: [],
      loading: false,
    }
  },
  created() {
    this.fetchRiskAssessments()
    this.setMatrix()
  },
  methods: {
    checkPermission,
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('risk-assessment/fetch-risk_assessments')
      fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId })
        .then(response => {
          app.risk_assessments = response.risk_assessments
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const app = this
      app.loading = true
      const param = { matrix: app.matrix }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list(param)
        .then(response => {
          app.loading = false
          app.impacts = response.impacts
        })
        .catch(error => {
          app.loading = false
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const app = this
      const param = { matrix: app.matrix }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource.list(param)
        .then(response => {
          app.likelihoods = response.likelihoods
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
  },
}
</script>
