<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
      v-if="getOtherToken"
      width="250px"
      style="background-color: rgb(238, 241, 246)"
    >
      <div style="text-align: center;">
        <img
          src="/images/logo/logo.png"
          alt="logo"
          width="200"
          class="mx-auto"
        >
        <h1 style="font-size: 40px; font-weight: 600;">
          VMS
        </h1>
        <span>Vendor Management System</span>
      </div>
      <el-menu>
        <el-menu-item @click="setPage('#onboarding')">
          <i class="el-icon-office-building" />
          <span slot="title">Onboarding</span>
        </el-menu-item>
        <el-menu-item @click="setPage('#risk-assessment')">
          <i class="el-icon-help" />
          <span slot="title">Vendor Assessment</span>
        </el-menu-item>
        <el-menu-item @click="setPage('#contracts')">
          <i class="el-icon-document" />
          <span slot="title">Contracts & SLA</span>
        </el-menu-item>
        <el-menu-item @click="setPage('#finance')">
          <i class="el-icon-money" />
          <span slot="title">Financials & Billing</span>
        </el-menu-item>
        <el-menu-item @click="setPage('#vrm')">
          <i class="el-icon-tickets" />
          <el-tooltip
            slot="title"
            content="Vendor Relationship Management"
          >
            <span>VRM</span>
          </el-tooltip>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        v-if="getOtherToken"
        style="text-align: right;"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="In-app Mailbox"
          placement="top-start"
        >
          <span @click="setPage('#mailbox')">
            <i
              class="el-icon-message"
              style="margin-right: 15px; cursor: pointer;  font-size: 24px"
            />
          </span>
        </el-tooltip>
        <el-dropdown
          @command="logout"
        >
          <i
            class="el-icon-user"
            style="margin-right: 15px;  font-size: 20px"
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
          <div v-if="page === '#onboarding'">
            <onboarding
              :vendor-id="otherUserData.vendor_id"
            />
          </div>
          <div v-if="page === '#mailbox'">
            <mail-box />
          </div>
          <div v-if="page === '#risk-assessment'">
            <risk-assessment :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#finance'">
            <financial-and-billing :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#contracts'">
            <contract-and-sla :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#vrm'">
            <VRM :vendor-id="otherUserData.vendor_id" />
          </div>
        </div>
        <div v-else>
          <other-user-login product-module="vdd" />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import checkPermission from '@/utils/permission'
import MailBox from './email/Email.vue'
import Onboarding from './partials/Onboarding.vue'
import RiskAssessment from './partials/RiskAssessment.vue'
import FinancialAndBilling from './partials/FinancialAndBilling.vue'
import ContractAndSla from './partials/ContractAndSLA.vue'
import VRM from './partials/VRM.vue'
import OtherUserLogin from '@/views/pages/authentication/OtherUserLogin.vue'

export default {
  components: {
    MailBox,
    Onboarding,
    RiskAssessment,
    OtherUserLogin,
    FinancialAndBilling,
    ContractAndSla,
    VRM,
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
      page: '#onboarding',
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
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    checkPermission,
    async logout() {
      await this.$store.dispatch('user/logoutOtherUser')
    },
    setCurrentPage() {
      const app = this
      app.page = (window.location.hash !== '') ? window.location.hash : '#onboarding'
    },
    setPage(value) {
      const app = this
      app.page = value
      app.$router.push({ hash: `${value}` })
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
