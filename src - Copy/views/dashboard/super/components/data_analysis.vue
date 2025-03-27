<template>
  <div v-if="dashboardData !== null">
    <el-carousel
      :interval="4000"
      type="card"
      height="150px"
    >
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="dark"
          icon="HomeIcon"
          :statistic="dashboardData.totalSchools"
          statistic-title="Approved Schools"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="info"
          icon="HomeIcon"
          :statistic="dashboardData.totalPotentialSchools"
          statistic-title="Potential Schools"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="primary"
          icon="UserPlusIcon"
          :statistic="dashboardData.active_students"
          statistic-title="Active Students"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="warning"
          icon="UserMinusIcon"
          :statistic="dashboardData.suspended_students"
          statistic-title="Suspended Students"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="success"
          icon="UserCheckIcon"
          :statistic="dashboardData.alumni"
          statistic-title="Graduated Student"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="danger"
          icon="UserXIcon"
          :statistic="dashboardData.withdrawn_students"
          statistic-title="Withdrawn Students"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="info"
          icon="UsersIcon"
          :statistic="dashboardData.totalStaff"
          statistic-title="Active Personnels"
        />
      </el-carousel-item>
      <el-carousel-item>
        <statistic-card-horizontal
          color="white"
          bg="secondary"
          icon="UsersIcon"
          :statistic="dashboardData.totalGuardian"
          statistic-title="Total Guardians"
        />
      </el-carousel-item>
    </el-carousel>
    <!-- <el-row
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
          statistic-title="Withdrawn Students"
        />
      </el-col>
    </el-row> -->
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
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: transparent;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: transparent;
  }
</style>
