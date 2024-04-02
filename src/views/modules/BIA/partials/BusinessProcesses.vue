<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Business Processes</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-success"
              @click="isCreateBusinessProcessSidebarActive = true"
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
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            @input="fetchBusinessProcesses()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit.id"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <v-client-table
      v-model="business_processes"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="action"
        slot-scope="$props"
      >
        <el-tooltip
          content="Edit"
          placement="top"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="fetchClients()"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
        <b-button
          v-if="checkPermission(['delete-client project'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <create-business-process
      v-if="isCreateBusinessProcessSidebarActive"
      v-model="isCreateBusinessProcessSidebarActive"
      :clients="clients"
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
import createBusinessProcess from './CreateBusinessProcess.vue'

export default {
  components: {
    createBusinessProcess,
    BButton,
    BRow,
    BCol,
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
      isCreateBusinessProcessSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        // 'client_id',
        // 'business_unit_id',
        'name',
        'description',
        'roles_responsible',
        'no_of_people_involved',
        'minimum_no_of_people_involved',
        'product_or_service_delivered',
        'regulatory_obligations',
        'applications_used',
        'business_units_depended_on',
        'processes_depended_on',
        'key_vendors_or_external_dependencies',
        'vital_non_electronic_records',
        'vital_electronic_records',
        'alternative_workaround_during_system_failure',
        'key_individuals_process_depends_on',
        'peak_periods',
        'remote_working',
        'action',
      ],
      options: {
        headings: {
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
        sortable: [
          'standard.name',
        ],
        // filterable: false,
        filterable: [
          'standard.name',
        ],
      },
      business_unit_id: '',
      business_units: [],
      business_processes: [],
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
      const fetchBusinessProcesssResource = new Resource('clients')
      fetchBusinessProcesssResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    fetchBusinessUnits() {
      const app = this
      app.business_unit_id = ''
      const fetchBusinessUnitsResource = new Resource('bia/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchBusinessProcesses() {
      const app = this
      app.loading = true
      const fetchBusinessProcesssResource = new Resource('bia/fetch-business-processes')
      fetchBusinessProcesssResource.list({ business_unit_id: app.business_unit_id, client_id: app.selectedClient.id })
        .then(response => {
          app.business_processes = response.business_processes
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('business_units/destroy')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchBusinessProcesss()
            app.loading = false
          })
      }
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
