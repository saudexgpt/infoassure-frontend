<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isProjectSettingSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-project-setting-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Project Settings
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
                label-for="v-standard"
              >
                <label>Start Date</label>
                <el-date-picker
                  v-model="project.start_date"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Set start date"
                  style="width: 100%"
                  @input="setDate($event, project, 'start_date')"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group>
                <label>Deadline</label>
                <el-date-picker
                  v-model="project.deadline"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Set a deadline"
                  style="width: 100%"
                  :picker-options="pickerOptions2"
                  @input="setDate($event, project, 'deadline')"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group>
                <label>Project Completion Date</label>
                <el-date-picker
                  v-model="project.date_completed"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Set completion date"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                  @input="setDate($event, project, 'date_completed')"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <label>Document Uploads</label>
              <b-form-group>
                <select
                  v-model="project.allow_document_uploads"
                  @change="changeDocumentUploadRestriction(project, $event, 'allow_document_uploads')"
                >
                  <option
                    :value="0"
                    label="Disabled"
                  />
                  <option
                    :value="1"
                    label="Enabled"
                  />
                </select>
              </b-form-group>
              <br>
            </b-col>
            <!-- submit and reset -->
            <!-- <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                :disabled="form.standards.length < 1"
                @click="submit()"
              >
                Submit
              </b-button>
            </b-col> -->
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
import Resource from '@/api/resource'

export default {
  components: {
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
    prop: 'isProjectSettingSidebarActive',
    event: 'update:is-project-setting-sidebar-active',
  },
  props: {
    isProjectSettingSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedProject: {
      type: Object,
      required: true,
    },
    // registeredStandards: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        },
      },
      form: {
        standards: [],
        consulting_id: '',
        client_id: '',
      },
      loading: false,
      project: {},
      selectedConsulting: {},
    }
  },
  created() {
    this.project = this.selectedProject
  },
  methods: {
    setDate(event, project, field) {
      const app = this
      const param = { field, date: event }
      // eslint-disable-next-line no-alert
      // if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
      // app.loading = true
      const setDatesResource = new Resource('projects/set-dates')
      setDatesResource.update(project.id, param)
        .then(() => {
          app.$message('Action Successful')
          // app.fetchProjects()
          // app.loading = false
        }).catch(() => { app.loading = false })
      // }
    },
    changeDocumentUploadRestriction(project, event, field) {
      const app = this
      const { value } = event.target
      const param = { value, field }
      // eslint-disable-next-line no-alert
      if (window.confirm('Click OK to confirm')) {
        // app.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource.update(project.id, param)
          .then(() => {
            app.$message('Action Successful')
            app.fetchProjects()
            // app.loading = false
          }).catch(() => { app.loading = false })
      }
    },
    submit() {
      const app = this
      app.loading = true
      const saveCurriculumSetupResource = new Resource('projects/save')
      const param = app.form
      param.consulting_id = app.selectedConsulting.id
      saveCurriculumSetupResource.store(param)
        .then(() => {
          app.loading = false
          // app.$message('Action Successful')
          app.$notify({
            title: 'Action Successful',
            message: 'The specified project have been created for the client',
          })
          app.form = {
            standards: [],
            consulting_id: '',
            client_id: '',
          }
          app.$emit('save')
          // app.$emit('update:is-project-setting-sidebar-active', false)
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
