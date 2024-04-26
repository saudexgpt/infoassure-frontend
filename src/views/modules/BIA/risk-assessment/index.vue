<template>
  <el-card>
    <!-- <aside>
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
    </aside> -->
    <div>
      <b-tabs
        content-class="mt-1"
      >
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Risk Assessment Activity</span>
          </template>

          <assess-risk

            v-loading="loading"
            :client-id="clientId"
            :business-unit-id="businessUnitId"
            :business-processes="business_processes"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :matrix="matrix"
            @submit="fetchRiskAssessments(false)"
          />
          <view-risk-assessment
            v-loading="loading"
            :client-id="clientId"
            :business-unit-id="businessUnitId"
            :business-processes="business_processes"
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
            :client-id="clientId"
            :business-unit-id="businessUnitId"
            :business-processes="business_processes"
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
import AssessRisk from './AssessRisk.vue'
import ViewRiskAssessment from './ViewRiskAssessment.vue'
import RiskRankingMatrix from './RiskRankingMatrix.vue'
import RiskAssessmentSummary from './Summary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    AssessRisk,
    ViewRiskAssessment,
    RiskRankingMatrix,
    RiskAssessmentSummary,
  },
  props: {
    businessUnitId: {
      type: Number,
      default: null,
    },
    clientId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      clients: [],
      matrix: '3x3',
      impacts: [],
      likelihoods: [],
      risk_assessments: [],
      business_processes: [],
      loading: false,
    }
  },
  created() {
    this.setMatrix()
    this.fetchRiskAssessments()
    this.fetchBusinessProcesses()
  },
  methods: {
    checkPermission,
    fetchBusinessProcesses() {
      const app = this
      app.loading = true
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource.list({ business_unit_id: app.businessUnitId })
        .then(response => {
          app.business_processes = response.business_processes
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('bia/fetch-risk-assessment')
      fetchRiskAssessmentsResource.list({ client_id: app.clientId, business_unit_id: app.businessUnitId })
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
