<template>
  <el-card>
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="selectedClient"
            placeholder="Select Client"
            style="width: 100%;"
            key-value="id"
            filterable
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
    </aside>
    <div v-if="selectedClient !== null">
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
          <view-risk-assessment
            v-loading="loading"
            :selected-client="selectedClient"
            :standard-id="0"
            :impacts="impacts"
            :likelihoods="likelihoods"
            :assessment-module="'rcsa'"
          />
        </b-tab>
        <!-- <b-tab
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
        </b-tab> -->
      </b-tabs>
    </div>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
// import Assessment from './partials/Assessment.vue'
import ViewRiskAssessment from '@/views/modules/risk-assessment/ViewRiskAssessment.vue'
// import RiskRankingMatrix from './RiskRankingMatrix.vue'
// import RiskAssessmentSummary from './partials/Summary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    ViewRiskAssessment,
  },
  data() {
    return {
      clients: [],
      impacts: [],
      likelihoods: [],
      selectedClient: null,
      loading: false,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      const fetchCriteriaResource = new Resource('clients')
      fetchCriteriaResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.selectedClient = app.clients[0]
            app.setMatrix()
          }
        })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const app = this
      app.loading = true
      const param = { client_id: app.selectedClient.id }
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
      const param = { client_id: app.selectedClient.id }
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
