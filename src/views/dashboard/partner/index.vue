<template>
  <div v-loading="load">
    <data-analysis
      v-if="dashboardData !== null"
      :dashboard-data="dashboardData"
    />
    <b-row class="match-height">
      <b-col lg="12">
        <clients />
      </b-col>
    </b-row>

  </div>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import DataAnalysis from './components/data_analysis.vue'
import Clients from '@/views/modules/user/Clients.vue'
// import AdminChart from './components/admin_report_chart.vue'
// import Revenue from './components/charts/Revenue.vue'
// import Debtors from './components/charts/Debtors.vue'

import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    DataAnalysis,
    Clients,
    // Revenue,
    // Debtors,
  },
  data() {
    return {
      dashboardData: null,
      load: false,
      terms: [],
      sessions: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const app = this
      app.load = true
      const adminDashboardResource = new Resource('reports/partner-data-analysis-dashboard')
      adminDashboardResource.list()
        .then(response => {
          app.dashboardData = response
          app.load = false
        }).catch(error => {
          console.log(error)
          app.load = false
        })
    },
  },
}
</script>
