<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="forceRerender">
      <!-- <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      > -->
      <el-tab-pane :key="keyValue" label="Asset Inventory Setup" name="#asset-inventory" lazy>
        <el-tabs type="border-card">
          <el-tab-pane label="Manage Asset Types" lazy>
            <AssetTypes />
          </el-tab-pane>
          <el-tab-pane label="Manage Assets" lazy>
            <AssetManagement />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="Business Units Setup" name="#business-unit" lazy>
        <BusinessUnits />
      </el-tab-pane>
      <el-tab-pane label="Risk Management Setup" name="#risk-management" lazy>
        <RiskSetup />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import AssetTypes from './partials/ManageAssetTypes/index.vue'
import AssetManagement from './partials/ManageAssets/index.vue'
import BusinessUnits from './partials/business-units/SetUp.vue'
import RiskSetup from './partials/RiskAndThreats/index.vue'

export default {
  components: {
    AssetTypes,
    AssetManagement,
    BusinessUnits,
    RiskSetup
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#asset-inventory',
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
      this.activeName = window.location.hash !== '' ? window.location.hash : '#asset-inventory'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
