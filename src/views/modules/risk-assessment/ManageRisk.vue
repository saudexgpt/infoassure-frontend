<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Risk</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-success"
              @click="isCreateRiskSidebarActive = true"
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
            @input="fetchRisks()"
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
    <v-client-table
      v-model="risks"
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
            @click="manageProject(props.row)"
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
    <create-risk
      v-if="isCreateRiskSidebarActive"
      v-model="isCreateRiskSidebarActive"
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
import createRisk from './partials/CreateRisk.vue'

export default {
  components: {
    createRisk,
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
      isCreateRiskSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'risk_unique_id',
        'type',
        'description',
        'outcome',
        'action',
      ],
      options: {
        headings: {
          risk_unique_id: 'Risk ID',
          type: 'Risk Type',
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
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      risks: [],
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
      const fetchRisksResource = new Resource('clients')
      fetchRisksResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    fetchRisks() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('risk-assessment/fetch-risks')
      fetchRisksResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.risks = response.risks
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('risk-assessment/destroy')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchRisks()
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
