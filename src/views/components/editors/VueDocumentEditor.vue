<template>
  <div v-loading="loading">
    <div>
      <el-tooltip
        class="item"
        effect="dark"
        content="Save"
        placement="top-start"
      >
        <el-button
          type="success"
          size="mini"
          @click="saveFile"
        >
          <feather-icon icon="SaveIcon" />
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="Download"
        placement="top-start"
      >
        <el-button
          type="primary"
          size="mini"
          @click="downloadFile"
        >
          <feather-icon icon="DownloadIcon" />
        </el-button>
      </el-tooltip>
    </div>
    <ejs-documenteditorcontainer
      ref="doceditcontainer"
      height="500px"
      :service-url="serviceUrl"
      :toolbar-items="items"
      :enable-toolbar="true"
      :enable-sfdt-export="true"
      :enable-word-export="true"
      :enable-selection="true"
      :enable-editor="true"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import {
  DocumentEditorContainerPlugin, Toolbar, Selection, Editor, SfdtExport, WordExport,
} from '@syncfusion/ej2-vue-documenteditor'

import Resource from '@/api/resource'

Vue.use(DocumentEditorContainerPlugin)
export default {
  props: {

    documentPath: {
      type: String,
      default: '',
    },
    documentTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/',
      items: [
        'New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Comments', 'Find', 'Separator', 'Image', 'Table', 'Hyperlink', 'Separator', 'Header', 'Footer', 'Break', /* 'TableOfContents', 'Bookmark',  'PageSetup', 'PageNumber', 'Separator', 'LocalClipboard', 'RestrictEditing', */
      ],
    }
  },
  provide: {
    // Inject require modules.
    DocumentEditorContainer: [Toolbar, Selection, Editor, SfdtExport, WordExport],
  },
  mounted() {
    this.fetchSFDTFile()
  },
  methods: {
    openFileButtonClickHandler() {
      this.$refs.fileUpload.click()
    },
    fetchSFDTFile() {
      const app = this
      app.loading = true
      const formData = {
        path: app.documentPath,
      }
      const fetchResource = new Resource('format-doc-to-sfdt')
      fetchResource.list(formData)
        .then(response => {
          // open the SFDT text in Document Editor
          this.$refs.doceditcontainer.ej2Instances.documentEditor.open(response)
          app.loading = false
        }).catch(e => {
          app.loading = false
          console.log(e.response.message)
          app.$message('Document Not Found')
        })
    },
    downloadFile() {
      // Download the document in docx format.
      this.$refs.doceditcontainer.ej2Instances.documentEditor.save(this.documentTitle, 'Docx')
    },
    // onFileUpload(e) {
    //   if (e.target.files[0]) {
    //     const file = e.target.files[0]
    //     if (file.name.substr(file.name.lastIndexOf('.')) === '.docx') {
    //       const fileReader = new FileReader()
    //       // eslint-disable-next-line no-shadow
    //       fileReader.onload = e => {
    //         const contents = e.target.result
    //         // Open the default document in Document Editor.
    //         this.$refs.doceditcontainer.ej2Instances.documentEditor.open(contents)
    //       }
    //       fileReader.readAsText(file)
    //     }
    //   }
    // },

    saveFile() {
      const app = this
      app.$confirm('This will overwrite the existing document. Continue?', 'Warning', {
        confirmButtonText: 'Yes, Please',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        app.$refs.doceditcontainer.ej2Instances.documentEditor.saveAsBlob('Docx').then(exportedDocument => {
        // The blob can be processed further
          const formData = new FormData()
          formData.append('file_to_be_saved', exportedDocument)
          formData.append('path', app.documentPath)
          app.saveDocBlob(formData)
        })
      }).catch(() => {})
    },
    saveDocBlob(formData) {
      const app = this
      app.loading = true
      const saveResource = new Resource('save-blob-doc')
      saveResource.store(formData)
        .then(response => {
          // open the SFDT text in Document Editor
          app.$message(response.message)
          // this.$refs.doceditcontainer.ej2Instances.documentEditor.open(response)
          app.loading = false
        }).catch(e => {
          app.loading = false
          app.$message(e.response.message)
        })
    },
  },
}
</script>
<style>
@import '../../../styles/ej2-base/buttons.css';
@import '../../../styles/ej2-base/inputs.css';
@import '../../../styles/ej2-base/popups.css';
@import '../../../styles/ej2-base/lists.css';
@import '../../../styles/ej2-base/navigations.css';
@import '../../../styles/ej2-base/splitbuttons.css';
@import '../../../styles/ej2-base/dropdowns.css';
@import '../../../styles/ej2-base/base.css';
@import '../../../styles/ej2-base/doc-editor-material.css';
/* @import '@/styles/ej2-base/doc-editor-material.css' */
</style>
