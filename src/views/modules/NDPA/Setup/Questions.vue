<template>
  <el-card>
    <div v-if="uploadBulk">
      <b-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="gradient-danger"
        @click="uploadBulk = false"
      >
        <feather-icon
          icon="ArrowBackIcon"
          class="mr-50"
        />
        <span class="align-middle">Back</span>
      </b-button>
      <create-bulk-question
        :clauses="clauses"
        @save="updateTable"
      />
    </div>
    <div v-else>
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
                variant="outline-primary"
                @click="isCreateQuestionSidebarActive = true"
              >
                <feather-icon
                  icon="PlusIcon"
                  class="mr-50"
                />
                <span class="align-middle">Create</span>
              </b-button>
              &nbsp;
              <b-button
                v-if="checkPermission(['create-gap assessment'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-secondary"
                @click="uploadBulk = true"
              >
                <feather-icon
                  icon="UploadIcon"
                  class="mr-50"
                />
                <span class="align-middle">Upload Bulk Questions</span>
              </b-button>
            </span>
          </b-col>
        </b-row>
      </div>
      <hr>
      <!-- table -->
      <aside>
        <el-row :gutter="10">
          <el-col :lg="8">
            <el-select
              v-model="query.clause_id"
              style="width: 100%"
              filterable
              placeholder="Select Clause"
              @input="fetchQuestions()"
            >
              <el-option
                v-for="(clause, index) in clauses"
                :key="index"
                :value="clause.id"
                :label="`${clause.name} - ${clause.description}`"
              />
            </el-select>
          </el-col>
        <!-- <el-col :lg="6">
          <el-button
            type="primary"
            :disabled="query.clause_id === ''"
            @click="fetchQuestions()"
          >
            Fetch
          </el-button>
        </el-col> -->
        </el-row>
      </aside>
      <!-- <span>Click on the <feather-icon
        icon="PlusIcon"
        class="mr-50"
      /> sign to view questions</span> -->
      <v-client-table
        v-model="questions"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="question"
          slot-scope="{row}"
        >
          <strong>{{ (row.section) ? `${row.section.name} - ${row.section.description}` : '' }}</strong>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="row.question" />
          <!-- <ckeditor
            v-model="row.question"
            :editor="editor"
            :config="editorConfig"
            disabled
          /> -->
          <em>{{ (row.hint !== null) ? `Hint: ${row.hint}` : '' }}</em>
        </div>
        <div
          slot="upload_evidence"
          slot-scope="{row}"
        >
          {{ (row.upload_evidence === 1) ? 'Yes' : 'No' }}
        </div>
        <div
          slot="can_have_exception"
          slot-scope="{row}"
        >
          {{ (row.can_have_exception === 1) ? 'Yes' : 'No' }}
        </div>
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
      <!-- <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchQuestions"
        />
      </el-row> -->
      <create-question
        v-if="isCreateQuestionSidebarActive"
        v-model="isCreateQuestionSidebarActive"
        @save="updateTable"
      />
      <edit-question
        v-if="isEditQuestionSidebarActive"
        v-model="isEditQuestionSidebarActive"
        :selected-question="editable_row"
        @update="updateEditedTableRow"
      />
    </div>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Resource from '@/api/resource'
import CreateQuestion from './partials/CreateQuestion.vue'
import EditQuestion from './partials/EditQuestion.vue'
import CreateBulkQuestion from './partials/CreateBulkQuestion.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateQuestion,
    CreateBulkQuestion,
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
      uploadBulk: false,
      loading: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'question',
        // 'clause.name',
        // 'question_type',
        'answer_type',
        'upload_evidence',
        'can_have_exception',
      ],

      options: {
        headings: {
          'clause.name': 'Clause',
          upload_evidence: 'Can Upload Evidence',
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
          'question',
        ],
        // filterable: false,
        filterable: [
          'question',
        ],
      },
      questions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      selectedStandard: '',
      clauses: [],
      query: {
        page: 1,
        limit: 10,
        clause_id: '',
      },
      total: 0,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  created() {
    // this.fetchQuestions()
    this.fetchClauses()
  },
  methods: {
    checkPermission,
    // fetchStandards() {
    //   const app = this
    //   const fetchStandardsResource = new Resource('standards/with-clauses')
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
    fetchQuestions() {
      const app = this
      app.loading = true
      const fetchQuestionsResource = new Resource('ndpa/questions')
      fetchQuestionsResource.list(this.query)
        .then(response => {
          app.questions = response.questions
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
        const destroyQuestionsResource = new Resource('ndpa/questions/destroy')
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
