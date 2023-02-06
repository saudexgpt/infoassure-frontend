<template>
  <div v-loading="loading">

    <div v-if="showManageProject">
      <div slot="header">
        <b-row>
          <b-col
            cols="6"
          >
            <h4>Manage {{ selected_project.standard.name }}</h4>
          </b-col>
          <b-col
            cols="6"
          >
            <span class="pull-right">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-danger"
                size="sm"
                @click="showManageProject = false"
              >
                <feather-icon
                  icon="ArrowLeftIcon"
                  class="mr-50"
                />
                <span class="align-middle">Back</span>
              </b-button>
            </span>
          </b-col>
          <hr>
        </b-row>
      </div>

      <manage-project :selected-project="selected_project" />
    </div>
    <div v-else>
      <div v-if="projects.length > 0">
        <div slot="header">
          <b-row>
            <b-col>
              <el-alert
                type="success"
                :closable="false"
              >
                <h4>Click to manage projects</h4>
              </el-alert>
            </b-col>
          </b-row>
        </div>
        <!-- table -->
        <el-row :gutter="5">
          <el-col
            v-for="(project, index) in projects"
            :key="index"
            :span="6"
          >
            <el-card
              shadow="always"
              style="margin-bottom: 5px; border-radius: 50px;"
            >
              <div
                align="center"
                style="cursor: pointer; padding: 15px;"
                @click="manageProject(project)"
              >
                <el-tooltip
                  :content="` Click to manage ${project.standard.name}`"
                  placement="top"
                >
                  <h1>{{ project.standard.name }}</h1>
                </el-tooltip>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-empty
          :image-size="200"
          description="YOU HAVE NO ACTIVE PROJECTS"
        />
      </div>
      <!-- <v-client-table
        v-model="projects"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="action"
          slot-scope="props"
        >
          <el-tooltip
            :content="`Manage ${props.row.standard.name}`"
            placement="top"
          >
            <b-button
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              @click="manageProject(props.row)"
            >
              <feather-icon icon="SettingsIcon" />
            </b-button>
          </el-tooltip>
         <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
        </div>
      </v-client-table> -->
      <!-- <add-project
        v-if="isCreateConsultingSidebarActive"
        v-model="isCreateConsultingSidebarActive"
        :consulting="consulting"
        :registered-standards="registeredStandardsIds"
        @save="updateTable"
      /> -->
    </div>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
// import AddProject from './partials/AddProject.vue'
import ManageProject from './partials/ManageProject.vue'

export default {
  components: {
    // AddProject,
    ManageProject,
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    consulting: {
      type: Object,
      default: () => ({ id: '', name: '' }),
    },
  },
  data() {
    return {
      loading: false,
      isCreateConsultingSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'standard.name',
        'action',
      ],

      options: {
        headings: {
          'standard.name': 'Project',
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
          'standard.name',
        ],
        // filterable: false,
        filterable: [
          'standard.name',
        ],
      },
      projects: [],
      registeredStandardsIds: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
    }
  },
  created() {
    this.fetchProjects()
  },
  methods: {
    fetchProjects() {
      const app = this
      const { id } = app.consulting
      app.loading = true
      const fetchProjectsResource = new Resource('projects')
      fetchProjectsResource.list({ consulting_id: id })
        .then(response => {
          app.projects = response.projects // .data
          const registeredStandardsIds = []
          app.projects.forEach(project => {
            registeredStandardsIds.push(project.standard.id)
          })
          app.registeredStandardsIds = registeredStandardsIds
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchProjects()
    },
    manageProject(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selected_project = selectedRow
      app.showManageProject = true
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyConsultingsResource = new Resource('consultings/destroy')
        destroyConsultingsResource.destroy(row.id)
          .then(() => {
            app.fetchConsultings()
            app.loading = false
          })
      }
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
