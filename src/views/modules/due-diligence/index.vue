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
<<<<<<< HEAD
      name="#dashboard"
=======
      name="first"
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      lazy
    >
      <dashboard />
    </el-tab-pane>
    <el-tab-pane
      label="Vendor Onboarding"
<<<<<<< HEAD
      name="#onboarding"
=======
      name="second"
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      lazy
    >
      <onboarding />
    </el-tab-pane>
    <el-tab-pane
      label="Risk Management"
<<<<<<< HEAD
      name="#risk-management"
=======
      name="third"
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      lazy
    >
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane
<<<<<<< HEAD
      label="Contracts & SLA"
      name="#contract-and-sla"
      lazy
    >
      <contract-and-sla />
    </el-tab-pane>
    <el-tab-pane
      label="Financials & Billing"
      name="#financials-and-billing"
=======
      label="Financials & Billing"
      name="fourth"
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      lazy
    >
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane
<<<<<<< HEAD
      label="Vendor Relationship"
      name="#vrm"
      lazy
    >
      <VRM />
=======
      label="Contracts & SLA"
      name="fifth"
      lazy
    >
      <contract-and-sla />
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
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
<<<<<<< HEAD
import VRM from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/index.vue'

export default {
  components: {
    Dashboard, Onboarding, RiskAssessment, FinancialsAndBilling, ContractAndSla, VRM,
=======

export default {
  components: {
    Dashboard, Onboarding, RiskAssessment, FinancialsAndBilling, ContractAndSla,
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
    // NDPAReport,
  },
  data() {
    return {
<<<<<<< HEAD
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
=======
      activeName: 'first',
      keyValue: 1,
    }
  },
  methods: {
    forceRerender() {
      // console.log(e)
      this.keyValue += 1
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
    },
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  },
}
</script>
