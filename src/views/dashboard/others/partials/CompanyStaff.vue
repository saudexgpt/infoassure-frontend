<template>
  <div>
    <!-- <data-analysis :dashboard-data="dashboardData" /> -->

    <user-profile /><br>
    <schools />

  </div>
</template>
<script>
// import DataAnalysis from './DataAnalysis.vue'
import UserProfile from '@/views/modules/user/Profile.vue'
import Schools from '@/views/modules/schools/index.vue'

// import Resource from '@/api/resource'

export default {
  components: {
    // DataAnalysis,
    UserProfile,
    Schools,
  },
  data() {
    return {
      dashboardData: null,
      load: false,
    }
  },
  // created() {
  //   this.fetchData()
  // },
  // methods: {
  //   fetchData() {
  //     const app = this
  //     app.load = true
  //     const adminDashboardResource = new Resource('dashboard/super')
  //     adminDashboardResource
  //       .list()
  //       .then(response => {
  //         app.dashboardData = response
  //         app.load = false
  //       })
  //       .catch(error => {
  //         console.log(error)
  //         app.load = false
  //       })
  //   },
  // },
}
</script>
