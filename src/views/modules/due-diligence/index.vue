<template>
  <el-tabs v-model="activeName" @tab-click="forceRerender">
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    > -->
    <el-tab-pane :key="keyValue" label="Dashboard" name="#dashboard" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:dashboard" /> Dashboard</span>
      </template>
      <dashboard />
    </el-tab-pane>
    <el-tab-pane label="Vendor Onboarding" name="#onboarding" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:users" /> Vendor Onboarding</span>
      </template>
      <onboarding />
    </el-tab-pane>
    <el-tab-pane label="Vendors Screening/Approval" name="#vendor-screening" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:user-search" /> Vendors Screening/Approval</span>
      </template>
      <ScreeningAndApproval />
    </el-tab-pane>
    <el-tab-pane label="Risk Management" name="#risk-management" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:alert-triangle" /> Risk Management</span>
      </template>
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane label="Contracts & SLA" name="#contract-and-sla" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:file-invoice" /> Contracts & SLA</span>
      </template>
      <contract-and-sla />
    </el-tab-pane>
    <el-tab-pane label="Financials & Billing" name="#financials-and-billing" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:report-money" /> Financials & Billing</span>
      </template>
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane label="Vendor Relationship" name="#vrm" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:heart-handshake" /> Vendor Relationship</span>
      </template>
      <VRM />
    </el-tab-pane>
    <!-- <el-tab-pane
      label="Audit Assessment"
      name="fifth"
      lazy
    >
      <div>
        <img
          align="center"
          src="images/construction.jpg"
        >
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="Reports & Analytics"
      name="sixth"
      lazy
    >
      <div>
        <img
          align="center"
          src="images/construction.jpg"
        >
      </div>
    </el-tab-pane> -->
  </el-tabs>
</template>
<script>
import Dashboard from '@/views/modules/DUE-DILIGENCE/Dashboard.vue'
import Onboarding from '@/views/modules/DUE-DILIGENCE/Onboarding/index.vue'
import RiskAssessment from '@/views/modules/DUE-DILIGENCE/RiskAssessment/index.vue'
import FinancialsAndBilling from '@/views/modules/DUE-DILIGENCE/FinancialsAndBilling/index.vue'
import ContractAndSla from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/index.vue'
import VRM from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/index.vue'
import ScreeningAndApproval from '@/views/modules/DUE-DILIGENCE/Onboarding/partials/ScreeningAndApproval.vue'

export default {
  components: {
    Dashboard,
    Onboarding,
    RiskAssessment,
    FinancialsAndBilling,
    ContractAndSla,
    VRM,
    ScreeningAndApproval
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#dashboard',
      keyValue: 1
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    forceRerender(tab, event) {
      // console.log(event.target.id)
      let hashString = event.target.id
      hashString = hashString.replace('tab-', '')
      // this.activeName = value
      this.$router.push({ hash: `${hashString}` })
      this.keyValue += 1
    },
    setCurrentPage() {
      this.activeName = window.location.hash !== '' ? window.location.hash : '#dashboard'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
