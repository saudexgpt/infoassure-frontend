<template>
  <div>
    <!-- <div slot="header">
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            List of Staff
          </h3>
        </b-col>
      </b-row>
      <hr>
    </div> -->
    <aside>
      <el-row :gutter="5">
        <el-col
          :lg="8"
          :md="8"
          :sm="24"
          :xs="24"
        >
          <el-select
            v-model="selected_user"
            filterable
            style="width: 100%"
            placeholder="Select Staff"
            value-key="id"
            @input="setRolesAndPermissions()"
          >
            <!-- <el-option
              v-for="(each_staff, index) in staff"
              :key="index"
              :value="index"
              :label="each_staff.user.first_name + ' ' + each_staff.user.last_name"
              :disabled="disableAdmin(each_staff.user.roles)"
            /> -->
            <el-option
              v-for="(each_staff, index) in staff"
              :key="index"
              :value="each_staff"
              :label="each_staff.name"
            />
          </el-select>
        </el-col>
        <el-col
          :lg="8"
          :md="8"
          :sm="24"
          :xs="24"
        >
          <el-select
            v-model="new_roles"
            multiple
            filterable
            collapse-tags
            style="width: 100%"
            placeholder="Select Roles"
            @change="assignRoles()"
          >
            <el-option
              v-for="(role, index) in staff_roles"
              :key="index"
              :value="role.id"
              :label="role.display_name"
            />
          </el-select>
        </el-col>
        <el-col
          :lg="8"
          :md="8"
          :sm="24"
          :xs="24"
        >
          <el-select
            v-model="new_permissions"
            multiple
            filterable
            collapse-tags
            style="width: 100%"
            placeholder="Select Permissions"
            @change="assignPermissions()"
          >
            <el-option
              v-for="(permission, index) in permissions"
              :key="index"
              :value="permission.id"
              :label="permission.display_name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <div>
      <v-client-table
        v-model="staff"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="name"
          slot-scope="props"
        >
          {{ props.row.name }}
        </div>
        <div
          slot="assigned_roles"
          slot-scope="props"
        >
          <span
            v-for="(role, role_index) in props.row.roles"
            :key="role_index"
          >
            <small>{{ role_index + 1 + ') ' + role.display_name }}<br></small>
          </span>
        </div>
        <div
          slot="assigned_permissions"
          slot-scope="props"
        >
          <span
            v-for="(permission, perm_index) in props.row.permissions"
            :key="perm_index"
          >
            <el-tag>{{ perm_index + 1 + ') ' + permission.display_name }}</el-tag>&nbsp;
          </span>
        </div>
      </v-client-table>

    </div>
  </div>
</template>
<script>
import {
  VBTooltip,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    // BAlert,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    // BRow,
    // BCol,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'id',
        'name',
        'assigned_roles',
        'assigned_permissions',
      ],

      options: {
        headings: {
          id: 'ID',
          name: 'Name',
          assigned_roles: 'Assigned Roles',
          assigned_permissions: 'Assigned Permissions',

          // id: 'S/N',
        },
        sortable: [
          'user.username',
          'user.last_name',
          'user.first_name',
        ],
        // filterable: false,
        filterable: [
          'user.username',
          'user.last_name',
          'user.first_name',
        ],
      },
      staff: [],
      staff_roles: [],
      permissions: [],
      new_roles: [],
      new_permissions: [],
      selected_user: '',
      loading: false,
    }
  },
  created() {
    this.fetchPermissions()
    this.fetchRoles()
    this.fetchStaff()
  },
  methods: {
    disableAdmin(roles) {
      let response = false
      roles.forEach(role => {
        if (role.name === 'admin') {
          response = true
        }
      })
      return response
    },
    fetchStaff() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('users/fetch-staff')
      fetchStaffResource.list()
        .then(response => {
          app.staff = response.staff
          app.loading = false
        })
    },
    fetchPermissions() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('acl/permissions/index')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.permissions = response.permissions
        })
    },
    fetchRoles() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('acl/roles/index')
      fetchCurriculumSetupResource.list({ option: 'staff' })
        .then(response => {
          app.staff_roles = response.roles
        })
    },
    setRolesAndPermissions() {
      const app = this
      app.new_permissions = []
      app.new_roles = []
      // console.log(app.staff[userIndex].user)
      const userRoles = app.selected_user.roles
      userRoles.forEach(role => {
        app.new_roles.push(role.id)
      })
      const userPermissions = app.selected_user.permissions
      userPermissions.forEach(permission => {
        app.new_permissions.push(permission.id)
      })
    },
    assignRoles() {
      const app = this
      const userId = app.selected_user.id
      const fetchCurriculumSetupResource = new Resource('acl/roles/assign')
      const param = { user_id: userId, roles: app.new_roles }
      fetchCurriculumSetupResource.store(param)
        .then(response => {
          app.selected_user.roles = response.roles
          app.selected_user.permissions = response.permissions
        })
    },
    assignPermissions() {
      const app = this
      const userId = app.staff[app.selected_user_index].user.id
      const fetchCurriculumSetupResource = new Resource('acl/permissions/assign-user')
      const param = { user_id: userId, permissions: app.new_permissions }
      fetchCurriculumSetupResource.store(param)
        .then(response => {
          app.staff[app.selected_user_index].user.permissions = response.permissions
        })
    },
  },
}
</script>
