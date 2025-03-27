<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Available Permissions</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreatePermissionSidebarActive = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <!-- table -->

    <v-client-table
      v-model="permissions"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <!-- <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </b-button>
      </div> -->
    </v-client-table>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
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
      isCreatePermissionSidebarActive: false,
      isEditPermissionSidebarActive: false,
      pageLength: 10,
      dir: false,

      columns: [
        // 'name',
        'display_name',
        // 'description',
        // 'action',
      ],

      options: {
        headings: {
          display_name: 'Permission',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          // 'name',
          'display_name',
          // 'description',
        ],
        // filterable: false,
        filterable: [
          // 'name',
          'display_name',
          // 'description',
        ],
      },
      permissions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchPermissions()
  },
  methods: {
    fetchPermissions() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('acl/permissions/index')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.permissions = response.permissions
          app.loading = false
        })
    },
    updateTable(permissions) {
      const app = this
      app.permissions = permissions
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditPermissionSidebarActive = true
    },
    updateEditedTableRow() {
      const app = this
      app.fetchPermissions()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
