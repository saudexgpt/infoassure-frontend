<template>
  <form-wizard
    color="#1e52b3"
    title="UPDATE ENTRY"
    :subtitle="null"
    shape="tab"
    step-size="xs"
    finish-button-text="Submit"
    back-button-text="Previous"
    next-button-text="Save & Continue"
    class="wizard-vertical mb-3"
    @on-complete="$emit('done')"
  >
    <tab-content
      title="Risk"
    >
      <b-row>
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
              @change="updateField($event, 'business_process_id', form)"
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
        <b-col md="6">
          <b-form-group
            label="Risk Description"
            label-for="risk_description"
          >
            <textarea
              id="risk_description"
              v-model="form.vulnerability_description"
              class="form-control"
              placeholder="Describe Risk"
              @blur="updateField($event.target.value, 'vulnerability_description', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Impact/Outcome"
            label-for="impact"
          >
            <textarea
              id="outcome"
              v-model="form.outcome"
              class="form-control"
              placeholder="State the outcome of the risk"
              @blur="updateField($event.target.value, 'outcome', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Risk Owner"
            label-for="risk_owner"
          >
            <el-input
              v-model="form.risk_owner"
              placeholder="Risk Owner"
              @blur="updateField($event, 'risk_owner', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Risk Category"
            label-for="risk_category"
          >
            <el-select
              v-model="form.type"
              placeholder="Risk Category"
              style="width: 100%"
              @change="setRiskSubCategory($event); updateField($event, 'type', form)"
            >
              <el-option
                v-for="(risk_type, type_index) in risk_types"
                :key="type_index"
                :value="risk_type.name"
                :label="risk_type.name"
              />
            </el-select>
          </b-form-group>
        </b-col>
        <b-col
          md="6"
        >
          <b-form-group
            label="Risk Sub-Category"
            label-for="sub_category"
          >
            <el-select
              v-model="form.sub_type"
              placeholder="Risk Sub Category"
              style="width: 100%"
              @change="updateField($event, 'sub_type', form)"
            >
              <el-option
                v-for="(sub_type, subtype_index) in sub_categories"
                :key="subtype_index"
                :value="sub_type.name"
                :label="sub_type.name"
              />
            </el-select>
          </b-form-group>
        </b-col>

      </b-row>
    </tab-content>
    <tab-content
      title="Control"
    >
      <b-row>
        <b-col md="6">
          <b-form-group
            label="Where is the control performed"
            label-for="control_location"
          >
            <el-select
              v-model="form.control_location"
              placeholder="Select Location"
              style="width: 100%;"
              @change="updateField($event, 'control_location', form)"
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
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Control Description"
            label-for="control_description"
          >
            <textarea
              id="control_description"
              v-model="form.control_description"
              class="form-control"
              placeholder="Describe Control"
              @blur="updateField($event.target.value, 'control_description', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Control Frequency"
            label-for="frequency"
          >
            <el-select
              v-model="form.control_frequency"
              placeholder="Select Frequency"
              style="width: 100%;"
              @change="updateField($event, 'control_frequency', form)"
            >
              <el-option
                v-for="(frequency, index) in control_frequencies"
                :key="index"
                :value="frequency"
                :label="frequency"
              />
            </el-select>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Control Owner"
            label-for="control_owner"
          >
            <el-input
              id="email"
              v-model="form.control_owner"
              placeholder="Control Owner"
              @blur="updateField($event, 'control_owner', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Control Type"
            label-for="control_type"
          >
            <el-select
              v-model="form.control_type"
              placeholder="Select Type"
              style="width: 100%;"
              @change="updateField($event, 'control_type', form)"
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
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Nature of Control"
            label-for="nature_of_control"
          >
            <el-select
              v-model="form.nature_of_control"
              placeholder="Select"
              style="width: 100%;"
              @change="updateField($event, 'nature_of_control', form)"
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
          </b-form-group>
        </b-col>
        <b-col
          v-if="form.nature_of_control === 'Automated' || form.nature_of_control === 'Hybrid'"
          md="6"
        >
          <b-form-group
            label="Name the application system used for execution of the control."
            label-for="application_used_for_control"
          >
            <el-input
              v-model="form.application_used_for_control"
              placeholder="Enter application name"
              @blur="updateField($event, 'application_used_for_control', form)"
            />
          </b-form-group>
        </b-col>
        <b-col
          md="6"
        >
          <b-form-group
            label="Any Compensating control?"
            label-for="compensating_control"
          >
            <textarea
              v-model="form.compensating_control"
              class="form-control"
              placeholder="Enter Compensating control"
              @blur="updateField($event.target.value, 'compensating_control', form)"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </tab-content>
    <tab-content
      title="Testing Strategy"
    >
      <b-row>
        <b-col md="6">
          <b-form-group
            label="Test Procedure"
            label-for="test_procedures"
          >
            <textarea
              v-model="form.test_procedures"
              class="form-control"
              placeholder="Test Procedure"
              @blur="updateField($event.target.value, 'test_procedures', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Sample Size"
            label-for="sample_size"
          >
            <el-input
              id="sample_size"
              v-model="form.sample_size"
              type="number"
              :min="1"
              placeholder="Sample Size"
              @blur="updateField($event, 'sample_size', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Data Required"
            label-for="data_required"
          >
            <textarea
              v-model="form.data_required"
              class="form-control"
              placeholder="Data Required"
              @blur="updateField($event.target.value, 'data_required', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Link to Evidence & Report"
            label-for="link_to_evidence"
          >
            <a
              :href="baseServerUrl+'storage/'+form.link_to_evidence"
              target="_blank"
              style="color: #409EFF;"
            >Click link to evidence</a>
            <!-- <input
                class="form-control"
                type="file"
                placeholder="Link to Evidence & Report"
                @change="onImageChange"
              > -->
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Conclusion"
            label-for="test_conclusion"
          >
            <el-select
              v-model="form.test_conclusion"
              placeholder="Select"
              style="width: 100%;"
              @change="updateField($event, 'test_conclusion', form)"
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
          </b-form-group>
        </b-col>
      </b-row>
    </tab-content>
    <tab-content
      title="Gap"
    >
      <b-row>
        <b-col md="6">
          <b-form-group
            label="Gap Description"
            label-for="gap_description"
          >
            <textarea
              id="gap_description"
              v-model="form.gap_description"
              class="form-control"
              placeholder="This is to document if there is any gap or deficiency in internal control based on the procedures performed"
              @blur="updateField($event.target.value, 'gap_description', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="TOD Improvement Opportunity (if any)"
            label-for="tod_improvement_opportunity"
          >
            <textarea
              id="tod_improvement_opportunity"
              v-model="form.tod_improvement_opportunity"
              class="form-control"
              placeholder="TOD Improvement Opportunity"
              @blur="updateField($event.target.value, 'tod_improvement_opportunity', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Recommendation"
            label-for="recommendation"
          >
            <textarea
              id="recommendation"
              v-model="form.recommendation"
              class="form-control"
              placeholder="Recommendation"
              @blur="updateField($event.target.value, 'recommendation', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Responsibility"
            label-for="responsibility"
          >
            <el-input
              id="responsibility"
              v-model="form.responsibility"
              placeholder="Responsibility"
              @blur="updateField($event, 'responsibility', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Timeline"
            label-for="timeline"
          >
            <el-input
              id="timeline"
              v-model="form.timeline"
              placeholder="Timeline"
              @blur="updateField($event, 'timeline', form)"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="TOD Gap Status"
            label-for="tod_gap_status"
          >
            <el-input
              id="tod_gap_status"
              v-model="form.tod_gap_status"
              placeholder="TOD Gap Status"
              @blur="updateField($event, 'tod_gap_status', form)"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </tab-content>
  </form-wizard>
