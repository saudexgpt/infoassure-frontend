<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateClauseSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-clause-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Clauses
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
                  v-model="form.standard_id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(standard, index) in standards"
                    :key="index"
                    :value="standard.id"
                    :label="standard.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Enter Clauses"
                label-for="v-level_group"
              >
                <small style="color: brown">You can enter multiple clauses for the selected standard, just separate them with a vertical bar, <code>|</code></small>
                <b-form-input
                  v-model="form.names"
                  placeholder="Enter Clauses Here"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Will clauses stated above have audit questions for clients?"
              >
                <el-radio-group
                  v-model="form.will_have_audit_questions"
                  size="mini"
                >
                  <el-radio
                    :label="1"
                    border
                  >
                    YES
                  </el-radio>
                  <el-radio
                    :label="0"
                    border
                  >
                    NO
                  </el-radio>
                </el-radio-group>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Will clauses stated above require document uploads from clients?"
              >
                <el-radio-group
                  v-model="form.requires_document_upload"
                  size="mini"
                >
                  <el-radio
                    :label="1"
                    border
                  >
                    YES
                  </el-radio>
                  <el-radio
                    :label="0"
                    border
                  >
                    NO
                  </el-radio>
                </el-radio-group>
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
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateClauseSidebarActive',
    event: 'update:is-create-clause-sidebar-active',
  },
  props: {
    isCreateClauseSidebarActive: {
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
        names: '',
        standard_id: '',
        requires_document_upload: 1,
        will_have_audit_questions: 1,
      },
      loading: false,
    }
  },
  methods: {
    submit() {
      const app = this
      app.loading = true
      const saveCurriculumSetupResource = new Resource('clauses/save')
      const param = app.form
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response)
          app.$emit('update:is-create-clause-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
