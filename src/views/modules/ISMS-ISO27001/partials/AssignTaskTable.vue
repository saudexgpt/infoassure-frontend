<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Task</th>
          <th>Assignee</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Assign</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            {{ task.name }}
            <p v-if="task.hint" class="text-muted">
              <small>
                <em>Hint: {{ task.hint }}</em>
              </small>
            </p>
          </td>
          <td>{{ task.assigned_task ? task.assigned_task.assignee.name : null }}</td>
          <td>{{ task.assigned_task ? task.assigned_task.start_date : null }}</td>
          <td>{{ task.assigned_task ? task.assigned_task.end_date : null }}</td>
          <td>{{ task.assigned_task ? task.assigned_task.status : 'pending' }}</td>
          <td>
            <el-tooltip content="Assign Task to a personnel" placement="top">
              <el-button type="primary" @click="setDetails(task, index)">
                <icon icon="tabler:users" /> Assign
              </el-button>
            </el-tooltip>
          </td>
          <td>
            <div v-if="task.assigned_task">
              <span v-if="task.assigned_task.status === 'completed'"> Completed </span>
              <span v-else>
                <el-tooltip content="Mark task as completed" placement="top">
                  <el-button
                    v-if="task.assigned_task.progress === 1"
                    type="success"
                    @click="markTaskAsDone(task.assigned_task.id, index)"
                  >
                    <icon icon="tabler:check" /> Completed
                  </el-button>
                </el-tooltip>
              </span>
            </div>
          </td>
        </tr>
        <tr v-if="tasks.length === 0">
          <td colspan="7"><h4 align="center">No tasks available</h4></td>
        </tr>
      </tbody>
    </table>
    <el-dialog v-model="showAssignModal" hide-footer centered title="Assign Task">
      <el-row v-loading="loading" :gutter="20">
        <el-col :md="24">
          <label for="">Select Assignee</label>
          <el-select
            v-model="assignForm.assignee_id"
            placeholder="Select Assignee"
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
        <el-col :md="24">
          <label for="">Set Start Date</label>
          <el-date-picker
            v-model="assignForm.start_date"
            type="date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :md="24">
          <label for="">Set End Date</label>
          <el-date-picker
            v-model="assignForm.end_date"
            type="date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
            @change="fetchProjects"
          />
        </el-col>
        <el-col :md="24">
          <el-button :loading="loader" type="primary" @click="assignTask()">
            <span class="align-middle">Assign</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      assignForm: {
        module_activity_task_id: '',
        assignee_id: '',
        start_date: '',
        end_date: ''
      },
      empty_form: {
        module_activity_task_id: '',
        assignee_id: '',
        start_date: '',
        end_date: ''
      },
      loader: false,
      details: [],
      showAssignModal: false,
      selectedindex: null,
      loadTasks: false,
      staff: []
    }
  },
  mounted() {
    this.fetchStaff()
  },
  methods: {
    disabledDate(time) {
      return time.getTime() <= Date.now() - 8.64e7 // Disable past dates
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    setDetails(task, index) {
      this.assignForm.module_activity_task_id = task.id
      this.assignForm.assignee_id = task.assigned_task ? task.assigned_task.assignee_id : null
      this.assignForm.start_date = task.assigned_task ? task.assigned_task.start_date : null
      this.assignForm.end_date = task.assigned_task ? task.assigned_task.end_date : null
      this.selectedindex = index
      this.showAssignModal = true
    },
    assignTask() {
      const createTaskResource = new Resource('isms/calendar/assign-task-to-user')
      const { assignForm } = this
      this.loader = true
      createTaskResource
        .store(assignForm)
        .then((response) => {
          this.assignForm = this.empty_form
          // Create a local copy and update, then emit to parent
          const updatedTasks = [...this.tasks]
          updatedTasks[this.selectedindex] = {
            ...updatedTasks[this.selectedindex],
            assigned_task: response.assigned_task
          }
          this.$emit('update:tasks', updatedTasks)
          this.showAssignModal = false
          this.loader = false

          this.$message('Task Assigned Successfully')
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    },
    markTaskAsDone(taskId, index) {
      if (confirm('Click OK to mark this task as completed?')) {
        this.loader = true
        const fetchResource = new Resource('isms/calendar/mark-task-as-completed')
        fetchResource
          .update(taskId)
          .then((response) => {
            this.$message.success('Task marked as completed successfully')
            this.loader = false
            const updatedTasks = [...this.tasks]
            updatedTasks[index] = {
              ...updatedTasks[index],
              assigned_task: response.task
            }
            this.$emit('update:tasks', updatedTasks)
            this.fetchProjectCalendarData() // Refresh the calendar data after marking as done
          })
          .catch(() => {
            console.error('Failed to mark task as done')
          })
      }
      // Logic to mark the task as done
    }
  }
}
</script>
