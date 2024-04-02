<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateBusinessProcessSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-business-process-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Business Process
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
                label-for="v-business-process"
              >
                <el-select
                  v-model="selectedClient"
                  value-key="id"
                  placeholder="Select Client"
                  style="width: 100%;"
                  @input="fetchBusinessUnits()"
                >
                  <el-option
                    v-for="(client, index) in clients"
                    :key="index"
                    :value="client"
                    :label="client.name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label-for="v-business-process"
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
              cols="12"
            >
              <b-form-group
                label-for="v-name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="Process Name"
                  style="width: 100%;"
                />
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-description"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Process Description"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-roles"
              >
                <small>Role(s) responsible for business process. (Separate multiple by a comma)</small>
                <el-input
                  v-model="form.roles_responsible"
                  placeholder="Role(s) responsible for business process. (Separate multiple by a comma)"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-no_of_people_involved"
              >
                <small>Number of individuals involved in performing the business process</small>
                <el-input
                  v-model="form.no_of_people_involved"
                  type="number"
                  placeholder="No. of people involved"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-minimum_no_of_people_involved"
              >
                <small>Minimum number of people that can carry out this process that would still make economic sense</small>
                <el-input
                  v-model="form.minimum_no_of_people_involved"
                  type="number"
                  placeholder="Minimum number of people that can carry out this process that would still make economic sense"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-product_or_service_delivered"
              >
                <el-input
                  v-model="form.product_or_service_delivered"
                  placeholder="Product or Service being delivered"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-regulatory_obligations"
              >
                <el-input
                  v-model="form.regulatory_obligations"
                  placeholder="Legal, Regulatory and Contractual Obligations"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-applications_used"
              >
                <el-input
                  v-model="form.applications_used"
                  placeholder="Applications used by process."
                  style="width: 100%;"
                />
                <small>(Separate multiple by a comma)</small>
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-business_units_depended_on"
              >
                <el-select
                  v-model="form.business_units_depended_on"
                  multiple
                  placeholder="Which Business Units are you dependent on"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :disabled="business_unit.id === form.business_unit_id"
                    :value="business_unit.unit_name"
                    :label="business_unit.unit_name"
                  />
                </el-select>
              </b-form-group>
              <br>
            </b-col>

            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-processes_depended_on"
              >
                <el-input
                  v-model="form.processes_depended_on"
                  type="textarea"
                  placeholder="Which Business Processes are you dependent on in the Business Unit(s) listed above"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>

            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-key_vendors_or_external_dependencies"
              >
                <el-input
                  v-model="form.key_vendors_or_external_dependencies"
                  type="textarea"
                  placeholder="Who are your Key vendors or External dependencies"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-vital_non_electronic_records"
              >
                <el-input
                  v-model="form.vital_non_electronic_records"
                  placeholder="Vital Non-Electronic Records
"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-vital_electronic_records"
              >
                <el-input
                  v-model="form.vital_electronic_records"
                  placeholder="Vital Electronic Records"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-alternative_workaround_during_system_failure"
              >
                <el-input
                  v-model="form.alternative_workaround_during_system_failure"
                  placeholder="Alternative Workarounds during system failure"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-key_individuals_process_depends_on"
              >
                <el-input
                  v-model="form.key_individuals_process_depends_on"
                  type="textarea"
                  placeholder="Are there important key individuals this process is dependent on"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-peak_periods"
              >
                <el-input
                  v-model="form.peak_periods"
                  type="textarea"
                  placeholder="Peak Period"
                  style="width: 100%;"
                />
                <small>Indicate specific periods that are more critical than others (days, weeks, months, quarter)</small>
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="12"
            >
              <b-form-group
                label-for="v-remote_working"
              >
                <el-input
                  v-model="form.remote_working"
                  type="textearea"
                  placeholder="Remote Working"
                  style="width: 100%;"
                />
                <small>How long can this activity be performed at an acceptable level from home?</small>
                <br>
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
    prop: 'isCreateBusinessProcessSidebarActive',
    event: 'update:is-create-business-process-sidebar-active',
  },
  props: {
    isCreateBusinessProcessSidebarActive: {
      type: Boolean,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
    // registeredBusinessProcesss: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      business_units: [],
      form: {
        client_id: '',
        business_unit_id: '',
        name: '',
        description: '',
        roles_responsible: '',
        no_of_people_involved: '',
        minimum_no_of_people_involved: '',
        product_or_service_delivered: '',
        regulatory_obligations: '',
        applications_used: '',
        business_units_depended_on: [],
        processes_depended_on: '',
        key_vendors_or_external_dependencies: '',
        vital_non_electronic_records: '',
        vital_electronic_records: '',
        alternative_workaround_during_system_failure: '',
        key_individuals_process_depends_on: '',
        peak_periods: '',
        remote_working: '',
      },
      loading: false,
      selectedClient: {},
    }
  },
  created() {
  },
  methods: {
    fetchBusinessUnits() {
      const app = this
      app.form.business_unit_id = ''
      const fetchBusinessUnitsResource = new Resource('bia/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    submit() {
      const app = this
      app.loading = true
      const saveBusinessProcessResource = new Resource('bia/save-business-processes')
      const param = { client_id: app.selectedClient.id, business_processes: [app.form] }
      saveBusinessProcessResource.store(param)
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
            description: '',
            roles_responsible: '',
            no_of_people_involved: '',
            minimum_no_of_people_involved: '',
            product_or_service_delivered: '',
            regulatory_obligations: '',
            applications_used: '',
            business_units_depended_on: [],
            processes_depended_on: '',
            key_vendors_or_external_dependencies: '',
            vital_non_electronic_records: '',
            vital_electronic_records: '',
            alternative_workaround_during_system_failure: '',
            key_individuals_process_depends_on: '',
            peak_periods: '',
            remote_working: '',
          }
          app.$emit('save')
          // app.$emit('update:is-create-business-process-sidebar-active', false)
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