</template>
<script>
import {
  BRow, BCol, BFormGroup,
} from 'bootstrap-vue'
import { FormWizard, TabContent } from 'vue-form-wizard'
import { required } from '@validations'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: {
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    // BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    clientId: {
      type: Number,
      default: null,
    },
    businessUnitId: {
      type: Number,
      default: null,
    },
    selectedRiskRegister: {
      type: Object,
      default: () => ({}),
    },
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
      sub_categories: [],
      unitTeams: [],
      team_members: [],
      risk_types: [],
      required,
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        sub_unit: '',
        risk_unique_id: '',
        type: '',
        vulnerability_description: '',
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
      empty_form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        sub_unit: '',
        risk_unique_id: '',
        type: '',
        sub_type: '',
        vulnerability_description: '',
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
      uploadableFile: null,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.form = this.selectedRiskRegister
    this.fetchRiskCategories()
    this.fetchBusinessProcesses()
    this.setRiskSubCategory()
  },
  methods: {
    setRiskSubCategory() {
      const app = this
      const { risk_types } = app
      const value = app.form.type
      app.sub_categories = []
      risk_types.forEach(riskType => {
        if (riskType.name === value) {
          app.sub_categories = riskType.sub_categories
        }
      })
    },
    onImageChange(e) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.uploadableFile = e.target.files[0]
    },
    fetchRiskCategories() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      fetchEntryResource.list({ client_id: app.clientId })
        .then(response => {
          app.risk_types = response.categories
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    fetchBusinessUnits() {
      const app = this
      app.business_units = []
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.clientId })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchBusinessProcesses() {
      const app = this
      app.business_processes = []
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource.list({ business_unit_id: app.businessUnitId })
        .then(response => {
          app.business_processes = response.business_processes
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateField(value, field, assessment) {
      const app = this
      const params = { field, value }
      const updateResource = new Resource('update-risk-register')
      updateResource.update(assessment.id, params)
        .then(() => {
          app.$emit('reload')
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
