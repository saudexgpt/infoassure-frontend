<template>
  <div v-if="statistics.length > 0">
    <el-row
      :gutter="8"
    >
      <el-col
        v-for="(item, index) in statistics"
        :key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
      >
        <b-card>
          <b-card-body class="d-flex justify-content-between align-items-center">
            <b-avatar
              :variant="`light-${item.color}`"
              size="50"
            >
              <feather-icon
                size="35"
                :icon="item.icon"
              />
            </b-avatar>
            <div class="truncate">
              <h2
                class="mb-25 font-weight-bolder"
              >
                {{ item.statistic }}
              </h2>
              <span>{{ item.title }}</span>
            </div>
          </b-card-body>
          <!-- <b-card-footer>
            <strong>
              <span v-if="item.footer">{{ item.title2 }}: {{ item.statistic2 }}</span>
              <span v-else>&nbsp;</span>
            </strong>
          </b-card-footer> -->
        </b-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
// import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

export default {
  components: {
    BCard,
    // BCardFooter,
    BCardBody,
    BAvatar,
    // StatisticCardHorizontal,
  },
  props: {
    dashboardData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      statistics: [],
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData() {
      const app = this
      const data = [
        {
          color: 'warning', icon: 'UsersIcon', statistic: app.dashboardData.users, title: 'Users',
        },
        // {
        //   color: 'success', icon: 'CheckIcon', statistic: app.dashboardData.standards, title: 'Standards',
        // },
        {
          color: 'primary', icon: 'BriefcaseIcon', statistic: app.dashboardData.projects, title: 'Projects',
        },
        {
          color: 'dark', icon: 'UploadIcon', statistic: app.dashboardData.uploads, title: 'Uploads',
        },
        // {
        //   color: 'success', icon: 'HelpCircleIcon', statistic: app.dashboardData.all_questions, title: 'Gap Assessment', title2: 'Responses', statistic2: app.dashboardData.answered_questions, footer: true,
        // },
        // {
        //   color: 'danger', icon: 'AlertCircleIcon', statistic: app.dashboardData.exceptions, title: 'Exceptions',
        // },
      ]
      app.statistics = data
    },
  },
}
</script>
