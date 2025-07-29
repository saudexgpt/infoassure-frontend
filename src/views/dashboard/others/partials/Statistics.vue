<template>
  <el-row class="match-height">
    <el-col :xs="12" :sm="4" :md="4" :lg="4" :xl="4">
      <el-card class="card-congratulation-medal">
        <h3>Hi {{ activeUserInfo.name }},</h3>
        <el-card-text class="font-small-3"> Welcome 🎉 to your dashboard </el-card-text>
        <el-img
          :src="require('@/assets/images/illustration/badge.svg')"
          class="congratulation-medal"
          alt="Medal Pic"
        />
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
      <el-card no-body class="card-statistics">
        <el-card-header>
          <el-card-title>Statistics</el-card-title>
        </el-card-header>
        <el-card-body class="statistics-body">
          <el-skeleton :loading="load" :rows="3" animated />
          <el-row>
            <el-col v-for="(item, index) in statistics" :key="index" xl="4" lg="4" md="4" sm="6">
              <el-media no-body>
                <el-media-aside class="mr-2">
                  <el-avatar size="48" :variant="item.color">
                    <feather-icon size="24" :icon="item.icon" />
                  </el-avatar>
                </el-media-aside>
                <el-media-body class="my-auto">
                  <h4 class="font-weight-bolder mb-0">
                    {{ item.statistic }}
                  </h4>
                  <el-card-text class="font-small-3 mb-0">
                    {{ item.title }}
                  </el-card-text>
                </el-media-body>
              </el-media>
            </el-col>
          </el-row>
        </el-card-body>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      statistics: [],
      load: false,
      dashboardData: {}
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.getters.userData
    }
  },
  created() {
    this.fetchAnalystics()
  },
  methods: {
    manageProject(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.selected_project = selectedRow
      this.showManageProject = true
    },
    setData() {
      const data = [
        {
          color: 'primary',
          icon: 'BriefcaseIcon',
          statistic: this.dashboardData.all_projects_count,
          title: 'Total Projects'
        },
        {
          color: 'secondary',
          icon: 'RepeatIcon',
          statistic: this.dashboardData.in_progress,
          title: 'Projects In Progress'
        },
        {
          color: 'success',
          icon: 'CheckCircleIcon',
          statistic: this.dashboardData.completed_projects,
          title: 'Completed Projects'
        }
      ]
      this.statistics = data
    },
    fetchAnalystics() {
      this.load = true
      const dashboardDataResource = new Resource('reports/client-dashboard-statistics')
      dashboardDataResource
        .list()
        .then((response) => {
          this.dashboardData = response
          this.load = false
          this.setData()
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    }
  }
}
</script>
<style scoped>
.analyticsBox {
  border: 2px solid #d0cdf7;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
