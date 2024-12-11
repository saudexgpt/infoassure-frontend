<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateQuestionSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-question-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Questions
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="loading">

            <b-col cols="12">
              <b-form-group
                label="Select Requirement"
                label-for="v-clause"
              >
                <el-select
                  v-model="selectedClause"
                  value-key="id"
                  style="width: 100%"
                  @input="setSection()"
                >
                  <el-option
                    v-for="(clause, index) in clauses"
                    :key="index"
                    :value="clause"
                    :label="`${clause.name} - ${clause.description}`"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Section"
                label-for="v-section"
              >
                <el-select
                  v-model="form.section_id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(section, index) in sections"
                    :key="index"
                    :value="section.id"
                    :label="`${section.name} - ${section.description}`"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Answer Type"
              >
                <el-select
                  v-model="form.answer_type"
                  style="width: 100%"
                >
                  <el-option
                    value="open_ended"
                    label="Open Ended"
                  />
                  <el-option
                    value="yes-no"
                    label="Yes/No Response"
                  />
                  <el-option
                    value="both"
                    label="Both"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Type Question"
                label-for="v-question"
              >
                <!-- <b-form-textarea
                  v-model="form.question"
                  placeholder="Type questions for the selected clause here..."
                /> -->
                <ckeditor
                  id="question"
                  v-model="form.question"
                  :editor="editor"
                  placeholder="Type questions for the selected clause here..."
                  :config="editorConfig"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Expected Evidence for upload"
                label-for="v-hint"
              >
                <el-select
                  v-model="form.expected_document_template_ids"
                  placeholder="Select Applicable Evidences"
                  filterable
                  multiple
                  collapse-tags
                  style="width: 100%"
                >
                  <el-option
                    v-for="(template, index) in templates"
                    :key="index"
                    :value="template.id"
                    :label="template.title"
                  />
                </el-select>
                <!-- <a
                  href="#"
                  @click="showDocumentTemplateModal = true"
                >
                  <feather-icon
                    icon="UploadIcon"
                  />
                  Click to select expected evidences
                </a> -->
              </b-form-group>
            </b-col>
            <!-- <b-col cols="12">
              <b-form-group
                label="Needs evidence/reference document upload?"
                label-for="v-upload_evidence"
              >

                <el-switch
                  v-model="form.upload_evidence"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="Yes"
                  inactive-text="No"
                  :active-value="1"
                  :inactive-value="0"
                />
              </b-form-group>
            </b-col> -->
            <b-col cols="12">
              <b-form-group
                label="Can have exceptions?"
                label-for="v-upload_evidence"
              >

                <el-switch
                  v-model="form.can_have_exception"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="Yes"
                  inactive-text="No"
                  :active-value="1"
                  :inactive-value="0"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
    <b-modal
      v-if="showDocumentTemplateModal"
      v-model="showDocumentTemplateModal"
      title="Select the Relevant Evidence"
      centered
      size="lg"
      ok-only
      ok-title="Done"
    >
      <v-client-table
        v-model="templates"
        :columns="columns"
        :options="options"
      >
        <div
          slot="select"
          slot-scope="{row}"
        >
          <el-checkbox
            v-model="form.expected_document_template_ids"
            :label="row.id"
            border
          />
        </div>
        <div
          slot="title"
          slot-scope="{row}"
        >
          <strong>{{ row.title }}</strong>
        </div>
        <div
          slot="link"
          slot-scope="{row}"
        >
          <a
            :href="`${baseServerUrl}storage/${row.link}`"
            target="_blank"
          >
            Download Template
          </a>
        </div>
      </v-client-table>

    </b-modal>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BButton, BModal,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Resource from '@/api/resource'

export default {
  components: {
    BSidebar,
    BModal,
    BRow,
    BCol,
    BFormGroup,
    // BFormTextarea,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateQuestionSidebarActive',
    event: 'update:is-create-question-sidebar-active',
  },
  props: {
    isCreateQuestionSidebarActive: {
      type: Boolean,
      required: true,
    },
    // clauses: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      showDocumentTemplateModal: false,
      columns: [
        'select', 'title', 'link',
      ],
      options: {
        headings: {
          link: 'Link to Sample',
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
          'title',
        ],
        // filterable: false,
        filterable: [
          'title',
        ],
      },
      form: {
        name: '',
        section_id: '',
        clause_id: '',
        question: '',
        hint: '',
        question_type: '',
        answer_type: '',
        upload_evidence: 1,
        can_have_exception: 1,
        expected_document_template_ids: [],
      },
      clauses: [],
      sections: [],
      selectedClause: {},
      loading: false,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      templates: [],
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClauses()
    this.fetchDocumentTemplates()
  },
  methods: {
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
    fetchDocumentTemplates() {
      const app = this
      app.loading = true
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.query)
        .then(response => {
          app.templates = response.document_templates
          app.loading = false
        })
    },
    setSection() {
      const app = this
      app.form.clause_id = app.selectedClause.id
      app.sections = app.selectedClause.sections
    },
    submit() {
      const app = this
      app.loading = true
      const saveQuestionSetupResource = new Resource('ndpa/questions/save')
      const param = app.form
      saveQuestionSetupResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response)
          app.$emit('update:is-create-question-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
