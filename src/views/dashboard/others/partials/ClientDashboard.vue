<template>
  <div v-loading="load">
    <div v-if="dashboardData !== null">

      <data-analysis
        :dashboard-data="dashboardData"
      />
    </div>
  </div>
</template>

<script>
import DataAnalysis from './DataAnalysis.vue'
import Resource from '@/api/resource'

export default {
  components: { DataAnalysis },
  data() {
    return {
      style: {
        background: '#000',
        color: '#fff',
      },
      dashboardData: null,
      load: false,
    }
  },
  created() {
    this.fetchDashboardData()
  },
  methods: {
    fetchDashboardData() {
      const app = this
      app.load = true
      const dashboardDataResource = new Resource('reports/client-data-analysis-dashboard')
      dashboardDataResource.list().then(response => {
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
<style lang="scss" >
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
</style>
