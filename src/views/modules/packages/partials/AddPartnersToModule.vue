<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreatePackageModuleSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-package-module-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Assign Partners to {{ selectedPackage.name }}
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

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Select Partners"
                label-for="v-partners"
              >
                <el-select
                  v-model="form.partner_ids"
                  filterable
                  multiple
                  style="width: 100%"
                >
                  <el-option
                    v-for="(each_partner, index) in partners"
                    :key="index"
                    :label="each_partner.name"
                    :value="each_partner.id"
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
  BSidebar, BRow, BCol, BFormGroup, BButton, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BAlert,
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
    prop: 'isCreatePackageModuleSidebarActive',
    event: 'update:is-create-package-module-sidebar-active',
  },
  props: {
    isCreatePackageModuleSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedPackage: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        module_id: '',
        partner_ids: [],
      },
      partners: [],
      loading: false,
      error: false,
      error_message: '',
    }
  },
  created() {
    this.fetchPartners()
  },
  methods: {
    fetchPartners() {
      const app = this
      const fetchModulesResource = new Resource('partners')
      fetchModulesResource.list({ option: 'all' })
        .then(response => {
          app.partners = response.partners
        })
    },
    submit() {
      const app = this
      app.loading = true
      const savePackageModuleResource = new Resource('packages/activate-partners-module')
      const param = app.form
      param.module_id = app.selectedPackage.id
      savePackageModuleResource.store(param)
        .then(response => {
          app.loading = false
          app.$message('Successful')
          app.$emit('save', response)
          app.$emit('update:is-create-package-module-sidebar-active', false)
        }).catch(error => {
          app.error = true
          app.error_message = error
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
