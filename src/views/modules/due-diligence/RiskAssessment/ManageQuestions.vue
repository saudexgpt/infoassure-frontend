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
    <div
      v-else
      v-loading="loading"
    >
      <div slot="header">
        <b-row>
          <b-col
            cols="6"
          >
            <h4>Manage Requirements</h4>
          </b-col>
          <b-col
            cols="6"
          >
            <span class="pull-right">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateQuestionSidebarActive = true"
              >
                <feather-icon
                  icon="PlusIcon"
                  class="mr-50"
                />
                <span class="align-middle">Create New</span>
              </b-button>
              &nbsp;
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-secondary"
                @click="showImportQuestionModal = true"
              >
                <feather-icon
                  icon="CornerRightDownIcon"
                  class="mr-50"
                />
                <span class="align-middle">Import</span>
              </b-button>
              &nbsp;
              <!-- <b-button
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
              </b-button> -->
            </span>
          </b-col>
        </b-row>
      </div>
      <hr>
      <!-- table -->
      <!-- <span>Click on the <feather-icon
        icon="PlusIcon"
        class="mr-50"
      /> sign to view questions</span> -->
      <el-collapse
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
                    <div style="background: #333333; color: #ffffff; padding: 10px; border-radius: 5px">
                      <p>Question: {{ scope.row.question }}</p>
                    </div>

                    <p v-if="scope.row.key !== null">
                      Key/Hint: {{ scope.row.key }}
                    </p>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </aside>
        </el-collapse-item>
      </el-collapse>
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
      <el-drawer
        title="Import Question"
        :visible.sync="showImportQuestionModal"
        direction="ttb"
        size="100%"
        :destroy-on-close="true"
        :before-close="updateTable"
      >
        <!-- <template slot="title">
          <h2>Subscribe from the list of packages</h2>
        </template> -->

        <import-default-question />
      </el-drawer>
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
import ImportDefaultQuestion from './partials/ImportDefaultQuestion.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    CreateQuestion,
    CreateBulkQuestion,
    EditQuestion,
    BButton,
    ImportDefaultQuestion,
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
      showImportQuestionModal: false,
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
      savedCategories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      selectedStandard: '',
      clauses: [],
      query: {
        client_id: '',
      },
      total: 0,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  created() {
    setTimeout(() => {
      this.fetchQuestions()
    }, 500)
    // this.fetchQuestions()
  },
  methods: {
    checkPermission,
    fetchQuestions() {
      const app = this
      app.showImportQuestionModal = false
      app.loading = true
      const fetchQuestionsResource = new Resource('vdd/questions')
      fetchQuestionsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.categorized_questions = response.questions
          // eslint-disable-next-line no-restricted-syntax
          for (const key in app.categorized_questions) {
            if (Object.prototype.hasOwnProperty.call(app.categorized_questions, key)) {
              app.savedCategories.push(key)
            }
          }
          // app.total = response.questions.total
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
        app.loading = true
        const destroyQuestionsResource = new Resource('vdd/questions/destroy')
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
