<template>

  <app-collapse
    v-loading="loading"
    accordion
    type="border"
  >
    <template
      v-for="(clause, index) in clauses"
    >

      <app-collapse-item
        :key="index"
        :title="clause.name"
      >
        <div
          style="padding: 5px; border: 5px double #c0c0c0;border-radius: 8px;"
        >
          <strong>Click on the + sign to view remarks</strong>
          <v-client-table
            v-model="clause.uploads"
            v-loading="loading"
            :columns="['template_title', 'template_link', 'upload_link', 'exception']"
            :options="options"
          >
            <template
              slot="child_row"
              slot-scope="{row}"
            >
              <div>
                <div
                  v-if="row.remark !== null"
                >
                  <strong>Remark on this document: </strong>
                  <div
                    style="padding: 5px; border: 2px solid #409EFF; border-radius: 8px; margin: 5px;"
                  >

                    {{ row.remark }}
                  </div>
                </div>
                <div v-else>
                  <el-alert
                    :closable="false"
                    type="error"
                  >
                    No remark has been made
                  </el-alert>
                </div>
              </div>
            </template>
            <template
              slot="template_title"
              slot-scope="{row}"
            >
              {{ row.template_title }}
            </template>
            <template
              slot="template_link"
              slot-scope="{row}"
            >
              <div v-if="row.is_exception === 0">
                <a
                  :href="baseServerUrl+'storage/'+row.template_link"
                  target="_blank"
                >
                  <el-button
                    circle
                    type="warning"
                  >
                    <feather-icon icon="DownloadIcon" />
                  </el-button>
                </a>
              </div>
            </template>
            <template
              slot="upload_link"
              slot-scope="props"
            >
              <div v-if="!isAdmin">
                <div v-if="props.row.is_exception === 0">
                  <input
                    v-if="selectedProject.is_completed === 0"
                    type="file"
                    class="form-control"
                    @change="onImageChange($event, props.row.id, props.index, index)"
                  >
                  <br>
                  <small
                    :id="'progress_' + props.row.id"
                    style="display: none"
                  >
                    <el-progress
                      :percentage="progress"
                      :status="status"
                    />
                  </small>
                  <div v-if="props.row.link !== null">
                    <el-alert
                      :closable="false"
                      type="success"
                    >
                      Uploaded
                      <a
                        :href="baseServerUrl+'storage/'+props.row.link"
                        target="_blank"
                      >
                        <el-button
                          circle
                          type="primary"
                        >
                          <feather-icon icon="DownloadIcon" />
                        </el-button>
                      </a>
                    </el-alert>
                  </div>
                </div>
                <div v-else>
                  <el-alert
                    type="error"
                    :closable="false"
                  >
                    <strong>Not Applicable</strong>. To undo, click on the <code>EXCEPTIONS</code> tab and reverse it
                  </el-alert>
                </div>
              </div>
              <div v-else>
                <div v-if="props.row.is_exception === 0">
                  <div v-if="props.row.link !== null">
                    <el-alert
                      :closable="false"
                      type="success"
                    >
                      Uploaded
                      <a
                        :href="baseServerUrl+'storage/'+props.row.link"
                        target="_blank"
                      >
                        <el-button
                          circle
                          type="primary"
                        >
                          <feather-icon icon="DownloadIcon" />
                        </el-button>
                      </a>
                    </el-alert>
                  </div>
                </div>
                <div v-else>
                  <el-alert
                    type="error"
                    :closable="false"
                  >
                    <strong>Not Applicable</strong>
                  </el-alert>
                </div>
              </div>
            </template>
            <template
              slot="exception"
              slot-scope="props"
            >
              <el-popover
                v-if="!isAdmin && props.row.is_exception === 0 && selectedProject.is_completed === 0"
                placement="right"
                width="400"
                trigger="click"
              >
                <div>
                  <el-input
                    v-model="exceptionReason"
                    placeholder="Kindly give reasons for making this an exception"
                    type="textarea"
                  />
                  <el-button
                    :loading="loadButton"
                    size="mini"
                    type="danger"
                    :disabled="exceptionReason === ''"
                    @click="createException(clause.id, props.row.id, index, props.index)"
                  >
                    Submit
                  </el-button>
                </div>
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  round
                >
                  N/A
                </el-button>
              </el-popover>
              <el-popover
                v-if="isAdmin"
                placement="right"
                width="400"
                trigger="click"
              >
                <div>
                  <el-input
                    v-model="adminRemark"
                    placeholder="Give remark here..."
                    type="textarea"
                  />
                  <br>
                  <el-button
                    :loading="loadButton"
                    size="mini"
                    type="success"
                    :disabled="adminRemark === ''"
                    @click="saveRemark(props.row.id, index, props.index)"
                  >
                    Submit
                  </el-button>
                </div>
                <el-button
                  slot="reference"
                  size="mini"
                  type="primary"
                >
                  Give Remark
                </el-button>
              </el-popover>
            </template>
          </v-client-table>
        </div>
      </app-collapse-item>
    </template>
    <app-collapse-item title="EVIDENCE">
      <evidence
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </app-collapse-item>
  </app-collapse>
