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
                label="Select Standard"
                label-for="v-standard"
              >
                <el-select
                  v-model="selectedStandard"
                  value-key="id"
                  style="width: 100%"
                  @input="setQuestion()"
                >
                  <el-option
                    v-for="(standard, index) in standards"
                    :key="index"
                    :value="standard"
                    :label="standard.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Clause"
                label-for="v-clause"
              >
                <el-select
                  v-model="form.clause_id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(clause, index) in clauses"
                    :key="index"
                    :value="clause.id"
                    :label="clause.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <!-- <b-col cols="12">
              <b-form-group
                label="Consulting Type"
              >
                <el-select
                  v-model="form.question_type"
                  style="width: 100%"
                >
                  <el-option
                    value="process_consulting"
                    label="Process Consulting"
                  />
                  <el-option
                    value="technical_consulting"
                    label="Technical Consulting"
                  />
                </el-select>
              </b-form-group>
            </b-col> -->
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
                @click="submit()"
              >
                Submit
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
    BSidebar,
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
    standards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        standard_id: '',
        clause_id: '',
        question: '',
        question_type: '',
        answer_type: '',
        upload_evidence: 0,
        can_have_exception: 1,
      },
      selectedStandard: {},
      clauses: [],
      loading: false,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  methods: {
    setQuestion() {
      const app = this
      app.form.standard_id = app.selectedStandard.id
      app.clauses = app.selectedStandard.clauses
    },
    submit() {
      const app = this
      app.loading = true
      const saveQuestionSetupResource = new Resource('questions/save')
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
