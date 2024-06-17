<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Impact Criteria</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              variant="gradient-success"
              @click="isCreateSidebarActive = true"
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
    <v-client-table
      v-model="risk_impact_areas"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="area"
        slot-scope="{row}"
      >
        <input
          v-model="row.area"
          type="text"
          class="form-control"
          @blur="editRow(row.id, $event)"
        >
      </div>
      <div
        slot="action"
        slot-scope="{row}"
      >
        <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <create-risk
      v-if="isCreateSidebarActive"
      v-model="isCreateSidebarActive"
      :client-id="selectedClient.id"
      @save="fetchRiskImpactAreas"
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
import CreateRisk from './partials/CreateRiskImpactArea.vue'

export default {
  components: {
    CreateRisk,
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
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      page: 'table',
      columns: [
        'area',
        'action',
      ],
      options: {
        headings: {
          area: 'Impact Areas',
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
      risk_impact_areas: [],
    }
  },
  created() {
    this.fetchRiskImpactAreas()
  },
  methods: {
    checkPermission,
    fetchRiskImpactAreas() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-impact-area')
      fetchRisksResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.risk_impact_areas = response.risk_impact_areas
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    editRow(id, event) {
      const app = this
      const updateResource = new Resource('update-risk-impact-area')
      updateResource.update(id, { area: event.target.value })
        .then(() => {
          app.$message({
            message: 'Updated',
            type: 'success',
          })
          app.loading = false
        })
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyResource = new Resource('delete-risk-impact-area')
        destroyResource.destroy(row.id)
          .then(() => {
            app.fetchRiskImpactAreas()
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
