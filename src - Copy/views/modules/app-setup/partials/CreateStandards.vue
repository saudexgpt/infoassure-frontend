<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Standards
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
                label="Enter Name(s) of Standard"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.names"
                  placeholder="example: ISO 27001|ISO 22301|ISO 20000"
                />
              </b-form-group>
              <small>You can enter multiple standard names, just separate them with a vertical bar <code>|</code></small>
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
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active',
  },
  props: {
    isCreateStandardSidebarActive: {
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
        names: '',
        consulting_id: '',
        assessment_activities: [],
      },
      loading: false,
    }
  },
  computed: {
    activities() {
      return this.$store.getters.assessmentActivity
    },
  },
  methods: {
    submit() {
      const app = this
      app.loading = true
      const saveCurriculumSetupResource = new Resource('standards/save')
      const param = app.form
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response)
          app.$emit('update:is-create-standard-sidebar-active', false)
        }).catch(error => {
          app.loading = false
          app.$message(error.response.data.error)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
