<template>
  <div>
    <data-analysis
      v-if="dashboardData !== null"
      :dashboard-data="dashboardData"
    />
    <other-dashboard-components
      v-if="dashboardData !== null"
      :dashboard-data="dashboardData"
    />
  </div>
</template>
<script>
import DataAnalysis from './components/data_analysis.vue'
import OtherDashboardComponents from './components/other_dashboard_components.vue'

import Resource from '@/api/resource'

const dataAnalysisResource = new Resource('dashboard/student')
export default {
  components: {
    DataAnalysis,
    OtherDashboardComponents,
  },
  data() {
    return {
      dashboardData: null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    fetchData() {
      const app = this
      app.load = true
      dataAnalysisResource.list()
        .then(response => {
          app.dashboardData = response
          // app.student = response.student
          // app.subject_teachers = response.subject_teachers
          // app.series[0].data = response.performance_data
          // app.average_performance = response.average_performance
          // app.total_in_class = response.total_in_class
          // app.current_class = response.current_class
          // app.class_teacher = response.class_teacher
          app.load = false
        })
    },
  },
}
</script>
