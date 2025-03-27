<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="Overview"
      name="first"
    >
      <n-d-p-a-dashboard />
    </el-tab-pane>
    <el-tab-pane
      label="Activities"
      name="second"
    >
      <n-d-p-a-manage />
    </el-tab-pane>
    <!-- <el-tab-pane
      label="Reports"
      name="third"
    >
      <n-d-p-a-report />
    </el-tab-pane> -->
  </el-tabs>
</template>
<script>
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
import NDPAManage from '@/views/modules/NDPA/Manage.vue'
// import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    NDPADashboard, NDPAManage,
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
