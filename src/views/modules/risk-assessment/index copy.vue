<template>
  <el-tabs
    v-if="selectedClient !== ''"
    type="border-card"
  >
    <el-tab-pane
      lazy
    >
      <template slot="label">
        <span>ISMS Risk Assessment</span>
      </template>
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
            <view-risk-assessment
              :selected-client="selectedClient"
              :standard-id="0"
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
              :data="summary"
              :selected-client="selectedClient"
            />
          </b-tab>
        </b-tabs>
      </div>
    </el-tab-pane>
    <el-tab-pane
      lazy
    >
      <template slot="label">
        <span>DPIA</span>
      </template>
      <d-p-i-a
        :selected-client="selectedClient"
        :standard-id="0"
      />
    </el-tab-pane>
    <el-tab-pane
      lazy
    >
      <template slot="label">
        <span>BIA</span>
      </template>
      <div v-if="selectedClient !== ''">
        <el-select
          v-model="selectedBusinessUnit"
          placeholder="Select Business Unit"
          value-key="id"
          style="width: 50%;"
          filterable
        >
          <el-option
            v-for="(business_unit, index) in business_units"
            :key="index"
            :value="business_unit"
            :label="business_unit.unit_name"
          />
        </el-select>
        <p />
        <b-i-a
          v-if="selectedBusinessUnit !== ''"
          :client-id="selectedClient.id"
          :business-unit-id="selectedBusinessUnit.id"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane
      lazy
    >
      <template slot="label">
        <span>RCSA</span>
      </template>
      <div v-if="selectedClient !== ''">
        <r-c-s-a />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
// import Setup from './partials/Setup.vue'
// import Assessment from './partials/Assessment.vue'
import ViewRiskAssessment from './ViewRiskAssessment.vue'
import DPIA from '@/views/modules/DPIA/index.vue'
import BIA from '@/views/modules/BIA/risk-assessment/index.vue'
import RCSA from '@/views/modules/RCSA/RiskRegister.vue'
// import RiskRankingMatrix from './RiskRankingMatrix.vue'
import RiskAssessmentSummary from './partials/Summary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    // Assessment,
    ViewRiskAssessment,
    DPIA,
    BIA,
    RCSA,
    // RiskRankingMatrix,
    RiskAssessmentSummary,
  },
  data() {
    return {
      business_units: [],
      selectedBusinessUnit: '',
      matrix: '3x3',
      impacts: [],
      likelihoods: [],
      risk_assessments: [],
      summary: [],
      loading: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    selectedClient() {
      this.fetchBusinessUnits()
    },
  },
  created() {
    this.fetchBusinessUnits()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      app.$store.dispatch('clients/fetchClients')
    },
    fetchBusinessUnits() {
      const app = this
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    // fetchRiskAssessments(load = true) {
    //   const app = this
    //   app.loading = load
    //   const fetchRiskAssessmentsResource = new Resource('risk-assessment/fetch-risk_assessments')
    //   fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id })
    //     .then(response => {
    //       app.risk_assessments = response.risk_assessments
    //       app.loading = false
    //     }).catch(() => { app.loading = false })
    // },
    // fetchRiskAssessmentSummary() {
    //   const app = this
    //   const param = { client_id: app.selectedClient.id }
    //   const fetchConsultingsResource = new Resource('reports/risk-assessment-summary')
    //   fetchConsultingsResource.list(param)
    //     .then(response => {
    //       app.summary = response.summary
    //     })
    // },
  },
}
</script>
