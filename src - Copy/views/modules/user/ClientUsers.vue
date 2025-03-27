<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
    >
      <b-tab lazy>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Users List</span>
        </template>
        <client-users-list />
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Register Users</span>
        </template>
        <client-user-registration />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import ClientUsersList from './partials/ClientUsersList.vue'
import ClientUserRegistration from './partials/RegisterUserClient.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    ClientUsersList,
    ClientUserRegistration,
  },
  methods: {
    checkPermission,
  },
}
</script>
