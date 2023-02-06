<template>
  <div v-if="showManageProject">
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage {{ selected_project.standard.name }} for {{ selectedClient.name }}</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-danger"
              size="sm"
              @click="showManageProject = false"
            >
              <feather-icon
                icon="ArrowLeftIcon"
                class="mr-50"
              />
              <span class="align-middle">Back</span>
            </b-button>
          </span>
        </b-col>
        <hr>
      </b-row>
    </div>
    <manage-project
      :selected-project="selected_project"
      :is-admin="true"
    />
  </div>
  <el-card v-else>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Client Projects</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-client project'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateProjectSidebarActive = true"
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
          :sm="12"
          :md="12"
        >
          <el-select
            v-model="selectedClient"
            value-key="id"
            placeholder="Select Client"
            style="width: 100%;"
            @input="fetchProjects()"
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
      v-model="projects"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="is_completed"
        slot-scope="props"
      >
        <el-select
          v-model="props.row.is_completed"
          style="width: 100%"
          @input="toggleProjectCompletion(props.row, $event)"
        >
          <el-option
            :value="0"
            label="In Progress"
          />
          <el-option
            :value="1"
            label="Completed"
          />
        </el-select>
      </div>
      <div
        slot="start_date"
        slot-scope="props"
      >
        <el-date-picker
          v-model="props.row.start_date"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Set start date"
          style="width: 140px"
          @input="setDate($event, props.row, 'start_date')"
        />
      </div>
      <div
        slot="deadline"
        slot-scope="props"
      >
        <el-date-picker
          v-model="props.row.deadline"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Set a deadline"
          style="width: 140px"
          :picker-options="pickerOptions2"
          @input="setDate($event, props.row, 'deadline')"
        />
      </div>
      <div
        slot="date_completed"
        slot-scope="props"
      >
        <el-date-picker
          v-model="props.row.date_completed"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Set completion date"
          style="width: 140px"
          :picker-options="pickerOptions"
          @input="setDate($event, props.row, 'date_completed')"
        />
      </div>
      <div
        slot="progress"
        slot-scope="{row}"
        style="width: 100%"
      >

        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="row.progress"
          :color="customColorMethod"
        />
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          :content="`View details of ${props.row.standard.name}`"
          placement="top"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="manageProject(props.row)"
          >
            <feather-icon icon="EyeIcon" />
          </b-button>
        </el-tooltip>
        <b-button
          v-if="checkPermission(['delete-client project'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <add-project
      v-if="isCreateProjectSidebarActive"
      v-model="isCreateProjectSidebarActive"
      :clients="clients"
      @save="updateTable"
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
import AddProject from './partials/AddProject.vue'
import ManageProject from './partials/ManageProject.vue'

export default {
  components: {
    AddProject,
    ManageProject,
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
      isCreateProjectSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'standard.name',
        'progress',
        // 'id',
        'start_date',
        'deadline',
        'date_completed',
        'is_completed',
      ],

      options: {
        headings: {
          'standard.name': 'Project',
          is_completed: 'Completion',
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
        sortable: [
          'standard.name',
        ],
        // filterable: false,
        filterable: [
          'standard.name',
        ],
      },
      projects: [],
      clients: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
      selectedClient: null,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    },
    fetchClients() {
      const app = this
      const fetchProjectsResource = new Resource('clients')
      fetchProjectsResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    fetchProjects() {
      const app = this
      app.loading = true
      const fetchProjectsResource = new Resource('projects/client-projects')
      fetchProjectsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.projects = response.projects // .data
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchProjects()
    },
    manageProject(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selected_project = selectedRow
      app.showManageProject = true
    },
    setDate(event, project, field) {
      const app = this
      const param = { field, date: event }
      // eslint-disable-next-line no-alert
      if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
        app.loading = true
        const setDatesResource = new Resource('projects/set-dates')
        setDatesResource.update(project.id, param)
          .then(() => {
            app.$message('Action Successfull')
            app.fetchProjects()
            app.loading = false
          })
      }
    },
    toggleProjectCompletion(project, value) {
      const app = this
      const param = { value }
      const completedVal = (value === 1) ? 'Completed' : 'In Progress'
      // eslint-disable-next-line no-alert
      if (window.confirm(`The ${project.standard.name} will be marked as ${completedVal}. Click OK to continue`)) {
        app.loading = true
        const setDatesResource = new Resource('projects/toggle-completion')
        setDatesResource.update(project.id, param)
          .then(() => {
            app.$message('Action Successfull')
            app.fetchProjects()
            app.loading = false
          })
      }
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('projects/destroy')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchProjects()
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
