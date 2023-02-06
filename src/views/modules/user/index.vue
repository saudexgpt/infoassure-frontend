<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <!-- This tabs content will always be mounted -->
      <b-tab lazy>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Staff List</span>
        </template>
        <staff-list />
      </b-tab>
      <!-- This tabs content will not be mounted until the tab is shown -->
      <!-- and will be un-mounted when hidden -->
      <b-tab v-if="checkPermission(['create-staff'])">
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Staff Registration</span>
        </template>
        <staff-registration />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import StaffList from './partials/StaffList.vue'
import StaffRegistration from './partials/RegisterStaff.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    StaffList,
    StaffRegistration,
  },
  methods: {
    checkPermission,
  },
}
</script>
