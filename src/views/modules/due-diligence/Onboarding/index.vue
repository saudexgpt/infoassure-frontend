<template>
  <el-tabs
    type="border-card"
  >
<<<<<<< HEAD
    <el-tab-pane lazy>
      <span slot="label"><i class="el-icon-odometer" /> Overview</span>
      <dashboard />
    </el-tab-pane>
    <el-tab-pane lazy>
      <span slot="label"><feather-icon icon="SettingsIcon" /> Manage Vendors</span>
      <el-tabs
=======
    <!-- <el-tab-pane lazy>
      <span slot="label"><i class="el-icon-odometer" /> Dashboard</span>
      <dashboard />
    </el-tab-pane> -->
    <el-tab-pane lazy>
      <span slot="label"><feather-icon icon="HomeIcon" /> Manage Vendors</span>
      <el-tabs
        type="card"
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
        @tab-click="forceRerender"
      >
        <el-tab-pane
          :key="keyValue"
          lazy
        >
          <span slot="label"><feather-icon icon="ListIcon" /> Vendors List</span>
          <vendor-list />
        </el-tab-pane>
        <el-tab-pane
          lazy
        >
          <span slot="label"><feather-icon icon="PlusIcon" /> Create Vendors</span>
          <vendor-registration />
        </el-tab-pane>
<<<<<<< HEAD
        <!-- <el-tab-pane
=======
        <el-tab-pane
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
          lazy
        >
          <span slot="label"><feather-icon icon="UserPlusIcon" /> Register Vendor Users</span>
          <vendor-user-registration />
<<<<<<< HEAD
        </el-tab-pane> -->
=======
        </el-tab-pane>
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane
      lazy
    >
      <span slot="label"><feather-icon icon="SearchIcon" /> Vendors Screening/Approval</span>
      <screening-and-approval />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
<<<<<<< HEAD
import Dashboard from './Dashboard.vue'
import VendorList from './partials/VendorList.vue'
import VendorRegistration from './partials/RegisterVendor.vue'
import ScreeningAndApproval from './partials/ScreeningAndApproval.vue'
// import VendorUserRegistration from './partials/RegisterUserVendor.vue'

export default {
  components: {
    Dashboard,
    VendorList,
    VendorRegistration,
    ScreeningAndApproval,
    // VendorUserRegistration,
=======
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
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
  },
  data() {
    return {
      keyValue: 1,
    }
  },
  methods: {
    forceRerender() {
      // console.log(e)
      this.keyValue += 1
    },

  },
}
</script>
