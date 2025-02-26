<template>
  <el-card>
    <el-tabs
      type="border-card"
    >

      <el-tab-pane lazy>
        <span slot="label"><feather-icon icon="SettingsIcon" /> Manage Requirements</span>
        <manage-questions />
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><feather-icon icon="SearchIcon" /> Vendor Due Diligence Assessment</span>
        <vendor-due-diligence />
      </el-tab-pane>
    </el-tabs>
    <!-- <b-tabs
        content-class="mt-1"
        pills
      >
        <b-tab lazy>
          <template #title>
            <feather-icon icon="ListIcon" />
            <span>Vendor List</span>
          </template>
          <vendor-list />
        </b-tab>
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="UserPlusIcon" />
            <span>Register Vendors</span>
          </template>
          <vendor-registration />
        </b-tab>
        <b-tab
          lazy
        >
          <template #title>
            <feather-icon icon="UserPlusIcon" />
            <span>Register Vendor Users</span>
          </template>
          <vendor-user-registration />
        </b-tab>
      </b-tabs> -->
  </el-card>
</template>

<script>
// import {
//   BTabs, BTab,
// } from 'bootstrap-vue'
import ManageQuestions from './ManageQuestions.vue'
import VendorDueDiligence from './VendorDueDiligence.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
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
