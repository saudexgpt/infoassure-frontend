<template>
  <el-tabs
    type="border-card"
  >

    <!-- <el-tab-pane lazy>
      <span slot="label"><i class="el-icon-odometer" /> Dashboard</span>
      <manage-questions />
    </el-tab-pane> -->
    <el-tab-pane lazy>
<<<<<<< HEAD
      <span slot="label"><i class="el-icon-odometer" /> Overview</span>
      <dashboard />
    </el-tab-pane>
    <el-tab-pane lazy>
=======
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      <span slot="label"><feather-icon icon="SettingsIcon" /> Manage Requirements</span>
      <manage-questions />
    </el-tab-pane>
    <el-tab-pane lazy>
      <span slot="label"><feather-icon icon="AlertTriangleIcon" /> Risk Assessment</span>
      <vendor-due-diligence />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import {
//   BTabs, BTab,
// } from 'bootstrap-vue'
<<<<<<< HEAD
import Dashboard from './Dashboard.vue'
=======
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
import ManageQuestions from './ManageQuestions.vue'
import VendorDueDiligence from './VendorDueDiligence.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
<<<<<<< HEAD
    Dashboard,
=======
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
    // BTabs,
    // BTab,
    ManageQuestions,
    VendorDueDiligence,
  },
  methods: {
    checkPermission,
  },
}
</script>
