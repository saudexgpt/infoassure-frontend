<template>
  <div v-if="showManageProject">
    <div slot="header">
      <b-row>
        <!-- <b-col
          cols="6"
        >
          <h4>Manage {{ selected_project.title }} for {{ selectedClient.name }}</h4>
        </b-col> -->
        <b-col
          cols="6"
        >
          <span>
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
          <h4>Manage Projects</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-client project']) || checkRole(['admin'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateProjectSidebarActive = true"
            >
              <feather-icon
                icon="PlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Subscribe</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>

    <div>
      <el-row :gutter="10">
        <el-col
          :md="12"
          :sm="24"
          :xs="24"
        >

          <el-date-picker
            v-model="year"
            type="year"
            :picker-options="pickerOptions"
            format="yyyy"
            value-format="yyyy"
            placeholder="Pick a calendar year"
            style="width: 100%"
            @input="fetchProjects"
          />
        </el-col>
      </el-row>
      <!-- <b-button
        v-if="clientUsers.length > 0 && projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
        @click="showAssignModal = true"
      >
        <feather-icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To Personnel</span>
      </b-button> -->
      <!-- <b-button
        v-if="projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-dark"
        @click="showAssignConsultantModal = true"
      >
        <feather-icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To Consultant</span>
      </b-button> -->
    </div>
    <br>
    <el-row
      v-if="loading"
      :gutter="15"
    >
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card>
          <el-skeleton
            :loading="loading"
            :rows="3"
            animated
          />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="projects.length > 0">
      <el-row
        v-if="!loading"
        :gutter="15"
      >
        <el-col
          v-for="(item, index) in projects"
          :key="index"
          :xs="24"
          :sm="24"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <b-card
            style="border-top-left-radius: 1rem; border-bottom-right-radius: 1rem"
          >
            <b-card-header>
              <strong>
                <h3>{{ item.title }}</h3>
              </strong>
              <span class="pull-right">
                <el-dropdown>
                  <b-button
                    variant="flat"
                    class="btn-icon rounded-circle"
                  >
                    <feather-icon
                      icon="MoreVerticalIcon"
                      size="20"
                    />
                  </b-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <span @click="assignProject(item)"><feather-icon icon="UserCheckIcon" /> Assign Project</span>
                    </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <span @click="showProjectSettings(item)"><feather-icon icon="ToolIcon" /> Project Settings</span>

                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="setupProjectPlan(item)"><feather-icon icon="CheckSquareIcon" /> Activate project Plan</span>

                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="destroyRow(item)"><feather-icon icon="TrashIcon" /> Delete Project</span>

                  </el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </b-card-header>
            <b-card-body class="d-flex justify-content-between align-items-center">
              <select
                v-model="item.is_completed"
                @input="toggleProjectCompletion(item, $event, 'is_completed')"
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
              <div>
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="item.progress"
                  :color="customColorMethod"
                />
              </div>
            </b-card-body>
            <b-card-footer>
              <el-button
                type="text"
                @click="manageProject(item)"
              >
                <feather-icon icon="EyeIcon" /> View Project Details

              </el-button>
              <el-popover
                placement="right"
                title="Assigned Personnel(s)"
                width="250"
                trigger="hover"
              >
                <div style="background: #f3cf58b2; color: #000000; padding: 5px; text-align: left; border-radius: 5px;">
                  <span
                    v-for="(user, staff_index) in item.users"
                    :key="staff_index"
                  >
                    <el-tag
                      type="info"
                      effect="plain"
                      closable
                      style="cursor: pointer"
                      @close="unassignUserFromProject(item, user)"
                      @click="unassignUserFromProject(item, user)"
                    >
                      {{ user.name }}
                    </el-tag>
                  </span>
                </div>
                <el-button
                  slot="reference"
                  type="text"
                >
                  <feather-icon icon="UsersIcon" />
                  View Assignee(s)
                </el-button>
              </el-popover>
            </b-card-footer>
          </b-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-empty
        v-if="!loading"
        description="You have no active project"
      >
        <b-button
          v-if="checkPermission(['create-client project']) || checkRole(['admin'])"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="gradient-primary"
          @click="isCreateProjectSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Subscribe</span>
        </b-button>
      </el-empty>
    </div>

    <!-- <v-client-table
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
        <el-tag
          v-for="(user, staff_index) in row.users"
          :key="staff_index"
          type="info"
          effect="plain"
          closable
          @close="unassignUserFromProject(row, user)"
          @click="unassignUserFromProject(row, user)"
        >
          {{ user.name }}
        </el-tag>
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
        <b-dropdown
          text="Action"
          class="m-2"
        >
          <b-dropdown-item @click="assignProject(props.row)">
            <feather-icon icon="UserCheckIcon" /> Assign Project
          </b-dropdown-item>
          <b-dropdown-item @click="manageProject(props.row)">
            <feather-icon icon="EyeIcon" /> View Project Details
          </b-dropdown-item>
          <b-dropdown-item @click="showProjectSettings(props.row)">
            <feather-icon icon="ToolIcon" /> Project Settings
          </b-dropdown-item>
          <b-dropdown-item @click="setupProjectPlan(props.row)">
            <feather-icon icon="CheckSquareIcon" /> Activate project Plan
          </b-dropdown-item>
          <b-dropdown-item @click="destroyRow(props.row)">
            <feather-icon icon="TrashIcon" /> Delete Project
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </v-client-table> -->
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
              :label="project.title"
            >
              <span style="float: left">{{ project.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ (project.available_module) ? project.available_module.name : '' }}</span>
            </el-option>
          </el-select>
          <br>
          <br>
        </el-col>
        <el-col :xs="24">
          <el-select
            v-model="form.userIds"
            placeholder="Select Personnels"
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
            variant="gradient-primary"
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
              :label="project.title"
            >
              <span style="float: left">{{ project.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ (project.available_module) ? project.available_module.name : '' }}</span>
            </el-option>
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
              :label="user.name"
            >
              <span style="float: left">{{ user.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ (user.designation) ? user.designation : '' }}</span>
            </el-option>
          </el-select>
          <hr>
        </el-col>
        <el-col :xs="24">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-primary"
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
    <el-drawer
      title=""
      :visible.sync="isCreateProjectSidebarActive"
      direction="ttb"
      size="100%"
      :destroy-on-close="true"
      :before-close="updateTable"
    >
      <template slot="title">
        <h2>Subscribe from the list of packages</h2>
      </template>

      <add-project
        :clients="clients"
        @save="updateTable"
      />
    </el-drawer>
    <client-project-settings
      v-if="isProjectSettingSidebarActive"
      v-model="isProjectSettingSidebarActive"
      :selected-project="selected_project"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol, BModal, BCard, BCardFooter, BCardBody, BCardHeader,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import AddProject from './partials/AddProject.vue'
