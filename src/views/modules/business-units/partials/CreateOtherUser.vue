<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-business-unit-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create User Access
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
                  v-model="form.client_id"
                  placeholder="Select Client"
                  style="width: 100%;"
                  @input="fetchBusinessUnits()"
                >
                  <el-option
                    v-for="(client, index) in clients"
                    :key="index"
                    :value="client.id"
                    :label="client.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
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
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :value="business_unit.id"
                    :label="business_unit.unit_name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.business_unit_id !== ''"
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
              v-if="form.business_unit_id !== ''"
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
    prop: 'isCreateActive',
    event: 'update:is-create-business-unit-sidebar-active',
  },
  props: {
    isCreateActive: {
      type: Boolean,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
    // registeredBusinessUnits: {
    //   type: Array,
    //   required: true,
    // },
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
    if (this.clients.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      this.form.client_id = this.clients[0].id
      this.fetchBusinessUnits()
    }
  },
  methods: {
    fetchBusinessUnits() {
      const app = this
      app.form.business_unit_id = ''
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    submit() {
      const app = this
      app.loading = true
      const saveBusinessUnitsResource = new Resource('business-units/save-other-users')
      const param = app.form
      saveBusinessUnitsResource.store(param)
        .then(() => {
          app.loading = false
          // app.$message('Action Successful')
          app.$notify({
            title: 'Action Successful',
          })
          app.form = {
            client_id: '',
            business_unit_id: '',
            name: '',
            email: '',
          }
          app.$emit('save')
          // app.$emit('update:is-create-business-unit-sidebar-active', false)
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
