<template>
  <div v-loading="loading">
    <div>
      <b-row>
        <b-col md="6">
          <b-form-group
            label="Name of Controller"
          >
            <b-tooltip
              target="controller_name"
              title="Who is the controller of the data i.e. the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data"
            />
            <input
              id="controller_name"
              v-model="form.controller_name"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_name');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Contact Details of Controller"
          >
            <b-tooltip
              target="controller_contact_details"
              title="State the contact details of the Controller"
            />
            <input
              id="controller_contact_details"
              v-model="form.controller_contact_details"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_contact_details');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Name of Joint Controller"
          >
            <b-tooltip
              target="joint_controller_name"
              title="Who is the joint controller (if any) of the data. This applies where two or more controllers jointly determine the purposes and means of processing"
            />
            <input
              id="joint_controller_name"
              v-model="form.joint_controller_name"
              class="form-control"
              @blur="updateField($event.target.value, 'joint_controller_name');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Contact Details of Controller"
          >
            <b-tooltip
              target="joint_controller_contact_details"
              title="State the contact details of the joint controller"
            />
            <input
              id="joint_controller_contact_details"
              v-model="form.joint_controller_contact_details"
              class="form-control"
              @blur="updateField($event.target.value, 'joint_controller_contact_details');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Name of Controller's Representative"
          >
            <b-tooltip
              target="controller_rep_name"
              title="Where the controller is not established in the European Union"
            />
            <input
              id="controller_rep_name"
              v-model="form.controller_rep_name"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_rep_name');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Contact Details of Controller's Representative"
          >
            <b-tooltip
              target="controller_rep_contact_details"
              title="State the contact details of the controller's representative"
            />
            <input
              id="controller_rep_contact_details"
              v-model="form.controller_rep_contact_details"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_rep_contact_details');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Name of Data Protection Officer"
          >
            <b-tooltip
              target="dpo_name"
              title="If applicable - where there is a requirement to appoint a data protection officer"
            />
            <input
              id="dpo_name"
              v-model="form.dpo_name"
              class="form-control"
              @blur="updateField($event.target.value, 'dpo_name');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Contact Details of Data Protection Officer"
          >
            <b-tooltip
              target="dpo_details"
              title="State the contact details of the data protection officer"
            />
            <input
              id="dpo_details"
              v-model="form.dpo_details"
              class="form-control"
              @blur="updateField($event.target.value, 'dpo_details');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Purpose of Processing"
          >
            <b-tooltip
              target="processing_purpose"
              title="The reasons for which the processing is carried out"
            />
            <textarea
              id="processing_purpose"
              v-model="form.processing_purpose"
              class="form-control"
              @blur="updateField($event.target.value, 'processing_purpose');"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Category of Data Subjects"
          >

            <b-tooltip
              target="data_subject_categories"
              title="Define who the data subjects are e.g. by country, gender, service recipients"
            />
            <input
              id="data_subject_categories"
              v-model="form.data_subject_categories"
              class="form-control"
              @blur="updateField($event.target.value, 'data_subject_categories');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Categories of Personal Data"
          >
            <b-tooltip
              target="personal_data_categories"
              title="Define the types of data items that are involved, particularly if special categories such as biometric data"
            />
            <textarea
              id="personal_data_categories"
              v-model="form.personal_data_categories"
              class="form-control"
              @blur="updateField($event.target.value, 'personal_data_categories');"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Categories of Data Recipients"
          >
            <b-tooltip
              target="data_recipients_categories"
              title="Who is the data regularly shared with or who has access to it?"
            />
            <input
              id="data_recipients_categories"
              v-model="form.data_recipients_categories"
              class="form-control"
              @blur="updateField($event.target.value, 'data_recipients_categories');"
            >
          </b-form-group>
        </b-col>
        <b-col
          md="6"
        >
          <b-form-group
            label="International Transfer Destination"
          >
            <b-tooltip
              target="international_transfer_destination"
              title="Countries or international organisations to whom the data are regularly transferred"
            />
            <input
              id="international_transfer_destination"
              v-model="form.international_transfer_destination"
              class="form-control"
              @blur="updateField($event.target.value, 'international_transfer_destination');"
            >
          </b-form-group>
        </b-col>
        <b-col
          md="6"
        >
          <b-form-group
            label="Time Limit for Erasure"
          >
            <b-tooltip
              target="erasure_time_limit"
              title="How long will the personal data be held for before it is erased?"
            />
            <input
              id="erasure_time_limit"
              v-model="form.erasure_time_limit"
              class="form-control"
              @blur="updateField($event.target.value, 'erasure_time_limit');"
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group
            label="Technical and Organisational Security Measures Applied"
          >
            <b-tooltip
              target="security_measures_applied"
              title="A brief description of the controls used to protect the personal data (refer to additional information if required)"
            />
            <input
              id="security_measures_applied"
              v-model="form.security_measures_applied"
              class="form-control"
              @blur="updateField($event.target.value, 'security_measures_applied');"
            >
          </b-form-group>
        </b-col>
        <b-col
          md="6"
        >
          <b-form-group
            label="Comments"
          >
            <b-tooltip
              target="comments"
              title="Any other comments you would like to make about the information"
            />
            <textarea
              id="comments"
              v-model="form.comments"
              class="form-control"
              @blur="updateField($event.target.value, 'comments');"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <el-button
        type="success"
        @click="submit()"
      >
        Submit
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup, BTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BTooltip,
    // BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedData: {
      type: Object,
      required: true,
    },
    countries: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      yes_no: ['Yes', 'No'],
      lawful_bases: ['Consent-based', 'Contractual', 'Legal Obligation', 'Vital Interests', 'Public Interests', 'Legitimate Interests'],
      exceptions: ['Explicit Consent', 'Legal Obligation', 'Public Data', 'Legal Claims', 'Public Interest', 'Health Purposes', 'Public Health', 'Archiving and Research'],
      form: {
        client_id: '',
        standard_id: '',
        business_unit_id: '',
        controller_name: '',
        controller_contact_details: '',
        joint_controller_name: '',
        joint_controller_contact_details: '',
        controller_rep_name: '',
        controller_rep_contact_details: '',
        dpo_name: '',
        dpo_details: '',
        processing_purpose: '',
        data_subject_categories: '',
        personal_data_categories: '',
        data_recipients_categories: '',
        international_transfer_destination: '',
        erasure_time_limit: '',
        security_measures_applied: '',
        comments: '',
      },
      business_units: [],
      business_processes: [],
      loading: false,
      selectedClient: {},
      uploadableFile: null,
    }
  },
  created() {
    this.form = this.selectedData
  },
  methods: {
    updateField(value, field) {
      const app = this
      const params = {
        field, value,
      }
      const updateResources = new Resource('ropa/update')
      updateResources.update(app.selectedData.id, params)
        .then(response => {
          app.form = response.ropa
          // app.$message('Updated')
        }).catch()
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
