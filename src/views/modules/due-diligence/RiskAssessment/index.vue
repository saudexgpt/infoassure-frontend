<template>
  <el-tabs type="border-card">
    <!-- <el-tab-pane lazy>
      <span slot="label"><i class="el-icon-odometer" /> Dashboard</span>
      <manage-questions />
    </el-tab-pane> -->
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><i class="el-icon-odometer"></i> Overview</span>
      </template>
      <dashboard />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><feather-icon icon="SettingsIcon" /> Manage Requirements</span>
      </template>
      <manage-questions />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><feather-icon icon="AlertTriangleIcon" /> Risk Assessment</span>
      </template>
      <vendor-due-diligence />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Dashboard from './Dashboard.vue'
import ManageQuestions from './ManageQuestions.vue'
import VendorDueDiligence from './VendorDueDiligence.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    Dashboard,
    // BTabs,
    // BTab,
    ManageQuestions,
    VendorDueDiligence
  },
  methods: {
    checkPermission
  }
}
</script>
