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
        @save="updateTable"
      />
    </div>
    <div v-else>
      <div slot="header">
        <b-row>
          <b-col
            cols="6"
          >
            <h4>Manage Vendor Due Diligence Questions</h4>
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
              &nbsp;
              <b-button
                v-if="checkPermission(['create-gap assessment'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-dark"
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
      <el-row
        v-if="loading"
        :gutter="15"
      >
        <el-col
          v-for="(count, count_index) in 5"
          :key="count_index"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="24"
        >
          <el-card>
            <el-skeleton
              :loading="loading"
              :rows="1"
              animated
            />
          </el-card>
        </el-col>
      </el-row>
      <el-collapse
        v-if="!loading"
        accordion
      >
        <el-collapse-item
          v-for="(questions, index) in categorized_questions"
          :key="index"
          :name="index"
        >
          <template slot="title">
            <strong>{{ index }}</strong>
          </template>
          <aside>
            <el-table
              :data="questions"
              style="width: 100%"
            >
              <el-table-column
                label="Action"
                width="200"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                  >Edit</el-button>
                  <el-button
                    :loading="loadDelete"
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >Delete</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="Audit Question"
                prop="question"
              >
                <template slot-scope="scope">
                  <div>
                    <div style="background: #f0f0f0; color: #000000; padding: 10px; border-radius: 5px">
                      <p>{{ scope.row.question }}</p>
                    </div>

                    <p v-if="scope.row.key !== null">
                      Key/Hint: {{ scope.row.key }}
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Answer Type"
                prop="answer_type"
                width="200"
              />
            </el-table>
          </aside>
        </el-collapse-item>
      </el-collapse>
      <el-empty
        v-if="categorized_questions.length < 1"
        description="No data available"
      />
      <create-question
        v-if="isCreateQuestionSidebarActive"
        v-model="isCreateQuestionSidebarActive"
        @save="updateTable"
      />
      <edit-question
        v-if="isEditQuestionSidebarActive"
        v-model="isEditQuestionSidebarActive"
        :selected-question="editable_row"
        @update="updateTable"
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
// import Pagination from '@/views/components/Pagination-main/index.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    // Pagination,
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
      loadDelete: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'domain',
        'question',
        'key',
        'action',
      ],

      options: {
        headings: {
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: ['domain'],
        // filterable: false,
        filterable: [
          'domain', 'question',
        ],
      },
      categorized_questions: [],
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
    this.fetchQuestions()
  },
  methods: {
    checkPermission,
    fetchQuestions() {
      const app = this
      app.loading = true
      const fetchQuestionsResource = new Resource('vdd/questions/fetch-default-questions')
      fetchQuestionsResource.list()
        .then(response => {
          app.loading = false
          app.categorized_questions = response.questions
        })
    },
    updateTable() {
      const app = this
      app.fetchQuestions()
    },
    handleEdit(index, row) {
      const app = this
      // const editableRow = selected_row;
      app.editable_row = row
      app.isEditQuestionSidebarActive = true
      // console.log(index, row)
    },
    handleDelete(index, row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loadDelete = true
        const destroyQuestionsResource = new Resource('vdd/questions/destroy-default-question')
        destroyQuestionsResource.destroy(row.id)
          .then(() => {
            app.$message('Action Successful')
            app.fetchQuestions()
            app.loadDelete = false
          })
      }
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
