<template>

  <el-container
    class="no-margin"
    style="min-height: 650px; border: 1px solid #eee"
  >
    <el-aside
      v-loading="loading"
      width="400px"
      style="padding: 0 !important"
    >
      <div style="padding: 10px !important">
        <b-row>
          <b-col
            cols="8"
          >
            <strong>Manage Document/Evidence Templates</strong>
          </b-col>
          <b-col
            cols="4"
          >
            <span class="pull-right">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="secondary"
                size="sm"
                @click="showModal = true"
              >
                <feather-icon
                  icon="PlusIcon"
                  class="mr-50"
                />
                <span class="align-middle">Create</span>
              </b-button>
            </span>
          </b-col>
          <b-col cols="12">
            <hr>
            <el-input
              v-model="form.title"
              placeholder="Search document title"
              @input="fetchDocumentTemplates(false)"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="fetchDocumentTemplates(true)"
              />
            </el-input>
          </b-col>
        </b-row>
      </div>
      <div>
        <el-menu>
          <el-submenu
            v-for="(documentTemplates, index) in templates"
            :key="index"
            :index="`${index}`"
          >
            <template slot="title">
              <h4><strong>{{ index }}</strong></h4>
            </template>

            <el-menu-item
              v-for="(template, sub_index) in documentTemplates"
              :key="`${index}-${sub_index}`"
            >
              <el-tooltip
                v-if="template.title.length > 45"
                effect="dark"
                :content="template.title"
                placement="top"
              >
                <span
                  @click="setView(template)"
                >{{ template.title.substring(0, 45) }}...</span>
              </el-tooltip>
              <span
                v-else
                @click="setView(template)"
              >{{ template.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>

    <el-container>
      <el-main v-loading="loadView">
        <div
          v-if="viewType === 'welcome'"
          align="center"
          style="margin-top: 100px"
        >
          <img
            src="/images/project-icons/soa-large.png"
            width="250"
          >
          <p>We are glad to help you stay compliant</p>
        </div>
        <div v-else>
          <div v-if="showDocumentEditor !== 'none'">
            <div>
              <span
                class="pull-right"
              >
                <el-button
                  type="danger"
                  class="btn-icon"
                  size="mini"
                  @click="showDocumentEditor = 'none'; viewType = 'welcome'"
                >
                  <feather-icon icon="XIcon" />
                </el-button>
              </span>
            </div>
            <div>
              <vue-document-editor
                v-if="showDocumentEditor === 'word'"
                :document-path="selectedDocument.link"
                :document-title="selectedDocument.template_title"
              />
              <vue-spreadsheet-editor
                v-if="showDocumentEditor === 'spreadsheet'"
                :document-path="selectedDocument.link"
                :document-title="selectedDocument.template_title"
              />
            </div>
          </div>
          <iframe
            v-if="showDocumentEditor === 'none' && docSrc !== ''"
            :id="type"
            style="display: none; border:1px solid black;"
            width="100%"
            height="550"
            :src="baseServerUrl+'storage/'+docSrc"
          />
          <a
            :id="`${type}-download`"
            :href="baseServerUrl+'storage/'+docSrc"
            target="_blank"
          />
        </div>
      </el-main>
    </el-container>
    <b-modal
      v-if="showModal"
      v-model="showModal"
      title="Upload New Document/Evidence Template"
      centered
      size="lg"
      hide-footer
    >

      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>File</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <el-input
                v-model="templateForm.title"
                type="text"
                outline
                placeholder="Title of document"
              />
            </td>
            <td>
              <input
                class="form-control"
                type="file"
                @change="onImageChange"
              >
            </td>
            <td>
              <span>
                <b-button
                  variant="success"
                  class="btn-icon rounded-circle"
                  :disabled="templateForm.title === '' || templateForm.uploadableFile === null"
                  @click="submitNewTemplate()"
                >
                  <feather-icon icon="UploadIcon" />
                </b-button>

              </span>
            </td>
          </tr>
        </tbody>
      </table>

    </b-modal>
  </el-container>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import VueDocumentEditor from '@/views/components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/components/editors/VueSpreadsheetEditor.vue'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'
// import CreateEvidence from './partials/CreateEvidence.vue'
// import EditEvidence from './partials/EditEvidence.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    // CreateEvidence,
    // EditEvidence,
    BButton,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
    VueDocumentEditor,
    VueSpreadsheetEditor,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      showModal: false,
      pageLength: 10,
      dir: false,
      evidence: [],
      consultings: [],
      editable_row: '',
      selected_row_index: '',
      selectedConsulting: '',
      templates: [],
      loadView: false,
      viewType: 'welcome',
      showDocumentEditor: 'none',
      selectedDocument: null,
      type: '',
      form: {
        title: '',
      },
      templateForm: {
        title: '',
        uploadableFile: null,
      },
      docSrc: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    // this.fetchEvidence()
    this.fetchDocumentTemplates(true)
  },
  methods: {
    checkPermission,
    setView(template) {
      const app = this
      app.viewType = 'documentViews'
      app.showDocumentEditor = 'none'
      app.selectedDocument = template
      app.docSrc = template.link
      app.type = template.link.split('.').pop() // this returns the file extension

      setTimeout(() => {
        if (app.type === 'pdf') {
          document.getElementById(app.type).style.display = 'block'
        } else if (app.type === 'doc' || app.type === 'docx') {
          app.showDocumentEditor = 'word'
        } else if (app.type === 'csv' || app.type === 'xlsx' || app.type === 'xls') {
          // app.showDocumentEditor = 'spreadsheet'

          document.getElementById(`${app.type}-download`).click()
        }
      }, 100)
    },
    onImageChange(e) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.templateForm.uploadableFile = e.target.files[0]
    },
    fetchDocumentTemplates(load) {
      const app = this
      app.loading = load
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.form)
        .then(response => {
          app.templates = response.document_templates
          app.loading = false
        })
    },
    submitNewTemplate() {
      const app = this
      app.loading = true
      const formData = new FormData()
      formData.append('title', app.templateForm.title)
      formData.append('file_uploaded', app.templateForm.uploadableFile)
      const updatePhotoResource = new Resource('document-templates/upload')
      updatePhotoResource.store(formData)
        .then(() => {
          app.fetchDocumentTemplates(false)
          app.loading = false
          app.uploadableFile = null
          app.templateForm = {
            title: '',
            uploadableFile: null,
          }
          app.$message('File upload successful')
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.message)
        })
    },
  },
}
</script>
