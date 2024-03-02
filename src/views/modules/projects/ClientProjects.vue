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
    <client-project-details
      :selected-client="selectedClient"
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
              variant="gradient-success"
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
          :sm="8"
          :md="8"
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
        <el-col
          v-if="clientUsers.length > 0 && projects.length > 0"
          :xs="24"
          :sm="8"
          :md="8"
        >
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-danger"
            @click="showAssignModal = true"
          >
            <feather-icon
              icon="UsersIcon"
              class="mr-50"
            />
            <span class="align-middle">Assign Projects To Personnel</span>
          </b-button>
        </el-col>
        <el-col
          v-if="projects.length > 0"
          :xs="24"
          :sm="8"
          :md="8"
        >
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-dark"
            @click="showAssignConsultantModal = true"
          >
            <feather-icon
              icon="UsersIcon"
              class="mr-50"
            />
            <span class="align-middle">Assign Projects To Consultant</span>
          </b-button>
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
        slot="allow_document_uploads"
        slot-scope="{row}"
      >
        <select
          v-model="row.allow_document_uploads"
          @change="changeDocumentUploadRestriction(row, $event, 'allow_document_uploads')"
        >
          <option
            :value="0"
            label="Disabled"
          />
          <option
            :value="1"
            label="Enabled"
          />
        </select>
      </div>
      <div
        slot="assigned_staff"
        slot-scope="{row}"
      >
        <span
          v-for="(user, staff_index) in row.users"
          :key="staff_index"
        >{{ user.name }}<br></span>
      </div>
      <div
        slot="assigned_consultant"
        slot-scope="{row}"
      >
        <span
          v-for="(user, consultant_index) in row.consultants"
          :key="consultant_index"
        >{{ user.name }}<br></span>
      </div>
      <div
        slot="is_completed"
        slot-scope="props"
      >
        <select
          v-model="props.row.is_completed"
          @input="toggleProjectCompletion(props.row, $event, 'is_completed')"
        >
          <option
            :value="0"
            label="In Progress"
          />
          <option
            :value="1"
            label="Completed"
          />
        </select>
      </div>
      <!-- <div
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
      </div> -->
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
          :content="`Project Settings`"
          placement="top"
        >
          <b-button
            variant="gradient-dark"
            class="btn-icon rounded-circle"
            @click="showProjectSettings(props.row)"
          >
            <feather-icon icon="ToolIcon" />
          </b-button>
        </el-tooltip>
        <el-tooltip
          :content="`Activate project plan`"
          placement="top"
        >
          <b-button
            variant="gradient-success"
            class="btn-icon rounded-circle"
            @click="setupProjectPlan(props.row)"
          >
            <feather-icon icon="LayersIcon" />
          </b-button>
        </el-tooltip>
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
    <b-modal
      v-model="showAssignModal"
      hide-footer
      centered
      title="Fill the form to assign projects"
    >
      <el-row
        v-loading="loading"
        :gutter="20"
      >

        <el-col :xs="24">
          <el-select
            v-model="form.projectId"
            placeholder="Select Project"
            filterable
            style="width: 100%;"
          >
            <el-option
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project.id"
              :label="project.standard.name"
            />
          </el-select>
          <br>
          <br>
        </el-col>
        <el-col :xs="24">
          <el-select
            v-model="form.userIds"
            placeholder="Select Company Staff"
            multiple
            filterable
            style="width: 100%;"
          >
            <el-option
              v-for="(user, user_index) in clientUsers"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            />
          </el-select>
          <hr>
        </el-col>
        <el-col :xs="24">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-success"
            @click="submitProjectAssignment()"
          >
            <feather-icon
              icon="SaveIcon"
              class="mr-50"
            />
            <span class="align-middle">Save</span>
          </b-button>
        </el-col>
      </el-row>

    </b-modal>
    <b-modal
      v-model="showAssignConsultantModal"
      hide-footer
      centered
      title="Fill the form to assign projects to consultants"
    >
      <el-row
        v-loading="loading"
        :gutter="20"
      >

        <el-col :xs="24">
          <el-select
            v-model="consultantForm.projectIds"
            placeholder="Select Projects"
            multiple
            filterable
            style="width: 100%;"
          >
            <el-option
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project.id"
              :label="project.standard.name"
            />
          </el-select>
          <br>
          <br>
        </el-col>
        <el-col :xs="24">
          <el-select
            v-model="consultantForm.userIds"
            placeholder="Select Consultants"
            multiple
            filterable
            style="width: 100%;"
          >
            <el-option
              v-for="(user, user_index) in staff"
              :key="user_index"
              :value="user.id"
              :label="`${user.name} [${user.designation}]`"
            />
          </el-select>
          <hr>
        </el-col>
        <el-col :xs="24">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-success"
            @click="assignProjectsToConsultant()"
          >
            <feather-icon
              icon="SaveIcon"
              class="mr-50"
            />
            <span class="align-middle">Save</span>
          </b-button>
        </el-col>
      </el-row>

    </b-modal>
    <add-project
      v-if="isCreateProjectSidebarActive"
      v-model="isCreateProjectSidebarActive"
      :clients="clients"
      @save="updateTable"
    />
    <client-project-settings
      v-if="isProjectSettingSidebarActive"
      v-model="isProjectSettingSidebarActive"
      :selected-project="selected_project"
    />
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
import AddProject from './partials/AddProject.vue'
import ClientProjectSettings from './partials/ClientProjectSettings.vue'
import ClientProjectDetails from './partials/ClientProjectDetails.vue'

