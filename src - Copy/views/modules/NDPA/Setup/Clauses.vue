<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>List of Requirements</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-clauses'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
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
    <!-- <el-row :gutter="10">
      <el-col :lg="12">
        <el-select
          v-model="query.standard_id"
          style="width: 100%"
          placeholder="Select Standard"
          filterable
          @input="fetchClauses()"
        >
          <el-option
            v-for="(standard, index) in standards"
            :key="index"
            :value="standard.id"
            :label="standard.name"
          />
        </el-select>
      </el-col>
    </el-row> -->
    <br>
    <!-- table -->
    <el-alert
      v-if="clauses.length > 0"
      type="success"
    >
      Click on the + sign to view Sections
    </el-alert>
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
        <strong>Sections for {{ `${props.row.name} - ${props.row.description}` }}</strong>
        <aside>
          <v-client-table
            v-model="props.row.sections"
            :columns="['name', 'action']"
            :options="{}"
          >
            <div
              slot="name"
              slot-scope="{row}"
            >
              {{ `${row.name} - ${row.description}` }}
            </div>
            <div
              slot="action"
              slot-scope="{row}"
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
                  @click="addDocumentTemplate(row)"
                >
                  <feather-icon icon="UploadIcon" />
                </b-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Edit Section"
                placement="top-start"
              >
                <b-button
                  variant="gradient-secondary"
                  class="btn-icon rounded-circle"
                  @click="editSection(row)"
                >
                  <feather-icon icon="EditIcon" />
                </b-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Delete Section"
                placement="top-start"
              >
                <b-button
                  variant="gradient-danger"
                  class="btn-icon rounded-circle"
                  @click="destroySection(row)"
                >
                  <feather-icon icon="XIcon" />
                </b-button>
              </el-tooltip>
            </div>
          </v-client-table>
        </aside>
      </template>
      <div
        slot="sort_by"
        slot-scope="{row}"
      >
        <input
          v-model="row.sort_by"
          placeholder="Enter Sort Value"
          type="number"
          class="form-control"
          @change="setSortValue($event, row.id)"
        >
      </div>
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
        <b-dropdown
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          class="mx-1"
          right
          text="Action"
        >
          <b-dropdown-item
            @click="addSections(props.row)"
          >
            <span><feather-icon icon="LayersIcon" /> Add Sections</span>
          </b-dropdown-item>

          <b-dropdown-item
            @click="editThisRow(props.row)"
          >
            <span><feather-icon icon="EditIcon" /> Edit</span>
          </b-dropdown-item>
          <b-dropdown-item
            @click="destroyRow(props.row)"
          >
            <span><feather-icon icon="TrashIcon" /> Delete</span>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </v-client-table>
    <b-modal
      v-model="showSectionModal"
      title="Add Sections"
      centered
      size="lg"
      hide-footer
    >

      <add-sections
        :clause="selectedClause"
        @reload="fetchClauses"
      />

    </b-modal>
    <b-modal
      v-model="showEditSectionModal"
      title="Edit Sections"
      centered
      size="lg"
      hide-footer
    >

      <edit-section
        :section="selectedSection"
        @reload="fetchClauses"
      />

    </b-modal>
    <b-modal
      v-model="showModal"
      title="Add Document Template"
      centered
      size="lg"
      hide-footer
    >

      <add-document-template
        :section="selectedSection"
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
  BButton, BRow, BCol, BModal, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateClauses from './partials/CreateClauses.vue'
import EditClause from './partials/EditClause.vue'
import AddDocumentTemplate from './partials/AddDocumentTemplate.vue'
import AddSections from './partials/AddSections.vue'
import EditSection from './partials/EditSection.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    BDropdown,
    BDropdownItem,
    AddDocumentTemplate,
    AddSections,
    EditSection,
    CreateClauses,
    EditClause,
    BButton,
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
      sortValue: 1,
      showModal: false,
      showSectionModal: false,
      showEditSectionModal: false,
      selectedClause: null,
      selectedSection: null,
      loading: false,
      loadEntry: false,
      isCreateClauseSidebarActive: false,
      isEditClauseSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'sort_by',
        'name',
        'description',
        // 'standard.name',
        // 'will_have_audit_questions',
        // 'requires_document_upload',
        'action',
      ],

      options: {
        headings: {
          // 'standard.name': 'Standard',
          requires_document_upload: 'Requires Document Upload',
          will_have_audit_questions: 'Has Audit Question',
          action: '',
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
        ],
        // filterable: false,
        filterable: [
          'name',
        ],
      },
      clauses: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      query: {
        page: 1,
        limit: 10,
        standard_id: '',
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
    // this.fetchStandards()
  },
  methods: {
    checkPermission,
    setSortValue(event, id) {
      const app = this
      const { value } = event.target
      if (value > 0) {
        const sortResource = new Resource('ndpa/clauses/set-sort-value')
        sortResource.update(id, { value })
          .then(() => {
          }).catch(e => {
            app.$message(e.response.data.message)
          })
      }
    },
    // fetchStandards() {
    //   const app = this
    //   const fetchStandardsResource = new Resource('standards')
    //   fetchStandardsResource.list()
    //     .then(response => {
    //       app.standards = response.standards
    //     })
    // },
    fetchClauses() {
      const app = this
      app.loading = true
      const fetchClausesResource = new Resource('ndpa/clauses')
      fetchClausesResource.list(this.query)
        .then(response => {
          app.clauses = response.clauses
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchClauses()
    },
    addDocumentTemplate(selectedRow) {
      const app = this
      app.selectedSection = selectedRow
      app.showModal = true
    },
    addSections(selectedRow) {
      const app = this
      app.selectedClause = selectedRow
      app.showSectionModal = true
    },
    editSection(row) {
      const app = this
      app.selectedSection = row
      app.showEditSectionModal = true
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
        const destroyClausesResource = new Resource('ndpa/clauses/destroy')
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
        const destroyTemplateResource = new Resource('ndpa/clauses/destroy-template')
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
    destroySection(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
        app.loading = true
        const destroySectionResource = new Resource('ndpa/clauses/destroy-section')
        destroySectionResource.destroy(row.id)
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
