<template>
  <el-tabs
    v-model="activeName"
    tab-position="left"
    @tab-click="forceRerender"
  >
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    > -->
    <el-tab-pane
      :key="keyValue"
      label="Dashboard"
      name="#dashboard"
      lazy
    >
      <dashboard />
    </el-tab-pane>
    <el-tab-pane
      label="Vendor Onboarding"
      name="#onboarding"
      lazy
    >
      <onboarding />
    </el-tab-pane>
    <el-tab-pane
      label="Risk Management"
      name="#risk-management"
      lazy
    >
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane
      label="Contracts & SLA"
      name="#contract-and-sla"
      lazy
    >
      <contract-and-sla />
    </el-tab-pane>
    <el-tab-pane
      label="Financials & Billing"
      name="#financials-and-billing"
      lazy
    >
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane
      label="Vendor Relationship"
      name="#vrm"
      lazy
    >
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

export default {
  components: {
    Dashboard, Onboarding, RiskAssessment, FinancialsAndBilling, ContractAndSla, VRM,
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#dashboard',
      keyValue: 1,
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    forceRerender(tab, event) {
      const app = this
      console.log(event.target.id)
      let hashString = event.target.id
      hashString = hashString.replace('tab-', '')
      // app.activeName = value
      app.$router.push({ hash: `${hashString}` })
      app.keyValue += 1
    },
    setCurrentPage() {
      const app = this
      app.activeName = (window.location.hash !== '') ? window.location.hash : '#dashboard'
    },
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  },
}
</script>
