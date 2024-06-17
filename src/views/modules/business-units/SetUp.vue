<template>
  <!-- <business-units /> -->
  <el-tabs type="border-card">
    <el-tab-pane label="Business Units">
      <business-units />
    </el-tab-pane>
    <!-- <el-tab-pane label="Impact Criteria">
      <impact-criteria />
    </el-tab-pane> -->
    <!-- <el-tab-pane label="Manage Team Members">
      <manage-access />
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import checkPermission from '@/utils/permission'
import BusinessUnits from './partials/BusinessUnitsTable.vue'
// import ImpactCriteria from './partials/ImpactCriteria.vue'
// import ManageAccess from './partials/ManageAccess.vue'

export default {
  components: {
    // ImpactCriteria,
    BusinessUnits,
    // ManageAccess,
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
    }
  },
  methods: {
    checkPermission,
  },
}
</script>