</template>
<script>
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Resource from '@/api/resource'
import Evidence from './Evidence.vue'

export default {
  components: {
    AppCollapse,
    AppCollapseItem,
    Evidence,
  },
  props: {
    selectedProject: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      options: {
        headings: {
          template_title: 'Title',
          template_link: 'Download Template',
          upload_link: 'Uploads',
          exception: '',
        },
        texts: {
          filter: 'Search:',
        },
        sortable: [],
        filterable: false,
        // filterable: [],
      },
      clauses: [],
      uploadableFile: null,
      showRemark: 0,
      loading: false,
      load: false,
      loadButton: false,
      progress: 10,
      interval: '',
      status: 'warning',
      exceptionReason: '',
      adminRemark: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClausesWithDocuments()
  },
  methods: {
    setProgress() {
      this.progress = 10
      this.interval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 10
        } else {
          clearInterval(this.interval)
          this.status = 'success'
        }
      }, 100)
    },
    showOrHideRemark(id) {
      const app = this
      if (app.showRemark === id) {
        app.showRemark = 0
      } else {
        app.showRemark = id
      }
    },
    fetchClausesWithDocuments() {
      const app = this
      app.loading = true
      const { client_id } = app.selectedProject
      const { standard_id } = app.selectedProject
      const fetchConsultingsResource = new Resource('clauses/fetch-clauses-with-documents')
      fetchConsultingsResource.list({ client_id, standard_id })
        .then(response => {
          app.clauses = response.clauses
          app.loading = false
        })
    },
    createException(clauseId, uploadId, clauseIndex, uploadIndex) {
      const app = this
      app.loadButton = true
      const param = {
        project_id: app.selectedProject.id, clause_id: clauseId, type: 'upload', upload_id: uploadId, reason: app.exceptionReason,
      }
      const createExceptionResource = new Resource('exceptions/create')
      createExceptionResource.store(param)
        .then(() => {
          app.clauses[clauseIndex].uploads[uploadIndex - 1].is_exception = 1
          app.loadButton = false
          app.exceptionReason = ''
          app.$emit('reloadAnalytics')
        })
    },
    onImageChange(e, uploadId, uploadIndex, clauseIndex) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.uploadableFile = e.target.files[0]
      // console.log(app.uploadableFile)
      app.submitUpload(uploadId, uploadIndex, clauseIndex)
    },
    submitUpload(uploadId, uploadIndex, clauseIndex) {
      const app = this
      document.getElementById(`progress_${uploadId}`).style.display = 'block'
      app.setProgress()
      const formData = new FormData()
      formData.append('file_uploaded', app.uploadableFile)
      formData.append('upload_id', uploadId)
      const updatePhotoResource = new Resource('clauses/upload-file')
      updatePhotoResource.store(formData)
        .then(response => {
          // clearInterval(this.interval)
          setTimeout(() => {
            document.getElementById(`progress_${uploadId}`).style.display = 'none'
            app.progress = 10
          }, 2000)
          app.uploadableFile = null
          app.clauses[clauseIndex].uploads[uploadIndex - 1].link = response
          // app.$message('File upload successful')
          app.$emit('reloadAnalytics')
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.message)
        })
    },
    saveRemark(uploadId, clauseIndex, uploadIndex) {
      const app = this
      app.loadButton = true
      const remark = app.adminRemark
      const param = { remark }
      const saveRemarkResource = new Resource('clauses/remark-on-upload')
      saveRemarkResource.update(uploadId, param)
        .then(() => {
          app.clauses[clauseIndex].uploads[uploadIndex - 1].remark = remark
          app.loadButton = false
          app.adminRemark = ''
        })
    },
  },

}
</script>
