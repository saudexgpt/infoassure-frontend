<template>
  <el-container class="no-margin" style="min-height: 650px; border: 1px solid #eee">
    <el-aside v-loading="loading" width="400px" style="padding: 0 !important">
      <div style="padding: 10px !important">
        <el-row>
          <el-col cols="8">
            <strong>Manage Document/Evidence Templates</strong>
          </el-col>
          <el-col cols="4">
            <span class="pull-right">
              <el-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="secondary"
                size="sm"
                @click="showModal = true"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
          <el-col cols="12">
            <hr />
            <el-input
              v-model="form.title"
              placeholder="Search document title"
              @input="fetchDocumentTemplates(false)"
            >
              <template v-slot:append>
                <el-button icon="el-icon-search" @click="fetchDocumentTemplates(true)" />
              </template>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-menu>
          <el-submenu
            v-for="(documentTemplates, index) in templates"
            :key="index"
            :index="`${index}`"
          >
            <template v-slot:title>
              <h4
                ><strong>{{ index }}</strong></h4
              >
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
                <span @click="setView(template)">{{ template.title.substring(0, 45) }}...</span>
              </el-tooltip>
              <span v-else @click="setView(template)">{{ template.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>

    <el-container>
      <el-main v-loading="loadView">
        <div v-if="viewType === 'welcome'" align="center" style="margin-top: 100px">
          <img src="/images/project-icons/soa-large.png" width="250" />
          <p>We are glad to help you stay compliant</p>
        </div>
        <div v-else>
          <div v-if="showDocumentEditor !== 'none'">
            <div>
              <span class="pull-right">
                <el-button
                  type="danger"
                  class="btn-icon"
                  size="mini"
                  @click="((showDocumentEditor = 'none'), (viewType = 'welcome'))"
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
            style="display: none; border: 1px solid black"
            width="100%"
            height="550"
            :src="baseServerUrl + 'storage/' + docSrc"
          ></iframe>
          <a
            :id="`${type}-download`"
            :href="baseServerUrl + 'storage/' + docSrc"
            target="_blank"
          ></a>
        </div>
      </el-main>
    </el-container>
    <el-modal
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
            <th></th>
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
              <input class="form-control" type="file" @change="onImageChange" />
            </td>
            <td>
              <span>
                <el-button
                  variant="success"
                  class="btn-icon rounded-circle"
                  :disabled="templateForm.title === '' || templateForm.uploadableFile === null"
                  @click="submitNewTemplate()"
                >
                  <feather-icon icon="UploadIcon" />
                </el-button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </el-modal>
  </el-container>
</template>

<script>
import VueDocumentEditor from '@/views/Components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/Components/editors/VueSpreadsheetEditor.vue'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'
// import CreateEvidence from './partials/CreateEvidence.vue'
// import EditEvidence from './partials/EditEvidence.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    VueDocumentEditor,
    VueSpreadsheetEditor
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
        title: ''
      },
      templateForm: {
        title: '',
        uploadableFile: null
      },
      docSrc: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    // this.fetchEvidence()
    this.fetchDocumentTemplates(true)
  },
  methods: {
    checkPermission,
    setView(template) {
      this.viewType = 'documentViews'
      this.showDocumentEditor = 'none'
      this.selectedDocument = template
      this.docSrc = template.link
      this.type = template.link.split('.').pop() // this returns the file extension

      setTimeout(() => {
        if (this.type === 'pdf') {
          document.getElementById(this.type).style.display = 'block'
        } else if (this.type === 'doc' || this.type === 'docx') {
          this.showDocumentEditor = 'word'
        } else if (this.type === 'csv' || this.type === 'xlsx' || this.type === 'xls') {
          // this.showDocumentEditor = 'spreadsheet'

          document.getElementById(`${this.type}-download`).click()
        }
      }, 100)
    },
    onImageChange(e) {
      this.templateForm.uploadableFile = e.target.files[0]
    },
    fetchDocumentTemplates(load) {
      this.loading = load
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.form).then((response) => {
        this.templates = response.document_templates
        this.loading = false
      })
    },
    submitNewTemplate() {
      this.loading = true
      const formData = new FormData()
      formData.append('title', this.templateForm.title)
      formData.append('file_uploaded', this.templateForm.uploadableFile)
      const updatePhotoResource = new Resource('document-templates/upload')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.fetchDocumentTemplates(false)
          this.loading = false
          this.uploadableFile = null
          this.templateForm = {
            title: '',
            uploadableFile: null
          }
          this.$message('File upload successful')
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    }
  }
}
</script>
