<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Risk/Threat Register</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="page === 'table'"
              variant="gradient-success"
              @click="page = 'create'"
            >
              <feather-icon
                icon="PlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
            <b-button
              v-else
              variant="gradient-danger"
              @click="page = 'table'"
            >
              <feather-icon
                icon="XIcon"
                class="mr-50"
              />
              <span class="align-middle">Close</span>
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
      v-if="page === 'table'"
      v-model="risk_registers"
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
    <div v-if="page === 'create'">
      <create-risk
        :client-id="selectedClient.id"
        :business-unit-id="form.business_unit_id"
        @save="fetchRisks(); page = 'table'"
      />
    </div>
    <edit-risk
      v-if="isEditRiskSidebarActive"
      v-model="isEditRiskSidebarActive"
      :selected-risk="selectedRisk"
      @update="fetchRisks"
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
import CreateRisk from './partials/CreateRiskRegister.vue'
import EditRisk from './partials/EditRiskRegister.vue'

export default {
  components: {
    CreateRisk,
    EditRisk,
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedClient: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      isCreateRiskSidebarActive: false,
      isEditRiskSidebarActive: false,
      pageLength: 10,
      dir: false,
      page: 'table',
      columns: [
        'unit_name',
        'risk_id',
        'risk_type',
        'vunerability_description',
        'threat_impact_description',
        'existing_controls',
        'risk_owner',
        'action',
      ],
      options: {
        headings: {
          unit_name: 'Business Unit',
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
      risk_registers: [],
      business_units: [],
      showManageProject: false,
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
    this.form.client_id = this.selectedClient.id
    this.fetchBusinessUnits()
  },
  methods: {
    checkPermission,
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
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource.list({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.risk_registers = response.risk_registers
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
