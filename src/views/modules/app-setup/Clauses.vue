<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Clauses</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-clauses'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateClauseSidebarActive = true"
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
    </div>
    <!-- table -->
    <el-alert>Click on the + sign to view document templates</el-alert>
    <v-client-table
      v-model="clauses"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <template
        slot="child_row"
        slot-scope="props"
      >
        <strong>Document Templates for {{ props.row.name }}</strong>
        <aside>
          <v-client-table
            v-model="props.row.templates"
            :columns="['title', 'action']"
            :options="{}"
          >
            <div
              slot="action"
              slot-scope="{row}"
            >
              <a
                :href="baseServerUrl+'storage/'+row.link"
                target="_blank"
              >
                <b-button
                  variant="gradient-warning"
                  class="btn-icon rounded-circle"
                >
                  <feather-icon icon="DownloadIcon" />
                </b-button>
              </a>
              <b-button
                variant="gradient-danger"
                class="btn-icon rounded-circle"
                @click="destroyTemplate(row)"
              >
                <feather-icon icon="XIcon" />
              </b-button>
            </div>
          </v-client-table>
        </aside>
      </template>
      <div
        slot="will_have_audit_questions"
        slot-scope="props"
      >
        {{ (props.row.will_have_audit_questions === 1) ? 'YES' : 'NO' }}
      </div>
      <div
        slot="requires_document_upload"
        slot-scope="props"
      >
        {{ (props.row.requires_document_upload === 1) ? 'YES' : 'NO' }}
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="Add document template"
          placement="top-start"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="addDocumentTemplate(props.row)"
          >
            <feather-icon icon="UploadIcon" />
          </b-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Edit Clause"
          placement="top-start"
        >
          <b-button
            v-if="checkPermission(['update-clauses'])"
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Remove Clause"
          placement="top-start"
        >
          <b-button
            v-if="checkPermission(['delete-clauses'])"
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="destroyRow(props.row)"
          >
            <feather-icon icon="TrashIcon" />
          </b-button>
        </el-tooltip>
      </div>
    </v-client-table>
    <el-row :gutter="20">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="fetchClauses"
      />
    </el-row>
    <b-modal
      v-model="showModal"
      title="Add Document Template"
      centered
      size="lg"
      hide-footer
    >

      <add-document-template
        :clause="selectedClause"
        @reload="fetchClauses"
      />

    </b-modal>
    <create-clauses
      v-if="isCreateClauseSidebarActive"
      v-model="isCreateClauseSidebarActive"
      :standards="standards"
      @save="updateTable"
    />
    <edit-clause
      v-if="isEditClauseSidebarActive"
      v-model="isEditClauseSidebarActive"
      :standards="standards"
      :selected-clause="editable_row"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol, BModal,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateClauses from './partials/CreateClauses.vue'
import EditClause from './partials/EditClause.vue'
import Pagination from '@/views/components/Pagination-main/index.vue'
import AddDocumentTemplate from './partials/AddDocumentTemplate.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    AddDocumentTemplate,
    CreateClauses,
    EditClause,
    BButton,
    Pagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
    BModal,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      showModal: false,
      selectedClause: null,
      loading: false,
      isCreateClauseSidebarActive: false,
      isEditClauseSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'standard.name',
        'will_have_audit_questions',
        'requires_document_upload',
        'action',
      ],

      options: {
        headings: {
          'standard.name': 'Standard',
          requires_document_upload: 'Requires Document Upload',
          will_have_audit_questions: 'Have Audit Question',
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
          'name',
          'standard.name',
        ],
        // filterable: false,
        filterable: [
          'name',
          'standard.name',
        ],
      },
      clauses: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClauses()
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    fetchStandards() {
      const app = this
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list()
        .then(response => {
          app.standards = response.standards
        })
    },
    fetchClauses() {
      const app = this
      const { limit, page } = this.query
      app.loading = true
      const fetchClausesResource = new Resource('clauses')
      fetchClausesResource.list()
        .then(response => {
          app.clauses = response.clauses.data
          app.clauses.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.clauses.total
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchClauses()
    },
    addDocumentTemplate(selectedRow) {
      const app = this
      app.selectedClause = selectedRow
      app.showModal = true
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditClauseSidebarActive = true
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyClausesResource = new Resource('clauses/destroy')
        destroyClausesResource.destroy(row.id)
          .then(() => {
            app.fetchClauses()
            app.loading = false
          }).catch(e => {
            app.load = false
            app.$message(e.response.message)
          })
      }
    },
    destroyTemplate(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this template?')) {
        app.loading = true
        const destroyTemplateResource = new Resource('clauses/destroy-template')
        destroyTemplateResource.destroy(row.id)
          .then(() => {
            app.fetchClauses()
            app.loading = false
          }).catch(e => {
            app.load = false
            app.$message(e.response.message)
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchClauses()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
