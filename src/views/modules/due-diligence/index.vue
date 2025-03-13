<template>
  <el-tabs
    v-model="activeName"
    tab-position="left"
  >
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    > -->
    <el-tab-pane
      label="Dashboard"
      name="first"
      lazy
    >
      <dashboard />
    </el-tab-pane>
    <el-tab-pane
      label="Vendor Onboarding"
      name="second"
      lazy
    >
      <onboarding />
    </el-tab-pane>
    <el-tab-pane
      label="Risk Management"
      name="third"
      lazy
    >
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane
      label="Financials & Billing"
      name="fourth"
      lazy
    >
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane
      label="Contracts & SLA"
      name="fifth"
      lazy
    >
      <contract-and-sla />
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

export default {
  components: {
    Dashboard, Onboarding, RiskAssessment, FinancialsAndBilling, ContractAndSla,
    // NDPAReport,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  },
}
</script>
