<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditBusinessUnitSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-business-unit-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Business Unit
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

              cols="12"
            >
              <b-form-group
                label="Group Name"
                label-for="v-business-unit"
              >
                <el-input
                  v-model="form.group_name"
                  placeholder="Group Name"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col

              cols="12"
            >
              <b-form-group
                label="Unit Name"
                label-for="v-business-unit"
              >
                <el-input
                  v-model="form.unit_name"
                  placeholder="Unit Name"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col

              cols="12"
            >
              <b-form-group
                label="Teams"
                label-for="v-teams"
              >
                <el-input
                  v-model="form.teams"
                  placeholder="Example: Engineering, Backend, etc"
                  style="width: 100%;"
                />
                <small>Separate multiple entries by a comma <code>,</code></small>
              </b-form-group>
            </b-col>
            <b-col

              cols="12"
            >
              <b-form-group
                label="Function Performed"
                label-for="v-business-unit"
              >
                <el-input
                  v-model="form.function_performed"
                  placeholder="Function Performed"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col

              cols="12"
            >
              <b-form-group
                label="Contact Phone"
                label-for="v-business-unit"
              >
                <el-input
                  v-model="form.contact_phone"
                  placeholder="Contact Phone"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
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
    prop: 'isEditBusinessUnitSidebarActive',
    event: 'update:is-edit-business-unit-sidebar-active',
  },
  props: {
    isEditBusinessUnitSidebarActive: {
      type: Boolean,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
    businessUnit: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        client_id: '',
        group_name: '',
        unit_name: '',
        function_performed: '',
        contact_phone: '',
        teams: '',
      },
      loading: false,
      consultings: [],
      selectedConsulting: {},
    }
  },
  created() {
    this.form = this.businessUnit
  },
  methods: {
    update() {
      const app = this
      app.loading = true
      const saveBusinessUnitsResource = new Resource('business-units/update-business-unit')
      saveBusinessUnitsResource.update(app.form.id, app.form)
        .then(() => {
          app.loading = false
          // app.$message('Action Successful')
          app.$notify({
            title: 'Action Successful',
          })
          app.$emit('update')
          // app.$emit('update:is-edit-business-unit-sidebar-active', false)
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
