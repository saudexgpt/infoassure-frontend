<template>
  <el-card>
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.client_id"
            placeholder="Select Client"
            style="width: 100%;"
            filterable
            @input="fetchBusinessUnits()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client.id"
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
            v-model="form.business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            filterable
            @input="fetchRisks()"
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
      v-model="risks"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="action"
        slot-scope="{row}"
      >
        <el-tooltip
          content="Edit"
          placement="top"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="editRisk(row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
        <b-button
          v-if="checkPermission(['delete-client project'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
  </el-card>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BButton,
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
      isEditRiskSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'risk_unique_id', 'type', 'description', 'outcome', 'risk_owner', 'control_no', 'control_location', 'control_description', 'control_frequency', 'control_owner', 'control_type', 'nature_of_control', 'application_used_for_control', 'compensating_control', 'test_procedures', 'sample_size', 'data_required', 'link_to_evidence', 'test_conclusion', 'gap_description', 'tod_improvement_opportunity',
        'recommendation', 'responsibility', 'timeline', 'tod_gap_status',
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
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      risks: [],
      clients: [],
      business_units: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      form: {
        client_id: '',
        business_unit_id: '',
      },
      selectedRisk: null,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      const fetchCriteriaResource = new Resource('clients')
      fetchCriteriaResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.form.client_id = app.clients[0].id
            app.fetchBusinessUnits()
          }
        })
    },
    fetchBusinessUnits() {
      const app = this
      app.form.business_unit_id = ''
      const fetchCriteriaResource = new Resource('business-units/fetch-business-units')
      fetchCriteriaResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.business_units = response.business_units
        }).catch(() => { app.loading = false })
    },
    fetchRisks() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('risk-assessment/fetch-risks')
      fetchRisksResource.list({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.risks = response.risks
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    editRisk(row) {
      const app = this
      app.selectedRisk = row
      app.isEditRiskSidebarActive = true
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
