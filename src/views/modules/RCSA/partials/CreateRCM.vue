<template>
  <div v-loading="loading">
    <!-- <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
      <h3 class="mb-0">
        RISK AND CONTROL MATRIX
      </h3>
    </div> -->

    <b-row>
      <b-col md="6">
        <b-form-group
          label="Name of Organization"
          label-for="client_id"
        >
          <el-select
            v-model="form.client_id"
            placeholder="Select Client"
            style="width: 100%;"
            filterable
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
      <b-col md="6">
        <b-form-group
          label="Select Business Unit"
          label-for="business_unit_id"
        >
          <el-select
            v-model="form.business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            filterable
            @input="fetchBusinessProcesses()"
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
      <b-col md="6">
        <b-form-group
          label="Select Business Process"
          label-for="business_process"
        >
          <validation-provider
            #default="{ errors }"
            name="business_process"
            rules="required"
          >
            <el-select
              v-model="form.business_process_id"
              placeholder="Select Business process"
              style="width: 100%;"
              filterable
            >
              <el-option
                v-for="(business_process, index) in business_processes"
                :key="index"
                :value="business_process.id"
                :label="business_process.name"
              />
            </el-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <form-wizard
      v-if="form.business_process_id !== ''"
      color="#7367F0"
      title="RISK AND CONTROL MATRIX "
      :subtitle="null"
      shape="circle"
      step-size="xs"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="wizard-vertical mb-3"
      @on-complete="formSubmitted"
    >
      <!-- personal details tab -->
      <!-- <tab-content
        title="General Selection"
        :before-change="validateSelection"
      >
        <validation-observer
          ref="selectionRule"
          tag="form"
        >
          <b-row>
            <b-col md="6">
              <b-form-group
                label="Select Business Process"
                label-for="business_process"
              >
                <validation-provider
                  #default="{ errors }"
                  name="business_process"
                  rules="required"
                >
                  <el-select
                    v-model="form.business_process_id"
                    placeholder="Select Business process"
                    style="width: 100%;"
                    filterable
                  >
                    <el-option
                      v-for="(business_process, index) in business_processes"
                      :key="index"
                      :value="business_process.id"
                      :label="business_process.name"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content> -->
      <tab-content
        title="Risk"
        :before-change="validateRisk"
      >
        <validation-observer
          ref="riskRule"
          tag="form"
        >
          <b-row>
            <b-col md="6">
              <b-form-group
                label="Risk Description"
                label-for="risk_description"
              >
                <validation-provider
                  #default="{ errors }"
                  name="risk_description"
                  rules="required"
                >
                  <b-form-input
                    id="risk_description"
                    v-model="form.risk_description"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Describe Risk"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Risk Owner"
                label-for="risk_owner"
              >
                <validation-provider
                  #default="{ errors }"
                  name="risk_owner"
                  rules="required"
                >
                  <b-form-input
                    id="email"
                    v-model="form.risk_owner"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Risk Owner"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
      <tab-content
        title="Control"
        :before-change="validateControl"
      >
        <validation-observer
          ref="controlRule"
          tag="form"
        >
          <b-row>
            <b-col md="6">
              <b-form-group
                label="Where is the control performed"
                label-for="control_location"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Control Location"
                >
                  <el-select
                    v-model="form.control_location"
                    placeholder="Select Location"
                    style="width: 100%;"
                  >
                    <el-option
                      label="Business Unit"
                      value="Business Unit"
                    />
                    <el-option
                      label="Centralised"
                      value="Centralised"
                    />
                    <el-option
                      label="N/A"
                      value="N/A"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Control Description"
                label-for="control_description"
              >
                <validation-provider
                  #default="{ errors }"
                  name="control_description"
                >
                  <b-form-input
                    id="control_description"
                    v-model="form.control_description"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Describe Control"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Control Frequency"
                label-for="frequency"
              >
                <validation-provider
                  #default="{ errors }"
                  name="frequency"
                >
                  <el-select
                    v-model="form.control_frequency"
                    placeholder="Select Frequency"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(frequency, index) in control_frequencies"
                      :key="index"
                      :value="frequency"
                      :label="frequency"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Control Owner"
                label-for="control_owner"
              >
                <validation-provider
                  #default="{ errors }"
                  name="control_owner"
                >
                  <b-form-input
                    id="email"
                    v-model="form.control_owner"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Control Owner"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Control Type"
                label-for="control_type"
              >
                <validation-provider
                  #default="{ errors }"
                  name="control_type"
                >
                  <el-select
                    v-model="form.control_type"
                    placeholder="Select Type"
                    style="width: 100%;"
                  >
                    <el-option
                      label="Preventive"
                      value="Preventive"
                    />
                    <el-option
                      label="Detective"
                      value="Detective"
                    />
                    <el-option
                      label="N/A"
                      value="N/A"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Nature of Control"
                label-for="nature_of_control"
              >
                <validation-provider
                  #default="{ errors }"
                  name="nature_of_control"
                >
                  <el-select
                    v-model="form.nature_of_control"
                    placeholder="Select"
                    style="width: 100%;"
                  >
                    <el-option
                      label="Automated"
                      value="Automated"
                    />
                    <el-option
                      label="Hybrid"
                      value="Hybrid"
                    />
                    <el-option
                      label="Manual"
                      value="Manual"
                    />
                    <el-option
                      label="N/A"
                      value="N/A"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col
              v-if="form.nature_of_control == 'Automated' || form.nature_of_control == 'Hybrid'"
              md="6"
            >
              <b-form-group
                label="Name the application system used for execution of the control."
                label-for="application_used_for_control"
              >
                <validation-provider
                  #default="{ errors }"
                  name="application_used_for_control"
                >
                  <b-form-input
                    id="email"
                    v-model="form.application_used_for_control"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Enter application name"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col
              md="6"
            >
              <b-form-group
                label="Any Compensating control?"
                label-for="compensating_control"
              >
                <b-form-input
                  id="email"
                  v-model="form.compensating_control"
                  placeholder="Enter Compensating control"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
      <tab-content
        title="Testing Strategy"
        :before-change="validateTesting"
      >
        <validation-observer
          ref="testRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
              <b-form-group
                label="Test Procedure"
                label-for="test_procedures"
              >
                <validation-provider
                  #default="{ errors }"
                  name="test_procedures"
                >
                  <b-form-input
                    id="name"
                    v-model="form.test_procedures"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Test Procedure"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Sample Size"
                label-for="sample_size"
              >
                <validation-provider
                  #default="{ errors }"
                  name="sample_size"
                >
                  <b-form-input
                    id="sample_size"
                    v-model="form.sample_size"
                    type="number"
                    :min="1"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Sample Size"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Data Required"
                label-for="data_required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Data Required"
                >
                  <b-form-input
                    id="phone"
                    v-model="form.data_required"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Data Required"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Link to Evidence & Report"
                label-for="link_to_evidence"
              >
                <input
                  class="form-control"
                  type="file"
                  placeholder="Link to Evidence & Report"
                  @change="onImageChange"
                >
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Conclusion"
                label-for="test_conclusion"
              >
                <validation-provider
                  #default="{ errors }"
                  name="test_conclusion"
                >
                  <el-select
                    v-model="form.test_conclusion"
                    placeholder="Select"
                    style="width: 100%;"
                  >
                    <el-option
                      label="Adequate"
                      value="Adequate"
                    />
                    <el-option
                      label="Inadequate"
                      value="Inadequate"
                    />
                    <el-option
                      label="Sub-optimal"
                      value="Sub-optimal"
                    />
                  </el-select>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
      <tab-content
        title="Gap"
        :before-change="validationGap"
      >
        <validation-observer
          ref="gapRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
              <b-form-group
                label="Gap Description"
                label-for="gap_description"
              >
                <b-form-input
                  id="gap_description"
                  v-model="form.gap_description"
                  placeholder="This is to document if there is any gap or deficiency in internal control based on the procedures performed"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="TOD Improvement Opportunity (if any)"
                label-for="tod_improvement_opportunity"
              >
                <b-form-input
                  id="tod_improvement_opportunity"
                  v-model="form.tod_improvement_opportunity"
                  placeholder="TOD Improvement Opportunity"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Recommendation"
                label-for="recommendation"
              >
                <b-form-input
                  id="recommendation"
                  v-model="form.recommendation"
                  placeholder="Recommendation"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Responsibility"
                label-for="responsibility"
              >
                <b-form-input
                  id="responsibility"
                  v-model="form.responsibility"
                  placeholder="Responsibility"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Timeline"
                label-for="timeline"
              >
                <b-form-input
                  id="timeline"
                  v-model="form.timeline"
                  placeholder="Timeline"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="TOD Gap Status"
                label-for="tod_gap_status"
              >
                <b-form-input
                  id="tod_gap_status"
                  v-model="form.tod_gap_status"
                  placeholder="TOD Gap Status"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
    </form-wizard>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup,
  BFormInput,
} from 'bootstrap-vue'
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    // BButton,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      activeName: '1',
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      clients: [],
      business_processes: [],
      business_units: [],
      selectedBusinessUnit: null,
      unitTeams: [],
      team_members: [],
      required,
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        risk_unique_id: '',
        type: '',
        risk_description: '',
        outcome: '',
        risk_owner: '',
        control_no: '',
        control_location: '',
        control_description: '',
        control_frequency: '',
        control_owner: '',
        control_type: '',
        nature_of_control: '',
        application_used_for_control: '',
        compensating_control: '',
        test_procedures: '',
        sample_size: '',
        data_required: '',
        link_to_evidence: '',
        test_conclusion: '',
        gap_description: '',
        tod_improvement_opportunity: '',
        recommendation: '',
        responsibility: '',
        timeline: '',
        tod_gap_status: '',
      },
      control_frequencies: ['Per Transaction', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Biannually', 'Annually', 'N/A', 'Per Merchant', 'Per Terminal Request'],
      loading: false,
      selectedClient: {},
      uploadableFile: null,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    onImageChange(e) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.uploadableFile = e.target.files[0]
    },
    fetchClients() {
      const app = this
      const fetchBusinessUnitsResource = new Resource('clients')
      fetchBusinessUnitsResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.form.client_id = app.clients[0].id
            app.fetchBusinessUnits()
          }
        })
    },
    fetchBusinessUnits() {
      const app = this
      app.business_units = []
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchBusinessProcesses() {
      const app = this
      app.business_processes = []
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource.list({ business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.business_processes = response.business_processes
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    validateSelection() {
      return new Promise((resolve, reject) => {
        this.$refs.selectionRule.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validateRisk() {
      return new Promise((resolve, reject) => {
        this.$refs.riskRule.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validateControl() {
      return new Promise((resolve, reject) => {
        this.$refs.controlRule.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validateTesting() {
      return new Promise((resolve, reject) => {
        this.$refs.testRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationGap() {
      return new Promise((resolve, reject) => {
        this.$refs.gapRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },

    formSubmitted() {
      const app = this
      app.loading = true
      const formData = new FormData()
      formData.append('client_id', app.form.client_id)
      formData.append('business_unit_id', app.form.business_unit_id)
      formData.append('business_process_id', app.form.business_process_id)
      formData.append('risk_unique_id', app.form.risk_unique_id)
      formData.append('type', app.form.type)
      formData.append('risk_description', app.form.risk_description)
      formData.append('outcome', app.form.outcome)
      formData.append('risk_owner', app.form.risk_owner)
      formData.append('control_no', app.form.control_no)
      formData.append('control_location', app.form.control_location)
      formData.append('control_description', app.form.control_description)
      formData.append('control_frequency', app.form.control_frequency)
      formData.append('control_owner', app.form.control_owner)
      formData.append('control_type', app.form.control_type)
      formData.append('nature_of_control', app.form.nature_of_control)
      formData.append('application_used_for_control', app.form.application_used_for_control)
      formData.append('compensating_control', app.form.compensating_control)
      formData.append('test_procedures', app.form.test_procedures)
      formData.append('sample_size', app.form.sample_size)
      formData.append('data_required', app.form.data_required)
      formData.append('test_conclusion', app.form.test_conclusion)
      formData.append('gap_description', app.form.gap_description)
      formData.append('tod_improvement_opportunity', app.form.tod_improvement_opportunity)
      formData.append('recommendation', app.form.recommendation)
      formData.append('responsibility', app.form.responsibility)
      formData.append('timeline', app.form.timeline)
      formData.append('tod_gap_status', app.form.tod_gap_status)
      formData.append('link_to_evidence', app.uploadableFile)
      const saveRisksResource = new Resource('risk-assessment/save-risk')
      saveRisksResource.store(formData)
        .then(() => {
          app.loading = false
          // app.$message('Action Successful')
          app.$notify({
            title: 'Submitted Successfully',
          })
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
<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
