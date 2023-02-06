<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Questions</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="checkPermission(['create-gap assessment'])"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateQuestionSidebarActive = true"
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
      v-model="questions"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          v-if="checkPermission(['update-gap assessment'])"
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </b-button>
        <b-button
          v-if="checkPermission(['delete-gap assessment'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <el-row :gutter="20">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="fetchQuestions"
      />
    </el-row>
    <create-question
      v-if="isCreateQuestionSidebarActive"
      v-model="isCreateQuestionSidebarActive"
      :standards="standards"
      @save="updateTable"
    />
    <edit-question
      v-if="isEditQuestionSidebarActive"
      v-model="isEditQuestionSidebarActive"
      :standards="standards"
      :selected-question="editable_row"
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
import CreateQuestion from './partials/CreateQuestion.vue'
import EditQuestion from './partials/EditQuestion.vue'
import Pagination from '@/views/components/Pagination-main/index.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    Pagination,
    CreateQuestion,
    EditQuestion,
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
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'question',
        'standard.name',
        'clause.name',
        // 'question_type',
        'answer_type',
        'action',
      ],

      options: {
        headings: {
          'standard.name': 'Standard',
          'clause.name': 'Clause',
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
          'clause.name',
        ],
        // filterable: false,
        filterable: [
          'name',
          'standard.name',
          'clause.name',
        ],
      },
      questions: [],
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
  created() {
    this.fetchQuestions()
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    fetchStandards() {
      const app = this
      const fetchStandardsResource = new Resource('standards/with-clauses')
      fetchStandardsResource.list()
        .then(response => {
          app.standards = response.standards
        })
    },
    fetchQuestions() {
      const app = this
      const { limit, page } = this.query
      app.loading = true
      const fetchQuestionsResource = new Resource('questions')
      fetchQuestionsResource.list(this.query)
        .then(response => {
          app.questions = response.questions.data
          app.questions.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.questions.total
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchQuestions()
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditQuestionSidebarActive = true
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyQuestionsResource = new Resource('questions/destroy')
        destroyQuestionsResource.destroy(row.id)
          .then(() => {
            app.fetchQuestions()
            app.loading = false
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchQuestions()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