import ClientProjectSettings from './partials/ClientProjectSettings.vue'
import ClientProjectDetails from './partials/ClientProjectDetails.vue'

export default {
  components: {
    // BDropdown,
    // BDropdownItem,
    AddProject,
    ClientProjectSettings,
    ClientProjectDetails,
    BButton,
    BRow,
    BCol,
    BModal,
    BCard,
    BCardFooter,
    BCardBody,
    BCardHeader,
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
        // 'assigned_consultant',
        'title',
        // 'available_module.name',
        // 'standard.name',
        // 'allow_document_uploads',
        'progress',
        // 'id',
        // 'start_date',
        // 'deadline',
        // 'date_completed',
        'is_completed',
        'assigned_staff',
        'action',
      ],
      options: {
        headings: {
          title: 'Project',
          'available_module.name': 'Module',
          'standard.name': 'Standard',
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
          'title',
        ],
        // filterable: false,
        filterable: [
          'title',
        ],
      },
      projects: [],
      clients: [],
      staff: [],
      clientUsers: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
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
      year: null,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    selectedClient() {
      this.fetchProjects()
      this.fetchStaff()
    },
  },
  created() {
    this.fetchStaff()
    this.fetchProjects()
  },
  methods: {
    checkPermission,
    checkRole,
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
    handleClose() {
      this.isCreateProjectSidebarActive = false
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
      console.log(app.year)
      const fetchProjectsResource = new Resource('projects/client-projects')
      fetchProjectsResource.list({ client_id: app.selectedClient.id, year: app.year })
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
    assignProject(project) {
      const app = this
      app.selected_project = project
      app.form.projectId = project.id
      app.showAssignModal = true
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
          app.$message('Action Successful')
          app.fetchProjects()
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    unassignUserFromProject(project, user) {
      const app = this
      this.$confirm(`This will disengage ${user.name} from the ${project.title} project. Continue?`, `Disengage ${user.name}?`, {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const unassignProjectsResource = new Resource('projects/unassign-user-from-project')
        unassignProjectsResource.update(project.id, { user_id: user.id })
          .then(() => {
            app.$message('Action Successful')
            app.fetchProjects()
            app.loading = false
          }).catch(() => { app.loading = false })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Action canceled',
        // })
      })
      // app.showAssignModal = false
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
      app.handleClose()
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
