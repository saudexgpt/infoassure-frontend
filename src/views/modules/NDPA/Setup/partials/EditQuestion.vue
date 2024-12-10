<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditQuestionSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-question-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Question
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
                  placeholder="Give question for the selected clause here..."
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
                label="Hint"
                label-for="v-hint"
              >
                <el-input
                  v-model="form.hint"
                  type="textarea"
                  placeholder="Give hint for further insight to questions"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
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
            </b-col>
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
                @click="update()"
              >
                Update
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Resource from '@/api/resource'

export default {
  components: {
    // BFormTextarea,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEditQuestionSidebarActive',
    event: 'update:is-edit-question-sidebar-active',
  },
  props: {
    isEditQuestionSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedQuestion: {
      type: Object,
      default: () => (null),
    },
    clauses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        section_id: '',
        clause_id: '',
        question: '',
        hint: '',
        question_type: '',
        answer_type: '',
        upload_evidence: 0,
        can_have_exception: 1,
      },
      selectedClause: {},
      sections: [],
      loading: false,
      error: false,
      error_message: '',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  created() {
    this.form = this.selectedQuestion
    const index = this.clauses.map(object => object.id).indexOf(this.form.clause_id)
    this.selectedClause = this.clauses[index]
    this.setSection()
  },
  methods: {
    setSection() {
      const app = this
      app.form.clause_id = app.selectedClause.id
      app.sections = app.selectedClause.sections
    },
    update() {
      const app = this
      app.loading = true
      const updateCurriculumSetupResource = new Resource('ndpa/questions/update')
      const param = app.form
      updateCurriculumSetupResource.update(param.id, param)
        .then(response => {
          app.loading = false
          app.$emit('update', response)
          app.$emit('update:is-edit-question-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
