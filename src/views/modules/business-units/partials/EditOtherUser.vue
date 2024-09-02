<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditActive"
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
            Edit User
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
                label-for="v-business-unit"
              >
                <el-select
                  v-model="form.business_unit_id"
                  placeholder="Select Business Unit"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(business_unit, index) in businessUnits"
                    :key="index"
                    :value="business_unit.id"
                    :label="business_unit.unit_name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label="Full Name"
                label-for="v-name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="Full Name"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label="Email"
                label-for="v-email"
              >
                <el-input
                  v-model="form.email"
                  placeholder="email"
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
    prop: 'isEditActive',
    event: 'update:is-edit-business-unit-sidebar-active',
  },
  props: {
    isEditActive: {
      type: Boolean,
      required: true,
    },
    businessUnits: {
      type: Array,
      required: true,
    },
    selectedUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        client_id: '',
        business_unit_id: '',
        name: '',
        email: '',
      },
      loading: false,
      consultings: [],
      business_units: [],
      selectedConsulting: {},
    }
  },
  created() {
    this.form = this.selectedUser
  },
  methods: {
    update() {
      const app = this
      app.loading = true
      const updateUserResource = new Resource('business-units/update-other-users')
      const param = app.form
      updateUserResource.update(param.id, param)
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
