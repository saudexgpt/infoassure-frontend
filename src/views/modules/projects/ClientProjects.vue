<template>
  <div v-if="showManageProject">
    <div>
      <el-row>
        <el-col :md="12">
          <span>
            <el-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              type="danger"
              size="sm"
              @click="showManageProject = false"
            >
              <icon icon="ArrowLeftIcon" class="mr-50" />
              <span class="align-middle">Back</span>
            </el-button>
          </span>
        </el-col>
        <hr />
      </el-row>
    </div>
    <client-project-details
      :selected-client="selectedClient"
      :selected-project="selected_project"
      :is-admin="true"
    />
  </div>
  <el-card v-else>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col :md="12">
            <h3>Manage Projects</h3>
          </el-col>
          <el-col :md="12">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-client project']) || checkRole(['admin'])"
                type="primary"
                @click="isCreateProjectSidebarActive = true"
              >
                <icon icon="tabler:plus" />
                <span class="align-middle">Subscribe</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>

    <div>
      <el-row :gutter="10">
        <el-col :md="6" :sm="12" :xs="24">
          <el-date-picker
            v-model="year"
            type="year"
            :picker-options="pickerOptions"
            format="YYYY"
            value-format="YYYY"
            placeholder="Pick a calendar year"
            style="width: 100%"
            @change="fetchProjects"
          />
        </el-col>
      </el-row>
      <!-- <el-button
        v-if="clientUsers.length > 0 && projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        type="outline-primary"
        @click="showAssignModal = true"
      >
        <icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To User</span>
      </el-button> -->
      <!-- <el-button
        v-if="projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        type="outline-dark"
        @click="showAssignConsultantModal = true"
      >
        <icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To Consultant</span>
      </el-button> -->
    </div>
    <br />
    <el-row v-if="loading" :gutter="15">
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
          <el-skeleton :loading="loading" :rows="3" animated />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="projects.length > 0">
      <el-row v-if="!loading" :gutter="15">
        <el-col
          v-for="(item, index) in projects"
          :key="index"
          :xs="24"
          :sm="24"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <el-card>
            <el-card-header>
              <strong>
                <h2>{{ item.title }}</h2>
              </strong>
              <span class="pull-right">
                <el-dropdown>
                  <el-button type="text">
                    <icon icon="tabler:dots-vertical" size="20" />
                  </el-button>
                  <template v-slot:dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <span @click="assignProject(item)">
                          <icon size="20" icon="tabler:user-plus" /> Assign Project
                        </span>
                      </el-dropdown-item>
                      <!-- <el-dropdown-item>
                        <span @click="showProjectSettings(item)"
                          ><icon icon="ToolIcon" /> Project Settings</span
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <span @click="setupProjectPlan(item)"
                          ><icon icon="CheckSquareIcon" /> Activate project Plan</span
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <span @click="destroyRow(item)"
                          ><icon icon="TrashIcon" /> Delete Project</span
                        >
                      </el-dropdown-item> -->
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </span>
            </el-card-header>
            <el-card-body>
              <el-button type="text" @click="manageProject(item)">
                <icon size="20" icon="tabler:folder" /> Click to Manage
              </el-button>
              <!-- <div class="justify-content-between align-items-center">
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="item.progress"
                  :color="customColorMethod"
                />
                <br />
                <el-select
                  v-model="item.is_completed"
                  @change="toggleProjectCompletion(item, $event, 'is_completed')"
                >
                  <el-option :value="0" label="In Progress" />
                  <el-option :value="1" label="Completed" />
                </el-select>
              </div> -->
            </el-card-body>
            <el-card-footer>
              <div>
                <!-- <span style="margin-right: 10px">
                  <el-tooltip content="View Project Details">
                    <el-button type="primary" circle plain @click="manageProject(item)">
                      <icon size="20" icon="tabler:folder" />
                    </el-button>
                  </el-tooltip>
                </span>
                <span style="margin-right: 10px">
                  <el-tooltip content="Assign user(s) to project">
                    <el-button type="success" circle plain @click="assignProject(item)">
                      <icon size="20" icon="tabler:user-plus" />
                    </el-button>
                  </el-tooltip>
                </span>
                <el-popover placement="right" title="Assigned User(s)" width="250" trigger="hover">
                  <div
                    style="
                      background: #f3cf58b2;
                      color: #000000;
                      padding: 5px;
                      text-align: left;
                      border-radius: 5px;
                    "
                  >
                    <span v-for="(user, staff_index) in item.users" :key="staff_index">
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
                  <template v-slot:reference>
                    <el-button type="warning" circle plain>
                      <icon size="20" icon="tabler:users" />
                    </el-button>
                  </template>
                </el-popover>-->
              </div>
            </el-card-footer>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-empty v-if="!loading" description="You have no active project">
        <el-button
          v-if="checkPermission(['create-client project']) || checkRole(['admin'])"
          type="primary"
          @click="isCreateProjectSidebarActive = true"
        >
          <icon icon="tabler:plus" />
          <span class="align-middle">Subscribe</span>
        </el-button>
      </el-empty>
    </div>

    <el-dialog
      v-model="showAssignModal"
      width="40%"
      hide-footer
      centered
      title="Fill the form to assign users to project"
    >
      <el-row v-loading="loading" :gutter="20">
        <el-col :xs="24">
          <el-select
            v-model="form.projectId"
            placeholder="Select Project"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project.id"
              :label="project.title"
            >
              <span style="float: left">{{ project.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                project.available_module ? project.available_module.name : ''
              }}</span>
            </el-option>
          </el-select>
          <br />
        </el-col>
        <el-col :xs="24">
          <small>Select User (Multiple selection enabled)</small>
          <el-select
            v-model="form.userIds"
            placeholder="Select Users"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(user, user_index) in clientUsers"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            />
          </el-select>
        </el-col>
        <el-col :md="12">
          <el-button type="primary" @click="submitProjectAssignment()">
            <icon icon="fa-save" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
        <el-col :md="12">
          <el-button type="text" @click="showUserRegistrationForm = true">
            Click here to create new user
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      v-model="showAssignConsultantModal"
      hide-footer
      centered
      title="Fill the form to assign projects to consultants"
    >
      <el-row v-loading="loading" :gutter="20">
        <el-col :xs="24">
          <el-select
            v-model="consultantForm.projectIds"
            placeholder="Select Projects"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project.id"
              :label="project.title"
            >
              <span style="float: left">{{ project.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                project.available_module ? project.available_module.name : ''
              }}</span>
            </el-option>
          </el-select>
          <br />
          <br />
        </el-col>
        <el-col :xs="24">
          <el-select
            v-model="consultantForm.userIds"
            placeholder="Select Consultants"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(user, user_index) in staff"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            >
              <span style="float: left">{{ user.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                user.designation ? user.designation : ''
              }}</span>
            </el-option>
          </el-select>
          <hr />
        </el-col>
        <el-col :xs="24">
          <el-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            type="primary"
            @click="assignProjectsToConsultant()"
          >
            <icon icon="tabler:edit" class="mr-50" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      v-model="showUserRegistrationForm"
      hide-footer
      centered
      size="lg"
      title="Register New User"
    >
      <user-registration-form @saved="(fetchProjects(false), (showUserRegistrationForm = false))" />
    </el-dialog>
    <el-drawer
      title=""
      v-model="isCreateProjectSidebarActive"
      direction="ttb"
      size="100%"
      :destroy-on-close="true"
      :before-close="reloadPage"
    >
      <template v-slot:title>
        <h2>Subscribe from the list of packages</h2>
      </template>

      <add-project :clients="clients" @save="updateTable" />
    </el-drawer>
    <el-dialog
      v-model="isProjectSettingSidebarActive"
      hide-footer
      centered
      size="lg"
      title="Project Settings"
    >
      <client-project-settings
        v-if="isProjectSettingSidebarActive"
        v-model="isProjectSettingSidebarActive"
        :selected-project="selected_project"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import AddProject from './partials/AddProject.vue'
