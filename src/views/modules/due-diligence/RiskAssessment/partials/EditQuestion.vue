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
                label="Domain/Category"
                label-for="v-domain"
              >

                <el-input
                  v-model="form.domain"
                  style="width: 100%"
                  placeholder="Input domain"
                />
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
                  placeholder="Type questions here..."
                  :config="editorConfig"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Key/Hint to question"
                label-for="v-upload_evidence"
              >

                <el-input
                  v-model="form.key"
                  style="width: 100%"
                  placeholder="Input question key/insight"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Answer Type"
                label-for="v-answer_type"
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
                label="Does question need evidence/reference document upload?"
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
  },
  data() {
    return {
      form: {
        question: '',
        key: '',
      },
      clauses: [],
      loading: false,
      error: false,
      error_message: '',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  mounted() {
    this.form = this.selectedQuestion
  },
  methods: {
    update() {
      const app = this
      app.loading = true
      const updateQuestionResource = new Resource('vdd/questions/update')
      const param = app.form
      updateQuestionResource.update(param.id, param)
        .then(response => {
          app.loading = false
          app.$message('Update Successful')
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
