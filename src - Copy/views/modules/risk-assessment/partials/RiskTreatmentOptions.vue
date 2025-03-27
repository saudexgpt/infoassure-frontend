<template>
  <div>
    <el-alert
      :type="treatment_alert_type"
      :closable="false"
    >
      {{ treatment_comment }}
    </el-alert>

    <div v-if="!showTreatmentOption && selectedData.treatment_option === null">
      <hr>
      <el-button
        type="success"
        size="mini"
        @click="setTreatmentQuestions('Accept')"
      >
        Accept
      </el-button>
      <el-button
        type="default"
        size="mini"
        @click="showTreatmentOption = true"
      >
        I want to explore other options
      </el-button>
    </div>
    <div v-else>
      <p>Select your option</p>
      <select
        v-model="selectedData.treatment_option"
        class="form-control"
        placeholder="Select Option"
        @change="setTreatmentQuestions($event.target.value)"
      >
        <option
          v-for="(treatment_option, option_index) in treatment_options"
          :key="option_index"
          :label="treatment_option"
          :value="treatment_option"
        />
      </select>
    </div>

    <div v-if="treatment_option_details.length > 0">
      <p />
      <b-row>
        <b-col
          v-for="(treatment_detail, index) in treatment_option_details"
          :key="index"
          md="12"
        >
          <b-form-group
            :label="treatment_detail.question"
          >
            <textarea
              v-model="treatment_detail.answer"
              class="form-control"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-button
            :loading="loading"
            variant="outline-primary"
            size="sm"
            @click="saveTreatmentOptionDetails()"
          >
            Save Response
          </b-button>
        </b-col>
      </b-row>
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
    BRow, BCol, BFormGroup, BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedData: {
      type: Object,
      required: true,
    },
    riskScore: {
      type: Number,
      default: () => null,
    },
    riskAppetite: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      treatment_option_question_details: {
        Avoid: [
          { question: 'Reason for avoidance', answer: '' },
          { question: 'Alternative preference adopted', answer: '' },
          { question: 'Would you like to review the risk later?', answer: '' },
          { question: 'When in the future?', answer: '' },
        ],
        Transfer: [
          { question: 'Reason for transfer', answer: '' },
          { question: 'To whom will the transfer be?', answer: '' },
          { question: 'Is there a signed contract/SLA for the transfer?', answer: '' },
          { question: 'What other treatment plan is in place after transferring the risk?', answer: '' },
        ],
        Accept: [
          { question: 'Reasons for acceptance', answer: '' },
          { question: 'Have you done the cost-benefit analysis for the risk? If yes, mention it.', answer: '' },
          { question: 'Is there a system that would continuously control and monitor the given risk? If Yes, List or Mention them', answer: '' },
          // List or Mention them{ question: 'List or Mention them', answer: '' },
        ],
        Mitigate: [],
      },
      loading: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
      treatment_option_details: [],
      active_treatment_option: '',
    }
  },
  watch: {
    riskScore() {
      this.setSavedTreatmentOption()
      this.treatRisk()
    },
  },
  created() {
    this.setSavedTreatmentOption()
    this.treatRisk()
  },
  methods: {
    setSavedTreatmentOption() {
      const app = this
      app.active_treatment_option = app.selectedData.treatment_option
      app.treatment_option_details = (app.selectedData.treatment_option_details !== null) ? app.selectedData.treatment_option_details : []
    },
    treatRisk() {
      const app = this
      const riskValue = app.riskScore
      const { riskAppetite } = app
      if (riskValue <= riskAppetite) {
        app.treatment_comment = `Risk Score of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk. It's up to you.`
        app.treatment_alert_type = 'success'
        app.showTreatmentOption = false
      } else {
        app.treatment_comment = `Risk Score of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        app.treatment_alert_type = 'error'
        app.showTreatmentOption = true
      }
      app.showTreatmentModal = true
    },
    setTreatmentQuestions(option) {
      const app = this
      if (option === 'Mitigate') {
        app.treatment_option_details = app.treatment_option_question_details[option]
        app.saveTreatmentOptionDetails()
      } else if (option === app.active_treatment_option) {
        app.setSavedTreatmentOption()
      } else {
        app.treatment_option_details = app.treatment_option_question_details[option]
      }
    },
    saveTreatmentOptionDetails() {
      const app = this
      app.loading = true
      const params = {
        treatment_option: app.selectedData.treatment_option,
        treatment_option_details: app.treatment_option_details,

      }
      const updateResources = new Resource('risk-assessment/save-risk-assessment-treatment-details')
      updateResources.update(app.selectedData.id, params)
        .then(response => {
          app.loading = false
          app.$message('Option Saved')
          app.$emit('selected', response)
          // app.form = response.dpia
        }).catch()
    },
  },
}
</script>
