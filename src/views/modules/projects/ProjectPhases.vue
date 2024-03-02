<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage Project Phases</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-client project'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-success"
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
      </b-row>
      <b-row>
        <b-col
          cols="6"
        >
          <el-select
            v-model="standard_id"
            placeholder="Select Standard"
            filterable
            style="width: 100%"
            @input="fetchProjectPhases()"
          >
            <el-option
              v-for="(standard, index) in standards"
              :key="index"
              :value="standard.id"
              :label="standard.name"
            />
          </el-select>
        </b-col>
      </b-row>
    </div>
    <label>Update by changing the value in the text box</label>
    <v-client-table
      v-model="project_phases"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="title"
        slot-scope="{row}"
      >
        <input
          v-model="row.title"
          class="form-control"
          @blur="updateProjectPhase(row.id, $event)"
        >
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyProjectPhase(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <b-modal
      v-model="showModal"
      hide-footer
      centered
      title="Enter Phase Title"
    >
      <el-row
        v-loading="loading"
        :gutter="20"
      >

        <el-col :xs="24">
          <el-select
            v-model="form.standard_ids"
            placeholder="Select Standard"
            filterable
            multiple
            collapse-tags
            style="width: 100%"
          >
            <el-option
              v-for="(standard, index) in standards"
              :key="index"
              :value="standard.id"
              :label="standard.name"
            />
          </el-select>
        </el-col>
        <el-col :xs="24">
          <small>You can enter multiple phase titles, just separate them with a vertical bar <code>|</code> <br>for example: Phase 1|Phase 2|Phase 3</small>
          <el-input
            v-model="form.titles"
            placeholder="Phase 1|Phase 2|Phase 3"
          />
          <hr>
        </el-col>
        <el-col :xs="24">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :disabled="form.titles === ''"
            variant="gradient-success"
            @click="submitProjectPhases()"
          >
            <feather-icon
              icon="SaveIcon"
              class="mr-50"
            />
            <span class="align-middle">Save</span>
          </b-button>
        </el-col>
      </el-row>

    </b-modal>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol, BModal,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BButton,
    BRow,
    BCol,
    BModal,
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
      columns: [
        'action',
        'standard.name',
        'title',
      ],

      options: {
        headings: {
          'standard.name': 'Standard',
          title: 'Title',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        // filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'title',
        ],
        // filterable: false,
        filterable: [
          'title',
        ],
      },
      project_phases: [],
      form: {
        titles: '',
        standard_ids: [],
      },
      standards: [],
      standard_id: '',
    }
  },
  created() {
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    fetchProjectPhases() {
      const app = this
      app.loading = true
      const fetchProjectsResource = new Resource('project-plans/fetch-project-phases')
      fetchProjectsResource.list({ standard_id: app.standard_id })
        .then(response => {
          app.project_phases = response.project_phases
          app.loading = false
        })
    },
    fetchStandards() {
      const app = this
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list()
        .then(response => {
          app.standards = response.standards
        })
    },
    submitProjectPhases() {
      const app = this
      // app.showModal = false
      app.loading = true
      const saveProjectsResource = new Resource('project-plans/store-project-phases')
      saveProjectsResource.store(app.form)
        .then(() => {
          app.showModal = false
          app.form = { titles: '' }
          app.fetchProjectPhases()
          app.loading = false
        })
    },
    updateProjectPhase(id, event) {
      // const app = this
      const updateProjectsResource = new Resource('project-plans/update-project-phases')
      updateProjectsResource.update(id, { title: event.target.value })
        .then(() => {
          // app.fetchProjectPhases()
        })
    },
    destroyProjectPhase(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('project-plans/destroy-project-phases')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchProjectPhases()
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
