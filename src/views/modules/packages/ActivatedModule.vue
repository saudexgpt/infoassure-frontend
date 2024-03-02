<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Module Packages</h4>
        </b-col>
      </b-row>
    </div>
    <!-- table -->
    <h4>Click on the <code>+</code> sign to view package details</h4>
    <v-client-table
      v-model="activated_modules"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="child_row"
        slot-scope="{row}"
      >
        <aside>
          <el-row :gutter="15">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
            >
              <h3>Clients on Module Package</h3>
              <table class="table table-bordered">
                <tbody>
                  <tr
                    v-for="client in row.clients"
                    :key="client.id"
                  >
                    <td>{{ client.name }}</td>
                    <td>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="Remove Client"
                        placement="top-start"
                      >
                        <b-button
                          variant="gradient-danger"
                          class="btn-icon rounded-circle"
                          @click="removeClientModule(row.id, client.id)"
                        >
                          <feather-icon icon="TrashIcon" />
                        </b-button>
                      </el-tooltip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
        </aside>

      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="Add Partners"
          placement="top-start"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon"
            @click="addModule(props.row)"
          >
            <feather-icon icon="PlusIcon" /> Add Client
          </b-button>
        </el-tooltip>
      </div>
    </v-client-table>
    <add-clients-to-module
      v-if="isCreatePackageModuleSidebarActive"
      v-model="isCreatePackageModuleSidebarActive"
      :selected-package="selectedPackage"
      @save="updateTable"
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
import AddClientsToModule from './partials/AddClientsToModule.vue'

export default {
  components: {
    // VueGoodTable,
    AddClientsToModule,
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
      isCreatePackageSidebarActive: false,
      isCreatePackageModuleSidebarActive: false,
      isCreateSchoolPackageSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'available_module.name',
        'action',
      ],

      options: {
        headings: {
          'available_module.name': 'Module Name',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'name',
        ],
        // filterable: false,
        filterable: [
          'name',
        ],
      },
      activated_modules: [],
      searchTerm: '',
      selectedPackage: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchPackages()
  },
  methods: {
    fetchPackages() {
      const app = this
      app.loading = true
      const fetchPackageResource = new Resource('packages/fetch-activated-modules')
      fetchPackageResource.list()
        .then(response => {
          app.activated_modules = response.activated_modules
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchPackages()
    },
    addModule(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selectedPackage = selectedRow
      app.isCreatePackageModuleSidebarActive = true
    },
    removeClientModule(id, clientId) {
      // console.log(props)
      const app = this
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (window.confirm('Kindly confirm action')) {
        // app.packages = []
        const fetchPackageResource = new Resource('packages/deactivate-client-module')
        fetchPackageResource.update(id, { client_id: clientId })
          .then(() => {
            app.fetchPackages()
            app.loading = false
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchPackages()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
