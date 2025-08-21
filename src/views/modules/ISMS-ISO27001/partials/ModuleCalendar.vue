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
            <el-collapse expand-icon-position="left">
              <el-collapse-item v-for="(clause, clause_index) in clauses" :key="clause_index">
                <template #title>
                  <strong>{{ clause.name }}</strong> {{ clause.description }}
                </template>
                <div v-for="(activity, activity_index) in clause.activities" :key="activity_index">
                  <CardNavView
                    :id="`activity-${index}-${activity_index}`"
                    :title="`Process ${activity.activity_no}`"
                    @clickToView="viewDetails(activity)"
                  >
                    <template #description>
                      <div>
                        <em><icon icon="tabler:arrow-badge-right" /> {{ activity.name }}</em>
                        <br />
                        <span v-html="activity.description"></span>
                      </div>
                    </template>
                  </CardNavView>
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
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    AssignTaskTable,
    CardNavView
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
    viewDetails(data) {
      if (data.id) {
        this.loadView = true
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
          this.loadView = false
        }, 1000)
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
