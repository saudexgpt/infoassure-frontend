<template>
  <div>
    <h3>Risks Management Setup</h3>
    <el-tabs v-if="selectedClient !== null" type="border-card">
      <el-tab-pane label="Risk Category" lazy>
        <risk-categories />
      </el-tab-pane>
      <el-tab-pane label="Impact Criteria" lazy>
        <RiskImpactAreas />
      </el-tab-pane>
      <el-tab-pane label="Impact Recovery Requirements by Time" lazy>
        <RecoveryRequirementsByTime />
      </el-tab-pane>
      <el-tab-pane label="Risk Matrix" lazy>
        <risk-matrix />
      </el-tab-pane>
      <el-tab-pane label="Risk Library" lazy>
        <view-risk-control-matrix />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RiskCategories from './RiskCategories.vue'
import RiskMatrix from './RiskMatrix.vue'
import ViewRiskControlMatrix from './ViewRiskControlMatrix.vue'
import RiskImpactAreas from './RiskImpactAreas.vue'
import RecoveryRequirementsByTime from './RecoveryRequirementsByTime.vue'

export default {
  components: {
    RiskCategories,
    ViewRiskControlMatrix,
    RiskMatrix,
    RecoveryRequirementsByTime,
    RiskImpactAreas
  },
  data() {
    return {
      loading: false
    }
  }
  // computed: {
  //   clients() {
  //     return this.$store.getters.clients
  //   },
  //   selectedClient() {
  //     return this.$store.getters.selectedClient
  //   }
  // },
  // created() {
  //   this.fetchClients()
  // },
  // methods: {
  //   fetchClients() {
  //     this.$store.dispatch('clients/fetchClients')
  //   }
  // }
}
</script>
