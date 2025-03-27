<template>
  <div>
    <b-row>
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
        </b-form-group>
      </b-col>
    </b-row>
    <form-wizard
      v-if="form.business_process_id !== ''"
      color="#7367F0"
      title="RISK ASSESSMENT"
      :subtitle="null"
      shape="circle"
      step-size="xs"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="wizard-vertical mb-3"
      @on-complete="formSubmitted"
    >
      <tab-content
        title="RISK ANALYSIS"
        :before-change="validateRisk"
      >
        <validation-observer
          ref="riskRule"
          tag="form"
        >
          <b-row>
            <b-col cols="12">
              <b-form-group
                label="Select Risk"
                label-for="v-level_group"
              >
                <el-select
                  v-model="selected_risk_register"
                  placeholder="Select Risk"
                  value-key="id"
                  style="width: 100%;"
                  filterable
                >
                  <el-option
                    v-for="(risk_register, index) in risk_registers"
                    :key="index"
                    :value="risk_register"
                    :label="`(${risk_register.risk_id}) - ${risk_register.vunerability_description}`"
                  />
                </el-select>
              </b-form-group>
            </b-col>
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
                  <div>
                    <el-select
                      v-model="assessment.asset_type_id"
                      placeholder="Select Asset Type"
                      style="width: 100%"
                      filterable
                      @change="fetchAssets($event); updateField($event, 'asset_type_id', assessment)"
                    >
                      <el-option
                        v-for="(asset_type, type_index) in asset_types"
                        :key="type_index"
                        :label="asset_type.name"
                        :value="asset_type.id"
                      />
                    </el-select>
                    <p />
                    <el-button
                      type="warning"
                      size="mini"
                      plain
                      icon="el-icon-plus"
                      @click="createAssetTypeModal = true"
                    >
                      Add New
                    </el-button>
                  </div>
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
        title="TREATMENT"
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
        title="POST TREATMENT"
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
    </form-wizard>
  </div>
</template>

<script>
import {
  BRow, BCol, BFormGroup, BFormInput,
} from 'bootstrap-vue'
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

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
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateSidebarActive',
    event: 'update:is-create-sidebar-active',
  },
  props: {
    isCreateSidebarActive: {
      type: Boolean,
      required: true,
    },
    standardId: {
      type: Number,
      required: true,
    },
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    assessmentModule: {
      type: String,
      default: () => ('ra'), // this is the general risk assessment
    },
  },
  data() {
    return {
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
      business_units: [],
      business_unit_id: '',
      business_processes: [],
      risk_registers: [],
      selected_business_processes: [],
      selected_risk_register: '',
      entries: [],
      loading: false,
    }
  },
  created() {
    this.fetchBusinessUnits()
  },
  methods: {
    fetchBusinessUnits() {
      const app = this
      app.loading = true
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchRiskRegister() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource.list({ client_id: app.selectedClient.id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.risk_registers = response.risk_registers
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
    submit() {
      const app = this
      if (app.entries.length > 0) {
        app.loading = true
        const submitResource = new Resource('risk-assessment/store-risk-assessment')
        submitResource.store({
          module: app.assessmentModule,
          standard_id: app.standardId,
          client_id: app.selectedClient.id,
          business_unit_id: app.business_unit_id,
          assessments: app.entries,
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Submitted Successfully',
          })
          app.$emit('submit')
          app.$emit('update:is-create-sidebar-active', false)
          // app.entries = []
          // app.addEntry()
          app.loading = false
        }).catch(() => {
          this.$message({
            type: 'danger',
            message: 'An error Occured',
          })
          app.loading = false
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
