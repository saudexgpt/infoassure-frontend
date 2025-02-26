<template>
  <el-tabs
    v-model="activeName"
  >
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    > -->
    <el-tab-pane
      label="Vendor Onboarding"
      name="first"
    >
      <onboarding />
    </el-tab-pane>
    <el-tab-pane
      label="Risk Management"
      name="second"
    >
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane
      label="Financials & Billing"
      name="third"
    >
      <financials-and-billing />
    </el-tab-pane>
    <!-- <el-tab-pane
      label="Audit Assessment"
      name="fourth"
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
      name="fifth"
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
import Onboarding from '@/views/modules/DUE-DILIGENCE/Onboarding/index.vue'
import RiskAssessment from '@/views/modules/DUE-DILIGENCE/RiskAssessment/index.vue'
import FinancialsAndBilling from '@/views/modules/DUE-DILIGENCE/FinancialsAndBilling/index.vue'
// import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    Onboarding, RiskAssessment, FinancialsAndBilling,
    // NDPAReport,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event)
    // },
  },
}
</script>
