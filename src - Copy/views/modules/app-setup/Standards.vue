<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Standards</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-standards'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateStandardSidebarActive = true"
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

    <v-client-table
      v-model="standards"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          v-if="checkPermission(['update-standards'])"
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </b-button>
        <b-button
          v-if="checkPermission(['delete-standards'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <create-standards
      v-if="isCreateStandardSidebarActive"
      v-model="isCreateStandardSidebarActive"
      :consultings="consultings"
      @save="updateTable"
    />
    <edit-standard
      v-if="isEditStandardSidebarActive"
      v-model="isEditStandardSidebarActive"
      :selected-standard="editable_row"
      :consultings="consultings"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateStandards from './partials/CreateStandards.vue'
import EditStandard from './partials/EditStandard.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateStandards,
    EditStandard,
    BButton,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      isCreateStandardSidebarActive: false,
      isEditStandardSidebarActive: false,
      pageLength: 10,
      dir: false,
      // columns: [
      //   {
      //     label: '#',
      //     field: 'id',
      //   },
      //   {
      //     label: 'Name',
      //     field: 'name',
      //   },
      //   {
      //     label: 'Curriculum',
      //     field: 'curriculum_category',
      //   },
      //   {
      //     label: 'Action',
      //     field: 'action',
      //   },
      // ],
      columns: [
        'name',
        'consulting.name',
        'assessment_activities',
        // 'description',
        'action',
      ],

      options: {
        headings: {
          'consulting.name': 'Unit',
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
          'name', 'consulting.name',
        ],
        // filterable: false,
        filterable: [
          'name', 'consulting.name',
        ],
      },
      standards: [],
      consultings: [],
      editable_row: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchStandards()
    this.fetchConsultings()
  },
  methods: {
    checkPermission,
    fetchConsultings() {
      const app = this
      app.loading = true
      const fetchConsultingsResource = new Resource('consultings')
      fetchConsultingsResource.list()
        .then(response => {
          app.consultings = response.consultings
          app.loading = false
        })
    },
    fetchStandards() {
      const app = this
      app.loading = true
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list()
        .then(response => {
          app.standards = response.standards
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchStandards()
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditStandardSidebarActive = true
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyStandardsResource = new Resource('standards/destroy')
        destroyStandardsResource.destroy(row.id)
          .then(() => {
            app.fetchStandards()
            app.loading = false
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchStandards()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
