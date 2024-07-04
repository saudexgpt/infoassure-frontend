<template>
  <el-card>
    <div slot="header">
      <span
        class="pull-right"
      >
        <el-button
          v-if="!showCreate"
          type="primary"
          size="mini"
          @click="showCreate = true"
        >Create</el-button>
        <el-button
          v-if="showCreate"
          type="danger"
          size="mini"
          @click="showCreate = false"
        >Hide Create Form</el-button>
      </span>
      <h3>Threat & Vulnerability Library</h3>
    </div>
    <div v-loading="loading">
      <upload-bulk
        v-if="showCreate"
        @save="fetchRiskLibrary"
      />
      <el-collapse
        accordion
        type="border"
      >
        <el-collapse-item
          v-for="(library, index) in risk_libraries"
          :key="index"
          :title="library.threats"
        >
          <template slot="title">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="library.threats" />
          </template>
          <el-row :gutter="10">
            <el-col :md="8">
              <label>Threat</label>
              <ckeditor
                id="threats"
                v-model="library.threats"
                :editor="editor"
                :config="editorConfig"
                style="width: 100px"
                @blur="updateEntry(library.id, 'threats', library.threats)"
              />
            </el-col>
            <el-col :md="8">
              <label>Vulnerability</label>
              <ckeditor
                id="vulnerabilities"
                v-model="library.vulnerabilities"
                :editor="editor"
                :config="editorConfig"
                style="width: 100px"
                @blur="updateEntry(library.id, 'vulnerabilities', library.vulnerabilities)"
              />
            </el-col>
            <el-col :md="8">
              <label>Solution</label>
              <ckeditor
                id="solutions"
                v-model="library.solutions"
                :editor="editor"
                :config="editorConfig"
                style="width: 100px"
                @blur="updateEntry(library.id, 'solutions', library.solutions)"
              />
            </el-col>
          </el-row>

        </el-collapse-item>
      </el-collapse>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchRiskLibrary"
        />
      </el-row>
    </div>
  </el-card>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Pagination from '@/views/components/Pagination-main/index.vue'
import Resource from '@/api/resource'
import UploadBulk from './UploadBulk.vue'

export default {
  components: {
    Pagination,
    UploadBulk,
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
        // toolbar: {
        //   items: ['undo', 'redo', '|', 'bold', 'italic'],
        // },
      },
      risk_libraries: [],
      clients: [],
      loading: false,
      showCreate: false,
      query: {
        page: 1,
        limit: 10,
      },
      total: 0,
    }
  },
  created() {
    this.fetchRiskLibrary()
  },
  methods: {
    fetchRiskLibrary() {
      const app = this
      const { limit, page } = this.query
      const fetchEntryResource = new Resource('risk-library')
      app.loading = true
      fetchEntryResource.list(this.query)
        .then(response => {
          app.risk_libraries = response.risk_libraries.data
          app.risk_libraries.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.risk_libraries.total
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    updateEntry(id, field, value) {
      const fetchMatriceResource = new Resource('risk-library/update')
      fetchMatriceResource.update(id, { field, value }).then().catch()
    },
  },
}
</script>
