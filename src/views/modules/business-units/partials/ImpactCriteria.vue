<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Business Unit Impact Criteria</h4>
        </b-col>
      </b-row>
    </div>

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
          @input="fetchCriteria()"
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

    <aside v-if="form.business_unit_id !== ''">

      Create New
      <el-row>
        <el-col
          :xs="24"
          :sm="18"
          :md="18"
        >
          <el-select
            v-model="form.impact_criteria"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Type Impact Criteria. Example: Financial Loss"
            style="width: 100%"
          >
            <el-option
              v-for="item in form.impact_criteria"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select><br>
          <el-alert
            type="error"
            :closable="false"
          >
            Create Impact Criteria for the selected Business Unit. Hit <code>Enter</code> to create multiple entries, then Click on Submit
          </el-alert>
        </el-col>
        <el-col
          :xs="24"
          :sm="6"
          :md="6"
        >
          <small>&nbsp;</small>
          <el-button
            type="primary"
            @click="saveImpactCriteria()"
          >
            Submit
          </el-button>
        </el-col>
      </el-row>
    </aside>
    <v-client-table
      v-if="form.business_unit_id !== ''"
      v-model="impact_criteria"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="name"
        slot-scope="props"
      >
        <input
          v-model="props.row.name"
          class="form-control"
          type="text"
          @blur="updateEntry($event, props.row.id)"
        >
      </div>
      <div
        slot="action"
        slot-scope="$props"
      >
        <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <create-impact-criteria
      v-if="isCreateCriteriaSidebarActive"
      v-model="isCreateCriteriaSidebarActive"
      :clients="clients"
      @save="fetchCriteria"
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
import CreateImpactCriteria from './CreateImpactCriteria.vue'

export default {
  components: {
    CreateImpactCriteria,
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      isCreateCriteriaSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        // 'access_code',
        'action',
      ],
      options: {
        headings: {
          name: 'Name (You can edit the entries)',
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
      form: {
        client_id: '',
        business_unit_id: '',
        impact_criteria: [],
      },
      impact_criteria: [],
      clients: [],
      business_units: [],
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
    fetchCriteria() {
      const app = this
      app.loading = true
      app.isCreateCriteriaSidebarActive = false
      const fetchCriteriaResource = new Resource('business-units/get-business-unit-impact-criteria')
      fetchCriteriaResource.list({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.impact_criteria = response.impact_criteria
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    saveImpactCriteria() {
      const app = this
      app.loading = true
      const saveCriteriaResource = new Resource('business-units/save-business-unit-impact-criteria')
      saveCriteriaResource.store(app.form)
        .then(() => {
          app.$message('Successful')
          app.form.impact_criteria = []
          app.fetchCriteria()
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateEntry(event, id) {
      const app = this
      const updateCriteriaResource = new Resource('business-units/update-business-unit-impact-criteria')
      updateCriteriaResource.update(id, { name: event.target.value })
        .then(() => {
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('business-units/delete-business-unit-impact-criteria')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.$message('Successful')
            app.fetchCriteria()
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
