<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
      v-if="getOtherToken"
      width="250px"
      style="background-color: rgb(238, 241, 246)"
    >
      <div style="text-align: center;">

        <h1 style="font-size: 48px; font-weight: 600;  font-family:'Times New Roman', Times, serif">
          BIA
        </h1>
        <span>Business Impact Analysis</span>
      </div>
      <el-menu>
        <el-menu-item @click="page = 'business'">
          <i class="el-icon-setting" />
          <span slot="title">Manage Processes</span>
        </el-menu-item>
        <el-menu-item @click="page = 'analyze'">
          <i class="el-icon-search" />
          <span slot="title">Analyze</span>
        </el-menu-item>
        <el-menu-item @click="page = 'risk-assessment'">
          <i class="el-icon-help" />
          <span slot="title">Risk Assessment</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        v-if="getOtherToken"
        style="text-align: right; font-size: 12px"
      >
        <el-dropdown
          @command="logout"
        >
          <i
            class="el-icon-user"
            style="margin-right: 15px"
          > {{ otherUserData.name }}</i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">
              Logout
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
        <div v-if="getOtherToken">
          <div v-if="page === 'business'">
            <business-processes
              :client-id="otherUserData.client_id"
              :business-unit-id="otherUserData.business_unit_id"
            />
          </div>
          <div v-if="page === 'analyze'">
            <analyze
              :client-id="otherUserData.client_id"
              :business-unit-id="otherUserData.business_unit_id"
            />
          </div>
          <div v-if="page === 'risk-assessment'">
            <risk-assessment
              :client-id="otherUserData.client_id"
              :business-unit-id="otherUserData.business_unit_id"
            />
          </div>
        </div>
        <div v-else>
          <other-user-login />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import checkPermission from '@/utils/permission'
import Analyze from './Analyze.vue'
// import BIADetails from './Details.vue'
import BusinessProcesses from '@/views/modules/business-units/partials/BusinessProcesses.vue'
import RiskAssessment from './risk-assessment/index.vue'
import OtherUserLogin from '@/views/pages/authentication/OtherUserLogin.vue'

export default {
  components: {
    Analyze,
    // BIADetails,
    BusinessProcesses,
    OtherUserLogin,
    RiskAssessment,
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
      page: 'business',
    }
  },
  computed: {
    getOtherToken() {
      return this.$store.getters.other_user_token
    },
    otherUserData() {
      return this.$store.getters.otherUserData
    },
  },
  methods: {
    checkPermission,
    async logout() {
      await this.$store.dispatch('user/logoutOtherUser')
    },
  },
}
</script>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px
  }
  .el-aside {
    color: #333
  }
</style>
