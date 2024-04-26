<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateRiskSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-risk-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Risk
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
                label-for="v-risk"
              >
                <el-select
                  v-model="form.client_id"
                  placeholder="Select Client"
                  style="width: 100%;"
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
            <b-col
              v-if="form.client_id !== ''"
              cols="12"
            >
              <b-form-group
                label-for="v-risk"
              >
                <el-input
                  v-model="form.risk_unique_id"
                  placeholder="Risk ID"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.client_id !== ''"
              cols="12"
            >
              <b-form-group
                label-for="v-risk"
              >
                <el-input
                  v-model="form.type"
                  placeholder="Risk Type"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              v-if="form.client_id !== ''"
              cols="12"
            >
              <b-form-group
                label-for="v-risk"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Risk Description"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              v-if="form.client_id !== ''"
              cols="12"
            >
              <b-form-group
                label-for="v-risk"
              >
                <el-input
                  v-model="form.outcome"
                  placeholder="Impact/Outcome"
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
    prop: 'isCreateRiskSidebarActive',
    event: 'update:is-create-risk-sidebar-active',
  },
  props: {
    isCreateRiskSidebarActive: {
      type: Boolean,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
    // registeredRisks: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      form: {
        client_id: '',
        risk_unique_id: '',
        type: '',
        description: '',
        outcome: '',
      },
      loading: false,
      consultings: [],
      selectedConsulting: {},
    }
  },
  created() {
  },
  methods: {
    submit() {
      const app = this
      app.loading = true
      const saveRisksResource = new Resource('risk-assessment/save-risk')
      saveRisksResource.store(app.form)
        .then(() => {
          app.loading = false
          // app.$message('Action Successful')
          app.$notify({
            title: 'Action Successful',
          })
          app.form = {
            client_id: '',
            risk_unique_id: '',
            type: '',
            description: '',
            outcome: '',
          }
          app.$emit('save')
          // app.$emit('update:is-create-risk-sidebar-active', false)
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
