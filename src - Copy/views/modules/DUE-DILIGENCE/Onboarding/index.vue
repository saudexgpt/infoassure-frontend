<template>
  <el-card>
    <el-tabs
      type="border-card"
      tab-position="left"
    >
      <el-tab-pane lazy>
        <span slot="label"><feather-icon icon="ListIcon" /> Vendors List</span>
        <vendor-list />
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><feather-icon icon="UserPlusIcon" /> Create Vendors</span>
        <vendor-registration />
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><feather-icon icon="SearchIcon" /> Vendors Screening/Approval</span>
        <screening-and-approval />
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
import VendorList from './partials/VendorList.vue'
import VendorRegistration from './partials/RegisterVendor.vue'
import ScreeningAndApproval from './partials/ScreeningAndApproval.vue'
// import VendorUserRegistration from './partials/RegisterUserVendor.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // BTabs,
    // BTab,
    VendorList,
    VendorRegistration,
    ScreeningAndApproval,
    // VendorUserRegistration,
  },
  methods: {
    checkPermission,
  },
}
</script>
