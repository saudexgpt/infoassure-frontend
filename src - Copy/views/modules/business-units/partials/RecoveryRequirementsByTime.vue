<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Impact Recovery Requirements by Time</h4>
        </b-col>
      </b-row>
    </div>
    <!-- <aside>

      Create New Entry
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="10"
          :md="10"
        >
          <el-input
            v-model="form.name"
            placeholder="Example: 2 hours"
            style="width: 100%"
          />
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-input
            v-model="form.time_in_minutes"
            type="number"
            placeholder="Example: 120"
            style="width: 100%"
          >
            <template #append>
              Minutes
            </template>
          </el-input>
        </el-col>
        <el-col
          :xs="24"
          :sm="4"
          :md="4"
        >
          <small>&nbsp;</small>
          <b-button
            variant="primary"
            @click="saveImpactCriteria()"
          >
            Submit
          </b-button>
        </el-col>
      </el-row>
    </aside> -->
    <v-client-table
      v-model="time_recovery_requirements"
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
          @blur="updateEntry($event.target.value, props.row.id)"
        >
      </div>
      <div
        slot="time_in_minutes"
        slot-scope="props"
      >
        <el-input
          v-model="props.row.time_in_minutes"
          type="number"
          placeholder="Example: 120"
          @blur="updateEntry($event, props.row.id)"
        >
          <template #append>
            Minutes
          </template>
        </el-input>
      </div>
      <!-- <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div> -->
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
  BRow, BCol,
} from 'bootstrap-vue'
  // import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateImpactCriteria from './CreateImpactCriteria.vue'

export default {
  components: {
    CreateImpactCriteria,
    // BButton,
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
        'time_in_minutes',
        // 'action',
      ],
      options: {
        headings: {
          name: 'Time Tag',
          time_in_minutes: 'Time in Minutes',
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
        name: '',
        time_in_minutes: null,
      },
      time_recovery_requirements: [],
      clients: [],
      business_units: [],
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    selectedClient() {
      this.form.client_id = this.selectedClient.id
      this.fetchTimeRecoveryRequirement()
    },
  },
  created() {
    this.form.client_id = this.selectedClient.id
    if (this.selectedClient.id !== null) {
      this.fetchTimeRecoveryRequirement()
    } else {
      this.$alert('Please select a client to continue')
    }
  },
  methods: {
    checkPermission,
    fetchTimeRecoveryRequirement() {
      const app = this
      app.loading = true
      app.isCreateCriteriaSidebarActive = false
      const fetchCriteriaResource = new Resource('business-units/get-bia-time-recovery-requirement')
      fetchCriteriaResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.time_recovery_requirements = response.time_recovery_requirements
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    saveImpactCriteria() {
      const app = this
      app.loading = true
      const saveCriteriaResource = new Resource('business-units/save-bia-time-recovery-requirement')
      saveCriteriaResource.store(app.form)
        .then(() => {
          app.$message('Successful')
          app.form.name = ''
          app.form.time_in_minutes = ''
          app.fetchTimeRecoveryRequirement()
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateEntry(field, value, id) {
      const app = this
      const updateCriteriaResource = new Resource('business-units/update-bia-time-recovery-requirement')
      updateCriteriaResource.update(id, { field, value })
        .then(() => {
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('business-units/delete-bia-time-recovery-requirement')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.$message('Successful')
            app.fetchTimeRecoveryRequirement()
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
