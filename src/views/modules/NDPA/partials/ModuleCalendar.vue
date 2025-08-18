<template>
  <el-tabs type="border-card" stretch>
    <el-tab-pane v-for="(clauses, index) in clause_tasks" :key="index" :label="index">
      <el-container style="height: 100%">
        <el-aside
          v-loading="loading"
          element-loading-text="loading resources, please wait..."
          width="350px"
        >
          <div style="max-height: 400px; overflow: auto">
            <h3>Controls</h3>
            <el-collapse expand-icon-position="left">
              <el-collapse-item v-for="(clause, clause_index) in clauses" :key="clause_index">
                <template #title>
                  <strong>{{ clause.name }}</strong> {{ clause.description }}
                </template>
                <div>
                  <el-card
                    v-for="(activity, activity_index) in clause.activities"
                    :key="activity_index"
                    :id="`activity-${index}-${activity_index}`"
                    @click="viewDetails(activity, `activity-${index}-${activity_index}`)"
                    style="cursor: pointer; margin-bottom: 5px"
                    shadow="hover"
                  >
                    <strong>Process {{ activity.activity_no }}</strong>
                    <!-- <strong>{{ `TASK ${activity.activity_no}-${task.id}` }}</strong> -->
                    <div>
                      <em><icon icon="tabler:arrow-badge-right" /> {{ activity.name }}</em>
                      <br />
                      <span v-html="activity.description"></span>
                    </div>
                  </el-card>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-aside>

        <el-container>
          <el-main v-loading="loadView" element-loading-text="loading data, please wait...">
            <div v-if="viewType === 'edit'">
              <AssignTaskTable :tasks="selectedData.tasks" @update:tasks="updateTask" />
            </div>
            <div v-if="viewType === 'welcome'" align="center">
              <icon icon="tabler:calendar-time" size="200" />
              <h3>View and assign tasks to team members here</h3>
              <p>Click on any activity under any control</p>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Resource from '@/api/resource'
import AssignTaskTable from './AssignTaskTable.vue'

export default {
  components: {
    AssignTaskTable
  },
  props: {},
  data() {
    return {
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
      selectedActivity: null
    }
  },
  computed: {},
  mounted() {
    this.fetchTaskByClause()
  },
  methods: {
    updateTask(task) {
      this.selectedData.tasks = task
    },
    fetchTaskByClause(load = true) {
      this.showCreateActivityModal = false
      this.showCreateTaskModal = false
      this.loading = load
      const fetchResource = new Resource('isms/calendar/fetch-client-assigned-tasks')
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
    viewDetails(data, viewId) {
      if (data.id) {
        this.loadView = true
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
          this.loadView = false
        }, 1000)

        this.changeActiveTabBgColor(viewId)
      }
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('el-card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      if (divs.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.background = '#ffffff'
          divs[i].style.color = '#000000'
        }
      }
      document.getElementById(viewId).style.background = '#000000'
      document.getElementById(viewId).style.color = '#ffffff'
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
