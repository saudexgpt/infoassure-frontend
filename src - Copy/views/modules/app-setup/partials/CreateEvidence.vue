<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateEvidenceSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-evidence-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Evidence
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
                label="Select Unit"
                label-for="v-evidence"
              >
                <el-select
                  v-model="selectedConsulting"
                  value-key="id"
                  style="width: 100%"
                  @input="setStandards()"
                >
                  <el-option
                    v-for="(consulting, index) in consultings"
                    :key="index"
                    :value="consulting"
                    :label="consulting.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Standard"
                label-for="v-evidence"
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
            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Evidence Title"
                label-for="v-title"
              >
                <b-form-input
                  v-model="form.title"
                  placeholder="Enter Evidence Title"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Upload Type"
                label-for="v-upload_type"
              >
                <el-select
                  v-model="form.upload_type"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(upload_type, index) in upload_types"
                    :key="index"
                    :value="upload_type"
                    :label="upload_type.toUpperCase()"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.upload_type === 'multiple'"
              cols="12"
            >
              <b-form-group
                label="Expected sub-document titles"
                label-for="v-sub_document_titles"
              >
                <b-form-input
                  v-model="form.sub_document_titles"
                  placeholder="example: Document Title 1|Document Title 2|Document Title 3"
                />
              </b-form-group><br>
              <small>You can enter multiple expected document title, just separate them with a vertical bar <code>|</code></small>
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
    prop: 'isCreateEvidenceSidebarActive',
    event: 'update:is-create-evidence-sidebar-active',
  },
  props: {
    isCreateEvidenceSidebarActive: {
      type: Boolean,
      required: true,
    },
    consultings: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      form: {
        title: '',
        consulting_id: '',
        standard_id: '',
        upload_type: 'single',
        sub_document_titles: '',
      },
      upload_types: ['single', 'multiple'],
      selectedConsulting: {},
      standards: [],
      loading: false,
    }
  },
  methods: {
    setStandards() {
      const app = this
      app.form.consulting_id = app.selectedConsulting.id
      app.standards = app.selectedConsulting.standards
    },
    submit() {
      const app = this
      app.loading = true
      const saveEvidenceResource = new Resource('evidence/store')
      const param = app.form
      saveEvidenceResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response)
          app.$emit('update:is-create-evidence-sidebar-active', false)
        }).catch(error => {
          app.loading = false
          app.$message(error)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
