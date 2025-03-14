<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="Overview"
      name="first"
    >
      <dashboard />
    </el-tab-pane>
    <el-tab-pane
      label="Activities"
      name="second"
    >
      <manage />
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
import Dashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
import Manage from '@/views/modules/ISMS-ISO27001/Manage.vue'
// import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    Dashboard, Manage,
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
