<template>
  <el-card>
    <h4>Manage Risk & Control Matrix</h4>
    <div>
      <view-risk-control-matrix
        risk-group="business_process"
      />
    </div>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import ViewRiskControlMatrix from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'

export default {
  components: {
    ViewRiskControlMatrix,
  },
  data() {
    return {
      clients: [],
      business_impact_analyses: [],
      selectedClient: null,
      loading: false,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      app.$store.dispatch('clients/fetchClients')
    },
  },
}
</script>
