<template>
  <b-row
    class="match-height"
  >
    <b-col
      :xs="12"
      :sm="4"
      :md="4"
      :lg="4"
      :xl="4"
    >
      <b-card
        class="card-congratulation-medal"
      >
        <h3>Hi {{ activeUserInfo.name }},</h3>
        <b-card-text class="font-small-3">
          Welcome 🎉 to your dashboard
        </b-card-text>
        <b-img
          :src="require('@/assets/images/illustration/badge.svg')"
          class="congratulation-medal"
          alt="Medal Pic"
        />
      </b-card>
    </b-col>
    <b-col
      :xs="12"
      :sm="8"
      :md="8"
      :lg="8"
      :xl="8"
    >
      <b-card
        no-body
        class="card-statistics"
      >
        <b-card-header>
          <b-card-title>Statistics</b-card-title>
        </b-card-header>
        <b-card-body class="statistics-body">
          <el-skeleton
            :loading="load"
            :rows="3"
            animated
          />
          <b-row>
            <b-col
              v-for="(item, index) in statistics"
              :key="index"
              xl="4"
              lg="4"
              md="4"
              sm="6"
            >
              <b-media no-body>
                <b-media-aside

                  class="mr-2"
                >
                  <b-avatar
                    size="48"
                    :variant="item.color"
                  >
                    <feather-icon
                      size="24"
                      :icon="item.icon"
                    />
                  </b-avatar>
                </b-media-aside>
                <b-media-body class="my-auto">
                  <h4 class="font-weight-bolder mb-0">
                    {{ item.statistic }}
                  </h4>
                  <b-card-text class="font-small-3 mb-0">
                    {{ item.title }}
                  </b-card-text>
                </b-media-body>
              </b-media>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BAvatar, BRow, BCol, BCardText, BMediaBody, BMedia, BMediaAside, BImg,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BAvatar,
    BRow,
    BCol,
    BCardText,
    BMediaBody,
    BMedia,
    BMediaAside,
    BImg,
    // StatisticCardHorizontal,
  },
  data() {
    return {
      statistics: [],
      load: false,
      dashboardData: {},
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.getters.userData
    },
  },
  created() {
    this.fetchAnalystics()
  },
  methods: {
    manageProject(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selected_project = selectedRow
      app.showManageProject = true
    },
    setData() {
      const app = this
      const data = [
        {
          color: 'primary', icon: 'BriefcaseIcon', statistic: app.dashboardData.all_projects_count, title: 'Total Projects',
        },
        {
          color: 'secondary', icon: 'RepeatIcon', statistic: app.dashboardData.in_progress, title: 'Projects In Progress',
        },
        {
          color: 'success', icon: 'CheckCircleIcon', statistic: app.dashboardData.completed_projects, title: 'Completed Projects',
        },
      ]
      app.statistics = data
    },
    fetchAnalystics() {
      const app = this
      app.load = true
      const dashboardDataResource = new Resource('reports/client-dashboard-statistics')
      dashboardDataResource.list().then(response => {
        app.dashboardData = response
        app.load = false
        app.setData()
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
  },
}
</script>
<style scoped>
.analyticsBox {
  border: 2px solid #d0cdf7; padding: 20px; border-radius: 10px; margin-bottom: 10px
}
</style>