import ClientProjectSettings from './partials/ClientProjectSettings.vue'
import ClientProjectDetails from './partials/ClientProjectDetails.vue'
import UserRegistrationForm from '@/views/modules/user/partials/RegisterUserClient.vue'

export default {
  components: {
    // BDropdown,
    // BDropdownItem,
    AddProject,
    ClientProjectSettings,
    ClientProjectDetails,
    UserRegistrationForm
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      loading: false,
      isCreateProjectSidebarActive: false,
      isProjectSettingSidebarActive: false,
      showUserRegistrationForm: false,
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
        'action'
      ],
      options: {
        headings: {
          title: 'Project',
          'available_module.name': 'Module',
          'standard.name': 'Standard',
          allow_document_uploads: 'Can Upload Documents',
          assigned_staff: 'Assigned User',
          assigned_consultant: 'Assigned Consultant',
          is_completed: 'Completion Status'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['title'],
        // filterable: false,
        filterable: ['title']
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
        userIds: []
      },
      form: {
        projectId: '',
        userIds: []
      },
      year: null
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchProjects()
      this.fetchStaff()
    }
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
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    fetchProjects(load = true) {
      this.form.projectId = ''
      this.loading = load
      const fetchProjectsResource = new Resource('projects/client-projects')
      fetchProjectsResource
        .list({ client_id: this.selectedClient.id, year: this.year })
        .then((response) => {
          this.projects = response.projects
          this.clientUsers = response.users // .data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    showProjectSettings(project) {
      this.selected_project = project
      this.isProjectSettingSidebarActive = true
    },
    setupProjectPlan(project) {
      const params = {
        client_id: project.client_id,
        project_id: project.id,
        standard_id: project.standard_id
      }

      if (window.confirm(`Click OK to confirm plan setup for ${project.standard.name}`)) {
        this.loading = true
        const assignProjectsResource = new Resource('project-plans/store-client-project-plan')
        assignProjectsResource
          .store(params)
          .then(() => {
            this.fetchProjects()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    assignProject(project) {
      this.selected_project = project
      this.form.projectId = project.id
      this.showAssignModal = true
    },
    submitProjectAssignment() {
      // this.showAssignModal = false
      this.loading = true
      const assignProjectsResource = new Resource('projects/assign-to-user')
      assignProjectsResource
        .update(this.form.projectId, { user_ids: this.form.userIds })
        .then(() => {
          this.form = {
            projectId: [],
            userIds: []
          }
          this.$message('Action Successful')
          this.fetchProjects()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    unassignUserFromProject(project, user) {
      this.$confirm(
        `This will disengage ${user.name} from the ${project.title} project. Continue?`,
        `Disengage ${user.name}?`,
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const unassignProjectsResource = new Resource('projects/unassign-user-from-project')
          unassignProjectsResource
            .update(project.id, { user_id: user.id })
            .then(() => {
              this.$message('Action Successful')
              this.fetchProjects()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Action canceled',
          // })
        })
      // this.showAssignModal = false
    },
    assignProjectsToConsultant() {
      // this.showAssignModal = false
      this.loading = true
      const assignProjectsResource = new Resource('projects/assign-projects-to-consultant')
      assignProjectsResource
        .store({
          project_ids: this.consultantForm.projectIds,
          user_ids: this.consultantForm.userIds
        })
        .then(() => {
          this.consultantForm = {
            projectIds: [],
            userIds: []
          }
          this.$message('Action Successful')
          this.fetchProjects()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    unassignProjectFromConsultants(projectId, userId) {
      // this.showAssignModal = false
      this.loading = true
      const unassignProjectsResource = new Resource('projects/unassign-project-from-consultant')
      unassignProjectsResource
        .store({ project_id: projectId, user_id: userId })
        .then(() => {
          this.$message('Action Successful')
          this.fetchProjects()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateTable() {
      this.fetchProjects()
      this.handleClose()
    },
    reloadPage() {
      this.$router.go(0)
    },
    manageProject(selectedRow) {
      // console.log(props)

      this.$router.push({ path: `/modules/${selectedRow.available_module.slug}-index` })

      // const editableRow = selected_row;
      // this.selected_project = selectedRow
      // this.showManageProject = true
    },
    setDate(event, project, field) {
      const param = { field, date: event }

      // if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
      // this.loading = true
      const setDatesResource = new Resource('projects/set-dates')
      setDatesResource
        .update(project.id, param)
        .then(() => {
          this.$message('Action Successful')
          // this.fetchProjects()
          // this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // }
    },
    changeDocumentUploadRestriction(project, event, field) {
      const { value } = event.target
      const param = { value, field }

      if (window.confirm('Click OK to confirm')) {
        // this.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource
          .update(project.id, param)
          .then(() => {
            this.$message('Action Successful')
            this.fetchProjects()
            // this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    toggleProjectCompletion(project, value, field) {
      // const { value } = event.target
      const param = { value, field }

      if (window.confirm('Click OK to confirm')) {
        // this.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource
          .update(project.id, param)
          .then(() => {
            this.$message('Action Successful')
            this.fetchProjects()
            // this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('projects/destroy')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchProjects()
          this.loading = false
        })
      }
    }
  }
}
</script>
