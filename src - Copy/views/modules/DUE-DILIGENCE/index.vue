<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
  >
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
      <n-d-p-a-manage />
    </el-tab-pane>
    <el-tab-pane
      label="Financials & Billing"
      name="third"
    >
      <onboarding />
    </el-tab-pane>
    <el-tab-pane
      label="Audit Assessment"
      name="fourth"
    >
      <onboarding />
    </el-tab-pane>
    <el-tab-pane
      label="Reports & Analytics"
      name="fifth"
    >
      <onboarding />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Onboarding from '@/views/modules/DUE-DILIGENCE/Onboarding/index.vue'
import NDPAManage from '@/views/modules/NDPA/Manage.vue'
// import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    Onboarding, NDPAManage,
    // NDPAReport,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>
