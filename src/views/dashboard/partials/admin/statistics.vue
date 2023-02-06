<template>
  <div>
    <el-row
      :gutter="8"
    >
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="primary"
          icon="UserPlusIcon"
          :statistic="dashboardData.active_students"
          statistic-title="Active Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="warning"
          icon="UserMinusIcon"
          :statistic="dashboardData.suspended_students"
          statistic-title="Suspended Students"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="success"
          icon="UserCheckIcon"
          :statistic="dashboardData.alumni"
          statistic-title="Graduated Student"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          icon="UsersIcon"
          :statistic="dashboardData.totalStaff"
          statistic-title="Active Personnels"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="info"
          icon="UsersIcon"
          :statistic="dashboardData.totalGuardian"
          statistic-title="Total Guardians"
        />
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="4"
        :xl="2"
      >
        <statistic-card-horizontal
          color="danger"
          icon="UserXIcon"
          :statistic="dashboardData.withdrawn_students"
          statistic-title="Withdrawn Student"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { } from 'bootstrap-vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

export default {
  components: {
    StatisticCardHorizontal,
  },
  props: {
    dashboardData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
}
</script>
