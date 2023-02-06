<template>
  <v-client-table
    v-model="evidences"
    v-loading="loading"
    :columns="['title', 'details', 'link'/*, 'remark'*/]"
    :options="options"
  >
    <!-- <template
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
      </template> -->
    <template
      slot="details"
      slot-scope="props"
    >
      <div v-if="props.row.sub_document_titles !== null">
        Upload must include the following:
        <ol>
          <li
            v-for="(sub_document_title, title_index) in splitStringToArray(props.row.sub_document_titles)"
            :key="title_index"
          >
            {{ sub_document_title }}
          </li>
        </ol>
      </div>
    </template>
    <template
      slot="link"
      slot-scope="props"
    >
      <div v-if="!isAdmin">
        <div>
          <div v-if="props.row.upload_type === 'multiple'">
            <input
              v-if="selectedProject.is_completed === 0"
              type="file"
              class="form-control"
              multiple
              @change="onImageChangeMultiple($event, props.row.id, props.index)"
            >
            <small>Multiple file uploads enabled</small>
          </div>
          <div v-else>
            <input
              v-if="selectedProject.is_completed === 0"
              type="file"
              class="form-control"
              @change="onImageChange($event, props.row.id, props.index)"
            >
          </div>
          <br>
          <small
            :id="'load_progress_' + props.row.id"
            style="display: none"
          >
            <el-progress
              :percentage="progress"
              :status="status"
            />
          </small>
          <div v-if="props.row.client_evidences.length > 0">
            <div
              v-for="(client_evidence, link_index) in props.row.client_evidences"
              :key="link_index"
            >
              <el-alert
                :closable="false"
                type="success"
              >
                <a
                  :href="baseServerUrl+'storage/'+client_evidence.link"
                  target="_blank"
                >
                  {{ client_evidence.document_name }}
                </a>
                <el-button
                  v-if="selectedProject.is_completed === 0"
                  circle
                  type="danger"
                  @click="destroyEvidence(client_evidence.id)"
                >
                  <feather-icon icon="TrashIcon" />
                </el-button>
              </el-alert>
              <br>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="props.row.client_evidences.length > 0">
          <div
            v-for="(client_evidence, link_index) in props.row.client_evidences"
            :key="link_index"
          >
            <el-alert
              :closable="false"
              type="success"
            >
              <a
                :href="baseServerUrl+'storage/'+client_evidence.link"
                target="_blank"
              >
                {{ client_evidence.document_name }}
                <!-- <el-button
                    circle
                    type="primary"
                  >
                    <feather-icon icon="DownloadIcon" />
                  </el-button> -->
              </a>
            </el-alert>
            <br>
          </div>
        </div>
        <div v-else>
          <el-alert
            type="error"
            :closable="false"
          >
            <strong>No evidence uploaded</strong>
          </el-alert>
        </div>
      </div>
    </template>
    <!-- <template
        slot="remark"
        slot-scope="props"
      >
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
      </template> -->
  </v-client-table>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {
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
          title: 'Title',
          'client_evidence.link': 'Uploads',
          remark: '',
        },
        texts: {
          filter: 'Search:',
        },
        sortable: [],
        // filterable: false,
        filterable: false,
      },
      evidences: [],
      uploadableFile: null,
      showRemark: 0,
      loading: false,
      load: false,
      loadButton: false,
      progress: 10,
      interval: '',
      status: 'warning',
      remarkReason: '',
      adminRemark: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClientEvidence()
  },
  methods: {
    splitStringToArray(str) {
      return str.split('|')
    },
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
    fetchClientEvidence() {
      const app = this
      const param = {
        consulting_id: app.selectedProject.consulting_id,
        client_id: app.selectedProject.client_id,
        standard_id: app.selectedProject.standard_id,
      }
      const dashboardDataResource = new Resource('evidence/fetch-client-evidence')
      dashboardDataResource.list(param).then(response => {
        app.evidences = response.evidence
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
    createException(evidenceId, uploadId, evidenceIndex, uploadIndex) {
      const app = this
      app.loadButton = true
      const param = {
        project_id: app.selectedProject.id, evidence_id: evidenceId, type: 'upload', upload_id: uploadId, reason: app.remarkReason,
      }
      const createExceptionResource = new Resource('remarks/create')
      createExceptionResource.store(param)
        .then(() => {
          app.evidences[evidenceIndex].uploads[uploadIndex - 1].is_remark = 1
          app.loadButton = false
          app.remarkReason = ''
          app.$emit('reloadAnalytics')
        })
    },
    onImageChange(e, evidenceId, evidenceIndex) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      const uploadableFile = e.target.files[0]
      // console.log(app.uploadableFile)
      app.submitUpload(uploadableFile, evidenceId, evidenceIndex, 'single')
    },
    onImageChangeMultiple(e, evidenceId, evidenceIndex) {
      const app = this
      const { files } = e.target
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < files.length; i++) {
        const filesToBeUploaded = e.target.files[i]
        // console.log(file);
        // const filesToBeUploaded = file[0];
        app.submitUpload(filesToBeUploaded, evidenceId, evidenceIndex, 'multiple')
      }
      // app.rep_entries[index].files = filesToBeUploaded;
    },
    submitUpload(uploadableFile, evidenceId, evidenceIndex, mode) {
      const app = this
      document.getElementById(`load_progress_${evidenceId}`).style.display = 'block'
      app.setProgress()
      const formData = new FormData()
      formData.append('file_uploaded', uploadableFile)
      formData.append('evidence_id', evidenceId)
      formData.append('project_id', app.selectedProject.id)
      formData.append('standard_id', app.selectedProject.standard_id)
      formData.append('client_id', app.selectedProject.client_id)
      formData.append('consulting_id', app.selectedProject.consulting_id)
      formData.append('mode', mode)
      const updatePhotoResource = new Resource('evidence/create-client-evidence')
      updatePhotoResource.store(formData)
        .then(() => {
          // clearInterval(this.interval)
          setTimeout(() => {
            document.getElementById(`load_progress_${evidenceId}`).style.display = 'none'
            app.progress = 10
          }, 2000)
          app.uploadableFile = null
          app.fetchClientEvidence()
          // app.$message('File upload successful')
          app.$emit('reloadAnalytics')
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.message)
        })
    },
    saveRemark(uploadId, evidenceIndex, uploadIndex) {
      const app = this
      app.loadButton = true
      const remark = app.adminRemark
      const param = { remark }
      const saveRemarkResource = new Resource('evidences/remark-on-upload')
      saveRemarkResource.update(uploadId, param)
        .then(() => {
          app.evidences[evidenceIndex].uploads[uploadIndex - 1].remark = remark
          app.loadButton = false
          app.adminRemark = ''
        })
    },
    destroyEvidence(id) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this document? This cannot be recovered')) {
        app.loading = true
        const destroyEvidenceResource = new Resource('evidence/destroy-client-evidence')
        destroyEvidenceResource.destroy(id)
          .then(() => {
            app.fetchClientEvidence()
            app.loading = false
          }).catch(e => {
            app.loading = false
            app.$message(e.response.message)
          })
      }
    },
  },

}
</script>
