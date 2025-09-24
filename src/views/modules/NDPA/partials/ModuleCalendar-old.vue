<template>
  <el-container style="height: 100%">
    <el-aside
      v-loading="loading"
      element-loading-text="loading resources, please wait..."
      width="400px"
    >
      <div style="max-height: 800px; overflow: auto">
        <h3 style="font-weight: 100">Tasks by Parts & Sections</h3>
        <el-collapse>
          <el-collapse-item v-for="(clause, index) in clause_tasks" :key="index" :name="`${index}`">
            <template #title>
              <h3>{{ clause.name }}</h3>
            </template>
            <el-collapse expand-icon-position="left">
              <el-alert type="primary" :closable="false">
                <em>{{ clause.description }}</em>
              </el-alert>
              <el-collapse-item
                v-for="(section, section_index) in clause.sections"
                :key="section_index"
              >
                <template #title>
                  <strong>
                    <strong>{{ section.name }}</strong>
                  </strong>
                </template>
                <el-alert type="info" :closable="false">
                  <em>{{ section.description }}</em>
                </el-alert>
                <!-- <v-btn color="error" block @click="createTask(section)">
                      <icon icon="tabler:plus" />&nbsp;New Task
                    </v-btn>
                    <br /> -->
                <div v-for="(task, task_index) in section.tasks" :key="task_index">
                  <CardNavView
                    :id="`task-${index}-${section_index}-${task_index}`"
                    :title="task.name"
                    title-icon="tabler:arrow-badge-right"
                    @click="viewDetails(task)"
                  >
                    <!-- <template #description>
                          <div>
                            <span v-html="task.description"></span>
                          </div>
                        </template> -->
                  </CardNavView>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-aside>

    <el-container>
      <el-main v-loading="loadView" element-loading-text="loading data, please wait...">
        <div v-if="viewType === 'edit'">
          <AssignTaskTable
            :selected-data="selectedData"
            :selected-module="selectedModule"
            :staff="staff"
            role="admin"
            @update:tasks="updateTask"
          />
        </div>
        <div v-if="viewType === 'welcome'" align="center">
          <icon icon="tabler:calendar-time" size="200" />
          <h3>View and assign tasks to team members here</h3>
          <p>Click on any activity under any control</p>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Resource from '@/api/resource'
import AssignTaskTable from '@/views/modules/ModuleSetup/Calendar/partials/AssignTaskTable.vue'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    AssignTaskTable,
    CardNavView
  },
  props: {},
  data() {
    return {
      selectedModule: 'ndpa',
      showCreateActivityModal: false,
      showCreateTaskModal: false,
      showMenu: true,
      asset_types: [],
      clause_tasks: [],
      selectedData: null,
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      isCreateNew: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      risk_assessments: [],
      loadView: false,
      viewType: 'welcome',
      response: {},
      activatedModules: [],
      selectedActivity: null,
      staff: []
    }
  },
  computed: {},
  mounted() {
    this.fetchTaskByClause()
    this.fetchStaff()
  },
  methods: {
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    updateTask(task) {
      this.selectedData.assigned_task = task
    },
    fetchTaskByClause(load = true) {
      this.showCreateActivityModal = false
      this.showCreateTaskModal = false
      this.loading = load
      const fetchResource = new Resource('ndpa/calendar/fetch-client-assigned-tasks')
      fetchResource
        .list()
        .then((response) => {
          this.clause_tasks = response.clause_tasks
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    viewDetails(data) {
      if (data.id) {
        this.loadView = true
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
          this.loadView = false
        }, 100)
      }
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
