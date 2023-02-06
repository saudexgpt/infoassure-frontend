<template>
  <div>
    <data-analysis
      v-if="dashboardData !== null"
      :dashboard-data="dashboardData"
    />
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
    }
  },
  created() {
    this.fetchDashboardData()
  },
  methods: {
    fetchDashboardData() {
      const app = this
      const dashboardDataResource = new Resource('reports/client-data-analysis-dashboard')
      dashboardDataResource.list().then(response => {
        app.dashboardData = response
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
