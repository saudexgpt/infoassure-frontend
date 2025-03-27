<template>
  <el-card>
    <b-tabs
      pills
      nav-class="nav-pill-primary"
      content-class="mt-1"
    >
      <!-- This tabs content will always be mounted -->
      <b-tab>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>Manage Role</span>
        </template>
        <roles />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="KeyIcon" />
          <span>Assign Privileges</span>
        </template>
        <assign-access />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import Roles from './Roles.vue'
import AssignAccess from './partials/AssignAccess.vue'

export default {
  components: {
    BTabs,
    BTab,
    Roles,
    AssignAccess,
  },
}
</script>
