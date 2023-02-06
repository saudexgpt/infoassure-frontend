<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Available Roles</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateRoleSidebarActive = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create Role</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <aside>
      <el-row :gutter="5">
        <el-col
          :lg="12"
          :md="12"
          :sm="12"
          :xs="12"
        >
          <small>Select Role</small>
          <el-select
            v-model="selected_role_index"
            filterable
            style="width: 100%"
            @input="setPermissions()"
          >
            <!-- <el-option
              v-for="(role, index) in roles"
              :key="index"
              :value="index"
              :disabled="role.name === 'admin'"
              :label="role.display_name"
            /> -->
            <el-option
              v-for="(role, index) in roles"
              :key="index"
              :value="index"
              :label="role.display_name"
              :disabled="role.name ==='super'"
            />
          </el-select>
        </el-col>
        <el-col
          :lg="12"
          :md="12"
          :sm="12"
          :xs="12"
        >
          <small>Select relevant permissions to assign to selected role</small>
          <el-select
            v-model="new_permissions"
            multiple
            filterable
            collapse-tags
            style="width: 100%"
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
    <!-- table -->

    <v-client-table
      v-model="roles"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
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
      <div
        slot="action"
        slot-scope="props"
      >
        <template v-if="school">

          <b-button
            v-if="school.id === props.row.school_id"
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </template>
        <template v-else>

          <b-button
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </template>
      </div>
    </v-client-table>
    <create-role
      v-if="isCreateRoleSidebarActive"
      v-model="isCreateRoleSidebarActive"
      @save="updateTable"
    />
    <edit-role
      v-if="isEditRoleSidebarActive"
      v-model="isEditRoleSidebarActive"
      :selected-role="editable_row"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateRole from './partials/AddRole.vue'
import EditRole from './partials/EditRole.vue'

export default {
  components: {
    // VueGoodTable,
    CreateRole,
    EditRole,
    BButton,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      isCreateRoleSidebarActive: false,
      isEditRoleSidebarActive: false,
      pageLength: 10,

      columns: [
        // 'name',
        'display_name',
        'description',
        'assigned_permissions',
        'action',
      ],

      options: {
        headings: {
          display_name: 'Role',
          assigned_permissions: 'Assigned Permissions',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        // filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          // 'name',
          'display_name',
          'description',
        ],
        // filterable: false,
        filterable: [
          // 'name',
          'display_name',
          'description',
        ],
      },
      roles: [],
      permissions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      school: '',
      selected_role_index: '',
      new_permissions: [],
    }
  },
  created() {
    this.fetchPermissions()
    this.fetchRoles()
  },
  methods: {
    fetchRoles() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('acl/roles/index')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.roles = response.roles
          app.school = response.school
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
    updateTable(roles) {
      const app = this
      app.roles = roles
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditRoleSidebarActive = true
    },
    updateEditedTableRow() {
      const app = this
      app.fetchRoles()
    },
    setPermissions() {
      const app = this
      const roleIndex = app.selected_role_index
      const rolePermissions = app.roles[roleIndex].permissions
      rolePermissions.forEach(permission => {
        app.new_permissions.push(permission.id)
      })
    },
    assignPermissions() {
      const app = this
      const roleId = app.roles[app.selected_role_index].id
      const fetchCurriculumSetupResource = new Resource('acl/permissions/assign-role')
      const param = { role_id: roleId, permissions: app.new_permissions }
      fetchCurriculumSetupResource.store(param)
        .then(response => {
          app.roles[app.selected_role_index].permissions = response.permissions
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
