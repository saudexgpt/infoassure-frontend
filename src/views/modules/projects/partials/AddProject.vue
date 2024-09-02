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
            Create Projects for {{ selectedClient.name }}
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
            <b-col
              v-if="form.client_id !== ''"
              cols="12"
            >
              <b-form-group
                label-for="v-standard"
              >
                <el-select
                  v-model="selectedModule"
                  placeholder="Select Activated Module"
                  filterable
                  value-key="id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(module, index) in clientActivatedModules"
                    :key="index"
                    :value="module"
                    :label="module.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="selectedModule.standards.length > 0"
              cols="12"
            >
              <b-form-group
                label-for="v-standard"
              >
                <el-select
                  v-model="form.standards"
                  placeholder="Select Project Standard"
                  filterable
                  multiple
                  style="width: 100%"
                >
                  <el-option
                    v-for="(standard, index) in selectedModule.standards"
                    :key="index"
                    :value="standard.id"
                    :label="standard.name"
                  />
                </el-select>
              </b-form-group>
              <el-alert
                type="error"
                :closable="false"
              >
                Multiple selections enabled
              </el-alert>
              <br>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                :disabled="(selectedModule.id === '') || (selectedModule.standards.length > 0 && form.standards.length < 1 && selectedModule.id !== '')"
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
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active',
  },
  props: {
    isCreateStandardSidebarActive: {
      type: Boolean,
      required: true,
    },
    // registeredStandards: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      form: {
        standards: [],
        available_module_id: '',
        client_id: '',
      },
      loading: false,
      consultings: [],
      selectedModule: {
        id: '',
        standards: [],
      },
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedModules() {
      return this.$store.getters.clientActivatedModules
    },
  },
  created() {
    this.form.client_id = this.selectedClient.id
  },
  methods: {
    // fetchConsulting() {
    //   const app = this
    //   app.loading = true
    //   const fetchConsultingsResource = new Resource('consultings')
    //   fetchConsultingsResource.list()
    //     .then(response => {
    //       app.consultings = response.consultings
    //       app.loading = false
    //     })
    // },
    submit() {
      const app = this
      app.loading = true
      const saveCurriculumSetupResource = new Resource('projects/save')
      const param = app.form
      param.available_module_id = app.selectedModule.id
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
            available_module_id: '',
            client_id: '',
          }
          app.$emit('save')
          // app.$emit('update:is-create-standard-sidebar-active', false)
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
