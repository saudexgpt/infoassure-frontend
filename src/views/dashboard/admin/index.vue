<template>
  <div>

    <el-row
      v-if="load"
      :gutter="15"
    >
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card>
          <el-skeleton
            :loading="load"
            :rows="3"
            animated
          />
        </el-card>
      </el-col>
    </el-row>
    <data-analysis
      v-if="dashboardData !== null"
      :dashboard-data="dashboardData"
    />
    <b-row class="match-height">
      <b-col lg="12">
        <client-projects />
      </b-col>
    </b-row>

  </div>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import DataAnalysis from './components/data_analysis.vue'
import ClientProjects from '@/views/modules/projects/ClientProjects.vue'
// import AdminChart from './components/admin_report_chart.vue'
// import Revenue from './components/charts/Revenue.vue'
// import Debtors from './components/charts/Debtors.vue'

import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    DataAnalysis,
    ClientProjects,
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
      const adminDashboardResource = new Resource('reports/admin-data-analysis-dashboard')
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
