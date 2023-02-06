<template>
  <div
    v-if="dashboardData"
  >
    <el-row
      :gutter="10"
    >
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <analytics-congratulation
          :data="dashboardData.student.user"
          :current-class="dashboardData.current_class"
        />
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <!-- <statistic-card-with-area-chart
          icon="ActivityIcon"
          :statistic="average_performance + '%'"
          statistic-title="My Performance"
          :chart-data="series"
        /> -->
        <b-card
          no-body
          class="card-statistics"
        >
          <b-card-header>
            <b-card-title>Statistics</b-card-title>
            <!-- <b-card-text class="font-small-2 mr-15 mb-1">
              Updated 1 month ago
            </b-card-text> -->
          </b-card-header>
          <b-card-body class="statistics-body">
            <b-row>
              <b-col
                :xs="24"
                :sm="4"
                :md="4"
                :lg="4"
                :xl="4"
              >
                <b-media no-body>
                  <b-media-aside

                    class="mr-1"
                  >
                    <b-avatar
                      size="36"
                      variant="success"
                    >
                      <feather-icon
                        size="18"
                        icon="UserCheckIcon"
                      />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h4 class="font-weight-bolder mb-1">
                      {{ dashboardData.current_class }}
                    </h4>
                    <b-card-text class="font-small-3 mb-1">
                      &nbsp;
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>

              <b-col
                :xs="24"
                :sm="4"
                :md="4"
                :lg="4"
                :xl="4"
              >
                <b-media no-body>
                  <b-media-aside

                    class="mr-1"
                  >
                    <b-avatar
                      size="36"
                      variant="primary"
                    >
                      <feather-icon
                        size="18"
                        icon="UsersIcon"
                      />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h4 class="font-weight-bolder mb-1">
                      {{ dashboardData.total_in_class - 1 }}
                    </h4>
                    <b-card-text class="font-small-3 mb-1">
                      Class Mates
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>
              <b-col
                :xs="24"
                :sm="4"
                :md="4"
                :lg="4"
                :xl="4"
              >
                <b-media no-body>
                  <b-media-aside

                    class="mr-1"
                  >
                    <b-avatar
                      size="36"
                      variant="warning"
                    >
                      <feather-icon
                        size="18"
                        icon="BookIcon"
                      />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h4 class="font-weight-bolder mb-1">
                      {{ dashboardData.subject_teachers.length }}
                    </h4>
                    <b-card-text class="font-small-3 mb-1">
                      Subjects
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BAvatar, BRow, BCol, BMedia,
  BMediaBody, BMediaAside, BCardText,
} from 'bootstrap-vue'
import AnalyticsCongratulation from '@/views/dashboard/analytics/AnalyticsCongratulation.vue'

export default {

  components: {
    BCard,
    BAvatar,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BRow,
    BCol,
    BMedia,
    BMediaBody,
    BMediaAside,
    BCardText,
    // StatisticCardHorizontal,
    // StatisticCardWithAreaChart,
    /* StudentDetails, */
    AnalyticsCongratulation,
  },
  props: {
    dashboardData: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
    }
  },
}
</script>
