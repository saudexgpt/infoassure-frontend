<template>
  <div>
    <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
      <h3 class="mb-0">
        Update Business Process
      </h3>
      <div>
        <b-button
          variant="gradient-danger"
          class="btn-icon"
          @click="$emit('updated')"
        >
          <feather-icon
            icon="XIcon"
          />
        </b-button>
      </div>
    </div>
    <div class="justify-content-between align-items-center px-2 py-1">
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        type="submit"
        variant="primary"
        class="mr-1"
        :disabled="isImportantFieldsEmpty()"
        @click="update()"
      >
        Update
      </b-button>
      <br>
      <el-collapse
        v-model="activeName"
        accordion
      >
        <el-collapse-item name="1">
          <template slot="title">
            <h4>Process Description</h4>
          </template>
          <b-row v-loading="loading">
            <b-col
              cols="6"
            >
              <b-form-group
                label="Process Title"
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
              cols="6"
            >
              <b-form-group
                label="Process Objective"
                label-for="v-description"
              >
                <el-input
                  v-model="form.objective"
                  placeholder="Process Description"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label="Process Owner"
                label-for="v-name"
              >
                <el-select
                  v-model="form.process_owner"
                  placeholder="Process Owner"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(owner, index) in team_members"
                    :key="index"
                    :label="owner.name"
                    :value="owner.id"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label="Teams Involved"
                label-for="v-description"
              >
                <el-select
                  v-model="form.teams"
                  placeholder="Teams"
                  multiple
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(team, index) in unitTeams"
                    :key="index"
                    :label="team"
                    :value="team"
                  />
                </el-select>
              </b-form-group>
              <br>
            </b-col>
            <!--<b-col
              cols="6"
            >
              <b-form-group
                label="Process Objective"
                label-for="v-description"
              >
                <el-input
                  v-model="form.objective"
                  type="textarea"
                  placeholder="Process Objective"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col> -->
            <b-col
              cols="12"
            >
              <b-form-group
                label="Detailed Description/Narrative"
                label-for="v-name"
              >
                <ckeditor
                  v-model="form.description"
                  :editor="editor"
                  :config="editorConfig"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <h4>Other Details</h4>
          </template>
          <b-row v-loading="loading">
            <b-col
              cols="6"
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
              cols="6"
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
              cols="6"
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
              cols="6"
            >
              <b-form-group
                label-for="v-product_or_service_delivered"
              >
                <small>Product or Service being delivered</small>
                <el-input
                  v-model="form.product_or_service_delivered"
                  placeholder="Product or Service being delivered"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label-for="v-regulatory_obligations"
              >
                <small>Legal, Regulatory and Contractual Obligations</small>
                <el-input
                  v-model="form.regulatory_obligations"
                  placeholder="Legal, Regulatory and Contractual Obligations"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label-for="v-applications_used"
              >
                <small>Applications used by process</small>
                <el-input
                  v-model="form.applications_used"
                  placeholder="Applications used by process"
                  style="width: 100%;"
                />
                <small>(Separate multiple by a comma)</small>
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label-for="v-business_units_depended_on"
              >
                <small>Which Business Units are you dependent on</small>
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
              cols="6"
            >
              <b-form-group
                label-for="v-processes_depended_on"
              >
                <small>Which Business Processes are you dependent on in the Business Unit(s) listed above</small>
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
              cols="6"
            >
              <b-form-group
                label-for="v-key_vendors_or_external_dependencies"
              >
                <small>Who are your Key vendors or External dependencies</small>
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
              cols="6"
            >
              <b-form-group
                label-for="v-vital_non_electronic_records"
              >
                <small>Vital Non-Electronic Records</small>
                <el-input
                  v-model="form.vital_non_electronic_records"
                  placeholder="Vital Non-Electronic Records"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label-for="v-vital_electronic_records"
              >
                <small>Vital Electronic Records</small>
                <el-input
                  v-model="form.vital_electronic_records"
                  placeholder="Vital Electronic Records"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label-for="v-alternative_workaround_during_system_failure"
              >
                <small>Alternative Workarounds during system failure</small>
                <el-input
                  v-model="form.alternative_workaround_during_system_failure"
                  placeholder="Alternative Workarounds during system failure"
                  style="width: 100%;"
                />
              </b-form-group>
              <br>
            </b-col>
            <b-col
              cols="6"
            >
              <b-form-group
                label-for="v-key_individuals_process_depends_on"
              >
                <small>Are there important key individuals this process is dependent on</small>
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
              cols="6"
            >
              <b-form-group
                label-for="v-peak_periods"
              >
                <small>Peak Period</small>
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
              cols="6"
            >
              <b-form-group
                label-for="v-remote_working"
              >
                <small>Remote Working</small>
                <el-select
                  v-model="form.remote_working"
                  placeholder="Please Select"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(remote_working, index) in remote_working_periods"
                    :key="index"
                    :value="remote_working"
                    :label="remote_working"
                  />
                </el-select>
                <small>How long can this activity be performed at an acceptable level from home?</small>
                <br>
              </b-form-group>
              <br>
            </b-col>
          </b-row>
        </el-collapse-item>
      </el-collapse>
      <br>
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        type="submit"
        variant="primary"
        class="mr-1"
        :disabled="isImportantFieldsEmpty()"
        @click="update()"
      >
        Update
      </b-button>
    </div>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    businessProcess: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      activeName: '1',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      business_units: [],
      selectedBusinessUnit: null,
      unitTeams: [],
      team_members: [],
      form: {
        client_id: '',
        business_unit_id: '',
        name: '',
        description: '',
        process_owner: '',
        teams: [],
        // narrative: '',
        objective: '',
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
      remote_working_periods: ['This cannot be done', '0-4 hours', 'Up to 1 Business Day', 'Up to 3 Business Days', 'Up to 1 Month', 'More than 1 Month'],
      loading: false,
      selectedClient: {},
    }
  },
  created() {
    this.fetchBusinessUnits()
    this.form = this.businessProcess
  },
  methods: {
    isImportantFieldsEmpty() {
      const app = this
      if (app.form.name === '' || app.form.process_owner === '' || app.form.description === '' || app.form.objective === '') {
        return true
      }
      return false
    },
    fetchBusinessUnits() {
      const app = this
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.businessProcess.client_id })
        .then(response => {
          app.business_units = response.business_units
          app.business_units.forEach(unit => {
            if (unit.id === app.businessProcess.business_unit_id) {
              app.selectedBusinessUnit = unit
              const { teams } = unit
              const teamMembers = unit.team_members
              app.unitTeams = teams.split(',')
              app.team_members = teamMembers
            }
          })
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    update() {
      const app = this
      app.loading = true
      const saveBusinessProcessResource = new Resource('business-units/update-business-process')
      const param = app.form
      saveBusinessProcessResource.update(param.id, param)
        .then(() => {
          app.loading = false
          // app.$message('Action Successful')
          app.$notify({
            title: 'Action Successful',
          })
          app.$emit('updated')
          // app.$emit('update:is-edit-business-process-sidebar-active', false)
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
