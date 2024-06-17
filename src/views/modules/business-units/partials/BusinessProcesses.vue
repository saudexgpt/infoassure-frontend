<template>
  <el-card>
    <div v-if="display === 'table'">
      <div slot="header">
        <b-row>
          <b-col cols="6">
            <h4>Manage Business Processes & Validation</h4>
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
                <span class="align-middle">Create New</span>
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
          slot="status"
          slot-scope="{row}"
        >
          <el-badge
            :value="row.status"
            :type="formatColor(row.status)"
          />
          <div v-if="canChangeStatus">
            <el-select
              v-model="row.status"
              @change="changeStatus(row, $event)"
            >
              <el-option
                v-for="(status, index) in statuses"
                :key="index"
                :value="status"
                :label="status"
              />
            </el-select>
            <!-- <el-button
              v-if="row.status == 'Pending'"
              type="success"
              size="mini"
              @click="changeStatus(row, 'Completed')"
            >
              Mark As Completed
            </el-button>
            <el-button
              v-else
              type="danger"
              size="mini"
              @click="changeStatus(row, 'Pending')"
            >
              Mark As Pending
            </el-button> -->
          </div>
        </div>
        <div
          slot="flow_chart_diagram"
          slot-scope="{row}"
        >
          <img
            v-if="row.flow_chart_diagram !== null"
            :src="`${baseServerUrl}storage/${row.flow_chart_diagram}`"
            width="100"
            alt="Diagram Not Uploaded"
            @click="selectedDiagram = row.flow_chart_diagram; enlargeDiagram = true"
          >
        </div>
        <div
          slot="action"
          slot-scope="props"
        >
          <el-tooltip
            content="View Details"
            placement="top"
          >
            <b-button
              variant="gradient-primary"
              class="btn-icon rounded-circle"
              @click="editProcess(props.row)"
            >
              <feather-icon icon="EyeIcon" />
            </b-button>
          </el-tooltip>
          <el-tooltip
            content="Upload Process Flow"
            placement="top"
          >
            <b-button
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="uploadProcessFlow(props.row)"
            >
              <feather-icon icon="UploadIcon" />
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
      :business-process="selectedBusinessProcess"
      @updated="fetchBusinessProcesses"
    />
    <b-modal
      v-model="showModal"
      title="Upload Process Flow Diagram (Expected File Format: jpeg, jpg, or png)"
      centered
      size="lg"
      hide-footer
    >
      <div v-loading="uploading">
        <input
          class="form-control"
          type="file"
          @change="onImageChange"
        >
        <br>
        <b-button
          variant="success"
          class="btn-icon"
          :disabled="uploadableFile === null"
          @click="submitUpload()"
        >
          Submit
        </b-button>
      </div>
    </b-modal>
    <b-modal
      v-model="enlargeDiagram"
      title="Uploaded Process Flow Diagram"
      centered
      size="lg"
      hide-footer
    >
      <div align="center">
        <img
          :src="`${baseServerUrl}storage/${selectedDiagram}`"
          alt="Diagram Not Uploaded"
        >
      </div>
    </b-modal>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol, BModal,
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
    BModal,
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
    canChangeStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statuses: ['In Progress', 'Completed', 'Complete and Validated'],
      loading: false,
      display: 'table',
      pageLength: 10,
      dir: false,
      columns: [
        // 'client_id',
        // 'business_unit_id',
        'generated_process_id',
        'name',
        'process_owner',
        'teams',
        'flow_chart_diagram',
        'status',
        'action',
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
          generated_process_id: 'ID',
          process_owner: 'Process Owner',
          flow_chart_diagram: 'Flow Chart Diagram',
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
      selectedBusinessProcess: null,
      showModal: false,
      uploadableFile: null,
      uploading: false,
      enlargeDiagram: false,
      selectedDiagram: null,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
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
    formatColor(status) {
      let statusColor = 'danger'
      switch (status) {
        case 'Complete and Validated':
          statusColor = 'success'
          break
        case 'Completed':
          statusColor = 'primary'
          break
        default:
          break
      }
      return statusColor
    },
    changeStatus(row, status) {
      const app = this
      console.log(status)
      app.loading = true
      const changeStatusResource = new Resource('business-units/change-process-status')
      changeStatusResource.update(row.id, { status })
        .then(() => {
          app.loading = false
          app.fetchBusinessProcesses()
        }).catch(() => { app.loading = false })
    },
    editProcess(row) {
      const app = this
      app.selectedBusinessProcess = row
      app.display = 'edit'
    },
    uploadProcessFlow(row) {
      const app = this
      app.selectedBusinessProcess = row
      app.showModal = true
    },
    onImageChange(e) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.uploadableFile = e.target.files[0]
    },
    submitUpload() {
      const app = this
      app.uploading = true
      const formData = new FormData()
      formData.append('id', app.selectedBusinessProcess.id)
      formData.append('file_uploaded', app.uploadableFile)
      const updatePhotoResource = new Resource('business-units/upload-process-flow')
      updatePhotoResource.store(formData)
        .then(() => {
          app.uploading = false
          app.uploadableFile = null
          app.fetchBusinessProcesses()
          app.$message('File upload successful')
          app.showModal = false
        })
        .catch(e => {
          app.uploading = false
          app.$message(e.response.data.message)
        })
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
