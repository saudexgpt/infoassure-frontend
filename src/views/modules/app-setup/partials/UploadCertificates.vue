<template>
  <el-card>
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
        >
          <el-select
            v-model="selectedClient"
            value-key="id"
            placeholder="Select Client"
            style="width: 100%;"
            @input="fetchProjects()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client"
              :label="client.name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <v-client-table
      v-model="certificates"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="report"
        slot-scope="{row}"
      >
        <input
          class="form-control"
          type="file"
          @change="onImageChange($event, row.id, 'report' )"
        ><br>
        <el-alert
          v-if="row.report !== null"
          :closable="false"
          type="success"
        >
          <a
            :href="baseServerUrl+'storage/'+row.report"
            target="_blank"
          >
            <el-button
              round
              type="primary"
            >
              <feather-icon icon="DownloadIcon" /> View
            </el-button>
          </a>
        </el-alert>
      </div>
      <div
        slot="original"
        slot-scope="{row}"
      >
        <input
          class="form-control"
          type="file"
          @change="onImageChange($event, row.id, 'original')"
        ><br>
        <el-alert
          v-if="row.original !== null"
          :closable="false"
          type="success"
        >
          <a
            v-if="row.original !== null"
            :href="baseServerUrl+'storage/'+row.original"
            target="_blank"
          >
            <el-button
              round
              type="primary"
            >
              <feather-icon icon="DownloadIcon" /> View
            </el-button>
          </a>
          <a
            v-else
            :href="baseServerUrl+'storage/'+row.preview"
            target="_blank"
          >
            <el-button
              round
              type="primary"
            >
              <feather-icon icon="DownloadIcon" /> View
            </el-button>
          </a>
        </el-alert>
      </div>
      <div
        slot="client_comment_on_preview"
        slot-scope="{row}"
      >
        <el-input
          v-model="row.client_comment_on_preview"
          type="textarea"
          placeholder="Client's comment on the certificate preview will be shown here"
          readonly
        />
      </div>
    </v-client-table>
    <add-project
      v-if="isCreateProjectSidebarActive"
      v-model="isCreateProjectSidebarActive"
      :clients="clients"
      @save="updateTable"
    />
  </el-card>
</template>

<script>
import {} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {},
  directives: {
    Ripple,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        },
      },
      loading: false,
      isCreateProjectSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'project.standard.name',
        'report',
        'client_comment_on_preview',
        'original',
      ],

      options: {
        headings: {
          'project.standard.name': 'Project',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'project.standard.name',
        ],
        // filterable: false,
        filterable: [
          'project.standard.name',
        ],
      },
      certificates: [],
      clients: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
      selectedClient: null,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClients()
  },
  methods: {
    fetchClients() {
      const app = this
      const fetchProjectsResource = new Resource('clients')
      fetchProjectsResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    fetchProjects() {
      const app = this
      app.loading = true
      const fetchProjectsResource = new Resource('projects/client-project-certificates')
      fetchProjectsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.certificates = response.certificates // .data
          app.loading = false
        })
    },
    onImageChange(e, id, certType) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.uploadableFile = e.target.files[0]
      app.submit(id, certType)
    },
    submit(id, certType) {
      const app = this
      app.load = true
      const formData = new FormData()
      formData.append('project_certificate_id', id)
      formData.append('file_uploaded', app.uploadableFile)
      formData.append('cert_type', certType)
      const uploadFileResource = new Resource('projects/upload-certificate')
      uploadFileResource.store(formData)
        .then(() => {
          app.load = false
          app.uploadableFile = null
          app.form = {
            title: '',
            link: '',
          }
          app.$message('File upload successful')

          app.fetchProjects()
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.message)
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
