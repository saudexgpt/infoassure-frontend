<template>
  <div v-if="data !== null">
    <div>
      <el-row :gutter="20">
        <el-col :md="16">
          <h3>Process {{ `${data.activity_no} - ${data.name}` }}</h3>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>Sub Tasks</td>
                <td>
                  <ul>
                    <li v-for="(task, index) in data.tasks" :key="index">
                      {{ task }}
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Implementation Guide</td>
                <td>
                  <span v-html="data.description"></span>
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <span v-html="data.implementation_guide"></span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="data.assigned_task !== null">
            <AssignedTaskNotes :task="data.assigned_task" />
          </div>
          <div v-if="data.assigned_task !== null" v-loading="loadingUploads">
            <h3 v-if="uploads.length > 0">Expected Documents/Evidences</h3>
            <el-card v-for="(upload, index) in uploads" :key="index" class="mb-1">
              <div>
                <div class="pull-right">
                  <el-button-group>
                    <el-button
                      v-if="upload.template_link !== null || upload.link !== null"
                      type="text"
                      size="small"
                      @click="setView(upload)"
                    >
                      <icon icon="tabler:edit" /> Edit
                    </el-button>
                    <el-button v-else type="text" size="small" @click="uploadDocument()">
                      <icon icon="tabler:upload" /> Upload
                    </el-button>
                    <!-- <el-button v-if="upload.link !== null" type="text" size="small">
                      <icon icon="tabler:download" /> Download
                    </el-button> -->
                  </el-button-group>
                  <icon v-if="upload.link !== null" icon="tabler:check" color="green" />
                  <icon v-else icon="tabler:alert-circle" color="red" />
                </div>
                <div>
                  <strong><icon icon="tabler:file-description" /> {{ upload.title }}</strong>
                  <br />
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :md="8">
          <div v-if="data.assigned_task">
            <el-alert type="success" :closable="false">
              {{ data.assigned_task.status.toUpperCase() }}
            </el-alert>
          </div>
          <br />
          <el-button-group>
            <el-tooltip
              :content="data.assigned_task === null ? 'Assign Task' : 'Reassign Task'"
              placement="top"
            >
              <el-button v-if="role === 'admin'" type="default" @click="setDetails(data)">
                <icon icon="tabler:users" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Mark task as completed" placement="top">
              <el-button
                type="success"
                :disabled="data.assigned_task === null"
                @click="markTaskAsDone(data.assigned_task.id)"
              >
                <icon icon="tabler:check" />
              </el-button>
            </el-tooltip>
          </el-button-group>
          <hr />
          <p>
            <strong> Assignee: </strong>
            <span>
              {{ data.assigned_task ? data.assigned_task.assignee.name : 'Not assigned' }}
            </span>
          </p>
          <p>
            <strong>Start Date: </strong>
            <span>
              {{ data.assigned_task ? data.assigned_task.start_date : 'Not stated' }}
            </span>
          </p>
          <p>
            <strong>Due Date: </strong>
            <span>
              {{ data.assigned_task ? data.assigned_task.end_date : 'Not stated' }}
            </span>
          </p>

          <hr />

          <div style="background: #fcfcfc; padding: 5px">
            <TaskComments :task="data.assigned_task" />
          </div>
        </el-col>
      </el-row>
    </div>
    <el-drawer
      v-if="showEditor"
      v-model="showEditor"
      direction="rtl"
      :title="`${selectedDocument.title}`"
      size="87%"
      :close-on-click-modal="false"
      destroy-on-close
      :before-close="loadTask"
    >
      <div>
        <vue-document-editor
          v-if="showDocumentEditor === 'word'"
          :document-data="selectedDocument"
          @refresh="fetchDocumentTemplates(false)"
        />
        <vue-spreadsheet-editor
          v-if="showDocumentEditor === 'spreadsheet'"
          :document-data="selectedDocument"
          @refresh="fetchDocumentTemplates(false)"
        />
      </div>
    </el-drawer>
    <el-dialog
      v-if="showAssignModal"
      v-model="showAssignModal"
      hide-footer
      centered
      title="Assign Task"
    >
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
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditorForClients.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditorForClients.vue'
import TaskComments from './TaskComments.vue'
import AssignedTaskNotes from './AssignedTaskNotes.vue'

export default {
  components: {
    VueDocumentEditor,
    VueSpreadsheetEditor,
    TaskComments,
    AssignedTaskNotes
  },
  props: {
    selectedData: {
      type: Object,
      default: () => null
    },
    staff: {
      type: Array,
      default: () => []
    },
    role: {
      type: String,
      default: () => 'client'
    }
  },
  data() {
    return {
      data: null,
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
      loadingUploads: false,
      uploads: [],
      showEditor: false,
      selectedDocument: {
        title: ''
      },
      showDocumentEditor: '',
      type: '',
      form: {
        title: ''
      },
      docSrc: ''
    }
  },
  mounted() {
    this.data = this.selectedData
    this.fetchUploadedEvidiences()
    this.loadTask()
  },
  methods: {
    disabledDate(time) {
      return time.getTime() <= Date.now() - 8.64e7 // Disable past dates
    },
    loadTask() {
      this.showEditor = false
      const evidenceResource = new Resource('isms/calendar/show-task')
      evidenceResource
        .get(this.selectedData.id)
        .then((response) => {
          this.data = response.task
          this.$emit('update:tasks', response.task.assigned_task)
          // send mail
        })
        .catch((error) => {
          console.log(error.response.data.message)
        })
    },
    uploadDocument() {},
    setView(template) {
      this.showEditor = false
      this.selectedDocument = {
        title: ''
      }
      this.showDocumentEditor = ''
      this.docSrc = ''
      this.type = '' // this returns the file extension

      setTimeout(() => {
        this.selectedDocument = template
        this.type = template.template_link.split('.').pop()
        this.docSrc = template.link
        this.showEditor = true
        if (this.type === 'pdf') {
          document.getElementById(this.type).style.display = 'block'
        } else if (this.type === 'doc' || this.type === 'docx') {
          this.showDocumentEditor = 'word'
        } else if (this.type === 'csv' || this.type === 'xlsx' || this.type === 'xls') {
          this.showDocumentEditor = 'spreadsheet'
          // document.getElementById(`${this.type}-download`).click()
        } else {
          this.showDocumentEditor = 'none'
        }
      }, 10)
    },
    setDetails(task) {
      this.assignForm.module_activity_task_id = task.id
      this.assignForm.assignee_id = task.assigned_task ? task.assigned_task.assignee_id : null
      this.assignForm.start_date = task.assigned_task ? task.assigned_task.start_date : null
      this.assignForm.end_date = task.assigned_task ? task.assigned_task.end_date : null
      this.showAssignModal = true
    },
    fetchUploadedEvidiences() {
      if (this.data.document_template_ids !== null) {
        this.loadingUploads = true
        const evidenceResource = new Resource('uploads/fetch-uploaded-document-with-template-ids')
        evidenceResource
          .store({ template_ids: this.data.document_template_ids })
          .then((response) => {
            this.loadingUploads = false
            this.uploads = response.uploads
            // send mail
          })
          .catch((error) => {
            console.log(error.response.data.message)
            this.loadingUploads = false
          })
      }
    },
    assignTask() {
      const createTaskResource = new Resource('isms/calendar/assign-task-to-user')
      const { assignForm } = this
      this.loader = true
      createTaskResource
        .store(assignForm)
        .then((response) => {
          this.assignForm = this.empty_form
          this.fetchUploadedEvidiences()
          this.$emit('update:tasks', response.assigned_task)
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
            this.loadTask()
            this.loader = false
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
