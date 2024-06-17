<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Business Units</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-success"
              @click="isCreateBusinessUnitSidebarActive = true"
            >
              <feather-icon
                icon="PlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>

    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="selectedClient"
            value-key="id"
            placeholder="Select Client"
            style="width: 100%;"
            filterable
            @input="fetchBusinessUnits()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client"
              :label="client.name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <p>Click on the <code>+</code> sign to manage business processes</p>
    <v-client-table
      v-model="business_units"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="child_row"
        slot-scope="props"
      >
        <el-alert
          type="success"
          :closable="false"
        >
          Business Processes for {{ props.row.unit_name }}
        </el-alert>
        <business-processes
          :can-change-status="true"
          :business-unit-id="props.row.id"
          :client-id="props.row.client_id"
        />
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          content="Edit"
          placement="top"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="editRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
        <!-- <b-button
          v-if="checkPermission(['delete-client project'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button> -->
      </div>
    </v-client-table>
    <create-business-unit
      v-if="isCreateBusinessUnitSidebarActive"
      v-model="isCreateBusinessUnitSidebarActive"
      :clients="clients"
      @save="fetchBusinessUnits"
    />
    <edit-business-unit
      v-if="isEditBusinessUnitSidebarActive"
      v-model="isEditBusinessUnitSidebarActive"
      :clients="clients"
      :business-unit="selectedBusinessUnit"
      @update="fetchBusinessUnits"
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
import checkPermission from '@/utils/permission'
import createBusinessUnit from './CreateBusinessUnit.vue'
import editBusinessUnit from './EditBusinessUnit.vue'
import BusinessProcesses from './BusinessProcesses.vue'

export default {
  components: {
    createBusinessUnit,
    editBusinessUnit,
    BButton,
    BRow,
    BCol,
    BusinessProcesses,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        },
      },
      loading: false,
      isCreateBusinessUnitSidebarActive: false,
      isEditBusinessUnitSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'group_name',
        'unit_name',
        'teams',
        'function_performed',
        'contact_phone',
        // 'access_code',
        'action',
      ],
      options: {
        headings: {
          teams: 'Team/Sub Units',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      business_units: [],
      selectedBusinessUnit: null,
      clients: [],
      staff: [],
      clientUsers: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      const fetchBusinessUnitsResource = new Resource('clients')
      fetchBusinessUnitsResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.selectedClient = app.clients[0]
            app.fetchBusinessUnits()
          }
        })
    },
    fetchBusinessUnits() {
      const app = this
      app.loading = true
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    editRow(row) {
      const app = this
      app.selectedBusinessUnit = row
      app.isEditBusinessUnitSidebarActive = true
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('business_units/destroy')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchBusinessUnits()
            app.loading = false
          }).catch(() => { app.loading = false })
      }
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
