<template>
  <el-card>
    <el-tabs pills nav-class="nav-pill-primary" content-class="mt-1">
      <!-- This tabs content will always be mounted -->
      <el-tab>
        <template #title>
          <feather-icon icon="UsersIcon" />
          <span>Manage Role</span>
        </template>
        <roles />
      </el-tab>
      <el-tab lazy>
        <template #title>
          <feather-icon icon="KeyIcon" />
          <span>Assign Privileges</span>
        </template>
        <assign-access />
      </el-tab>
    </el-tabs>
  </el-card>
</template>

<script>
import Roles from './Roles.vue'
import AssignAccess from './partials/AssignAccess.vue'

export default {
  components: {
    Roles,
    AssignAccess
  }
}
</script>
