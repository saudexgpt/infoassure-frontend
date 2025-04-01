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
      label="Asset Inventory"
      name="#asset-inventory"
      lazy
    >
      <AssetManagement />
    </el-tab-pane>
    <el-tab-pane
      label="Business Units"
      name="#business-unit"
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
  </el-tabs>
</template>
<script>
import AssetManagement from './partials/ManageAssets/index.vue'
import Onboarding from '@/views/modules/DUE-DILIGENCE/Onboarding/index.vue'
import RiskAssessment from '@/views/modules/DUE-DILIGENCE/RiskAssessment/index.vue'

export default {
  components: {
    AssetManagement, Onboarding, RiskAssessment,
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#asset-management',
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
      app.activeName = (window.location.hash !== '') ? window.location.hash : '#asset-management'
    },
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  },
}
</script>