export default {
  components: {
    AddProject,
    ClientProjectSettings,
    ClientProjectDetails,
    BButton,
    BRow,
    BCol,
    BModal,
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
      isProjectSettingSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'assigned_staff',
        'assigned_consultant',
        'standard.name',
        // 'allow_document_uploads',
        'progress',
        // 'id',
        // 'start_date',
        // 'deadline',
        // 'date_completed',
        'is_completed',
        'action',
      ],
      options: {
        headings: {
          'standard.name': 'Project',
          allow_document_uploads: 'Can Upload Documents',
          assigned_staff: 'Assigned Personnel',
          assigned_consultant: 'Assigned Consultant',
          is_completed: 'Completion Status',
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
      staff: [],
      clientUsers: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      consultantForm: {
        projectIds: [],
        userIds: [],
      },
      form: {
        projectId: '',
        userIds: [],
      },
    }
  },
  created() {
    this.fetchClients()
    this.fetchStaff()
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
    fetchStaff() {
      const app = this
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list()
        .then(response => {
          app.staff = response.staff
        })
    },
    fetchProjects() {
      const app = this
      app.form.projectId = ''
      app.loading = true
      const fetchProjectsResource = new Resource('projects/client-projects')
      fetchProjectsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.projects = response.projects
          app.clientUsers = response.users// .data
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    showProjectSettings(project) {
      const app = this
      app.selected_project = project
      app.isProjectSettingSidebarActive = true
    },
    setupProjectPlan(project) {
      const app = this
      const params = {
        client_id: project.client_id,
        project_id: project.id,
        standard_id: project.standard_id,
      }
      // eslint-disable-next-line no-alert
      if (window.confirm(`Click OK to confirm plan setup for ${project.standard.name}`)) {
        app.loading = true
        const assignProjectsResource = new Resource('project-plans/store-client-project-plan')
        assignProjectsResource.store(params)
          .then(() => {
            app.fetchProjects()
            app.loading = false
          }).catch(() => { app.loading = false })
      }
    },
    submitProjectAssignment() {
      const app = this
      // app.showAssignModal = false
      app.loading = true
      const assignProjectsResource = new Resource('projects/assign-to-user')
      assignProjectsResource.update(app.form.projectId, { user_ids: app.form.userIds })
        .then(() => {
          app.form = {
            projectId: [],
            userIds: [],
          }
          app.fetchProjects()
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    assignProjectsToConsultant() {
      const app = this
      // app.showAssignModal = false
      app.loading = true
      const assignProjectsResource = new Resource('projects/assign-projects-to-consultant')
      assignProjectsResource.store({ project_ids: app.consultantForm.projectIds, user_ids: app.consultantForm.userIds })
        .then(() => {
          app.consultantForm = {
            projectIds: [],
            userIds: [],
          }
          app.$message('Action Successful')
          app.fetchProjects()
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    unassignProjectFromConsultants(projectId, userId) {
      const app = this
      // app.showAssignModal = false
      app.loading = true
      const unassignProjectsResource = new Resource('projects/unassign-project-from-consultant')
      unassignProjectsResource.store({ project_id: projectId, user_id: userId })
        .then(() => {
          app.$message('Action Successful')
          app.fetchProjects()
          app.loading = false
        }).catch(() => { app.loading = false })
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
      // if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
      // app.loading = true
      const setDatesResource = new Resource('projects/set-dates')
      setDatesResource.update(project.id, param)
        .then(() => {
          app.$message('Action Successful')
          // app.fetchProjects()
          // app.loading = false
        }).catch(() => { app.loading = false })
      // }
    },
    changeDocumentUploadRestriction(project, event, field) {
      const app = this
      const { value } = event.target
      const param = { value, field }
      // eslint-disable-next-line no-alert
      if (window.confirm('Click OK to confirm')) {
        // app.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource.update(project.id, param)
          .then(() => {
            app.$message('Action Successful')
            app.fetchProjects()
            // app.loading = false
          }).catch(() => { app.loading = false })
      }
    },
    toggleProjectCompletion(project, event, field) {
      const app = this
      const { value } = event.target
      const param = { value, field }
      // eslint-disable-next-line no-alert
      if (window.confirm('Click OK to confirm')) {
        // app.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource.update(project.id, param)
          .then(() => {
            app.$message('Action Successful')
            app.fetchProjects()
            // app.loading = false
          }).catch(() => { app.loading = false })
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
