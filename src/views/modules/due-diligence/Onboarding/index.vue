<template>
  <el-tabs
    type="border-card"
  >
    <!-- <el-tab-pane lazy>
      <span slot="label"><i class="el-icon-odometer" /> Dashboard</span>
      <dashboard />
    </el-tab-pane> -->
    <el-tab-pane lazy>
      <span slot="label"><feather-icon icon="HomeIcon" /> Manage Vendors</span>
      <el-tabs
        type="card"
      >
        <el-tab-pane lazy>
          <span slot="label"><feather-icon icon="ListIcon" /> Vendors List</span>
          <vendor-list />
        </el-tab-pane>
        <el-tab-pane lazy>
          <span slot="label"><feather-icon icon="PlusIcon" /> Create Vendors</span>
          <vendor-registration />
        </el-tab-pane>
        <el-tab-pane lazy>
          <span slot="label"><feather-icon icon="UserPlusIcon" /> Register Vendor Users</span>
          <vendor-user-registration />
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane lazy>
      <span slot="label"><feather-icon icon="SearchIcon" /> Vendors Screening/Approval</span>
      <screening-and-approval />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import Dashboard from './partials/Dashboard.vue'
import VendorList from './partials/VendorList.vue'
import VendorRegistration from './partials/RegisterVendor.vue'
import ScreeningAndApproval from './partials/ScreeningAndApproval.vue'
import VendorUserRegistration from './partials/RegisterUserVendor.vue'

export default {
  components: {
    // Dashboard,
    VendorList,
    VendorRegistration,
    ScreeningAndApproval,
    VendorUserRegistration,
  },
}
</script>
