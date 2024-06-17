<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
      v-if="getOtherToken"
      width="250px"
      style="background-color: rgb(238, 241, 246)"
    >
      <div style="text-align: center;">

        <h1 style="font-size: 48px; font-weight: 600;  font-family:'Times New Roman', Times, serif">
          RCSA
        </h1>
        <span>Risk Control Self Assessment</span>
      </div>
      <el-menu>
        <el-menu-item @click="page = 'business'">
          <i class="el-icon-setting" />
          <span slot="title">Manage Processes</span>
        </el-menu-item>
        <el-menu-item @click="page = 'rcm'">
          <i class="el-icon-search" />
          <span slot="title">Risk & Control Matrix</span>
        </el-menu-item>
        <!-- <el-menu-item @click="page = 'view'">
            <i class="el-icon-view" />
            <span slot="title">View Analysis</span>
          </el-menu-item> -->
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
          <!-- <div v-if="page === 'rcm'">
              <r-c-m
                :client-id="otherUserData.client_id"
                :business-unit-id="otherUserData.business_unit_id"
              />
            </div> -->
          <!-- <div v-if="page === 'view'">
              <b-i-a-details
                :client-id="otherUserData.client_id"
                :business-unit-id="otherUserData.business_unit_id"
              />
            </div> -->
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
// import RCM from './RCM.vue'
// import BIADetails from './Details.vue'
import BusinessProcesses from '@/views/modules/business-units/partials/BusinessProcesses.vue'
import OtherUserLogin from '@/views/pages/authentication/OtherUserLogin.vue'

export default {
  components: {
    // RCM,
    // BIADetails,
    BusinessProcesses,
    OtherUserLogin,
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
