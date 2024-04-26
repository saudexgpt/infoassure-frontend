<template>
  <el-card>
    <div v-if="display === 'table'">
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
                @click="display = 'create'"
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
        v-model="business_processes"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
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
              @click="editProcess(props.row)"
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
    </div>
    <create-business-process
      v-if="display === 'create'"
      v-model="isCreateBusinessProcessSidebarActive"
      :business-unit-id="businessUnitId"
      :client-id="clientId"
      @save="fetchBusinessProcesses"
    />
    <edit-business-process
      v-if="display === 'edit'"
      v-model="isEditBusinessProcessSidebarActive"
      :business-process="selectedBusinessProcess"
      @updated="fetchBusinessProcesses"
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
import CreateBusinessProcess from './CreateBusinessProcess.vue'
import EditBusinessProcess from './EditBusinessProcess.vue'

export default {
  components: {
    CreateBusinessProcess,
    EditBusinessProcess,
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    businessUnitId: {
      type: Number,
      default: null,
    },
    clientId: {
      type: Number,
      default: null,
    },
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
      display: 'table',
      pageLength: 10,
      dir: false,
      columns: [
        // 'client_id',
        // 'business_unit_id',
        'action',
        'name',
        'owner.name',
        'teams',
        'status',
        // 'minimum_no_of_people_involved',
        // 'product_or_service_delivered',
        // 'regulatory_obligations',
        // 'applications_used',
        // 'business_units_depended_on',
        // 'processes_depended_on',
        // 'key_vendors_or_external_dependencies',
        // 'vital_non_electronic_records',
        // 'vital_electronic_records',
        // 'alternative_workaround_during_system_failure',
        // 'key_individuals_process_depends_on',
        // 'peak_periods',
        // 'remote_working',
      ],
      options: {
        headings: {
          'owner.name': 'Process Owner',
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
      business_processes: [],
    }
  },
  created() {
    this.fetchBusinessProcesses()
  },
  methods: {
    checkPermission,
    fetchBusinessProcesses() {
      const app = this
      app.display = 'table'
      app.loading = true
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource.list({ business_unit_id: app.businessUnitId })
        .then(response => {
          app.business_processes = response.business_processes
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    editProcess(row) {
      const app = this
      app.selectedBusinessProcess = row
      app.display = 'edit'
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
