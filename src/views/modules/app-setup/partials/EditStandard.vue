<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Standard
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
                label-for="v-standard"
              >
                <el-select
                  v-model="form.consulting_id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(consulting, index) in consultings"
                    :key="index"
                    :value="consulting.id"
                    :label="consulting.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Update Standard"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="example: ISO 27001"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <br>
              <b-form-group
                label="Select Extra Activities"
                label-for="v-activities"
              >
                <el-select
                  v-model="form.assessment_activities"
                  style="width: 100%"
                  multiple
                >
                  <el-option
                    v-for="(activity, index) in activities"
                    :key="index"
                    :value="activity.value"
                    :label="activity.label"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <!-- Level Name -->
            <!-- <b-col cols="12">
              <b-form-group
                label="Standard Description"
                label-for="v-level_group"
              >
                <b-form-textarea
                  v-model="form.description"
                  placeholder="Briefly describe this standard"
                />
              </b-form-group>
            </b-col> -->
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
                class="mr-1"
                @click="update()"
              >
                Update
              </b-button>
            </b-col>
            <b-col
              v-if="error"
              cols="12"
            >
              <b-alert
                variant="danger"
                show
              >
                <div class="alert-body">
                  <span><strong>{{ error_message }}</strong></span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // BFormTextarea,
    BAlert,
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
    prop: 'isEditStandardSidebarActive',
    event: 'update:is-edit-standard-sidebar-active',
  },
  props: {
    isEditStandardSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedStandard: {
      type: Object,
      default: () => (null),
    },
    consultings: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        consulting_id: '',
        description: '',
        assessment_activities: [],
      },
      loading: false,
      error: false,
      error_message: '',
    }
  },
  computed: {
    activities() {
      return this.$store.getters.assessmentActivity
    },
  },
  created() {
    this.formatForm()
  },
  methods: {
    formatForm() {
      const app = this
      const assessmentActivity = app.selectedStandard.assessment_activities
      const assessmentActivityArray = (assessmentActivity !== null) ? assessmentActivity.split('|') : null
      this.form.id = this.selectedStandard.id
      this.form.name = this.selectedStandard.name
      this.form.consulting_id = this.selectedStandard.consulting_id
      this.form.description = this.selectedStandard.description
      this.form.assessment_activities = assessmentActivityArray
    },
    update() {
      const app = this
      app.loading = true
      const updateCurriculumSetupResource = new Resource('standards/update')
      const param = app.form
      updateCurriculumSetupResource.update(param.id, param)
        .then(response => {
          app.loading = false
          app.$emit('update', response)
          app.$emit('update:is-edit-standard-sidebar-active', false)
        }).catch(() => {
          app.$alert('An error occured. A duplicate entry is probably detected.')
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
