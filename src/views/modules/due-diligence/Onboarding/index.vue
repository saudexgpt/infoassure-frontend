<template>
  <vendor-list />
  <!-- <el-tabs type="border-card">
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><icon icon="tabler:dashboard" /> Overview</span>
      </template>
      <dashboard />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template v-slot:label>
        <span><icon icon="tabler:tool" /> Manage Vendors</span>
      </template>
      <vendor-list />
    </el-tab-pane>
  </el-tabs> -->
</template>

<script>
// import Dashboard from './Dashboard.vue'
import VendorList from './partials/VendorList.vue'
// import VendorUserRegistration from './partials/RegisterUserVendor.vue'

export default {
  components: {
    // Dashboard,
    VendorList
    // VendorUserRegistration,
  },
  data() {
    return {
      keyValue: 1
    }
  },
  methods: {
    forceRerender() {
      // console.log(e)
      this.keyValue += 1
    }
  }
}
</script>
