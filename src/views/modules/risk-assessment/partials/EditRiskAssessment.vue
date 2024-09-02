<template>
  <div v-loading="loading">
    <b-row class="match-height">
      <b-col md="8">
        <app-collapse
          accordion
          type="margin"
        >
          <app-collapse-item
            title="RISK ANALYSIS"
            :is-visible="true"
          >

            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Likelihood"
                >
                  <!-- <b-tooltip
                    target="likelihood"
                    title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                  /> -->
                  <select
                    id="likelihood"
                    v-model="form.likelihood_of_occurence"
                    placeholder="Select Likelihood Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'likelihood_of_occurence')"
                  >
                    <option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="likelihood.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Likelihood Rationale"
                >

                  <!-- <b-tooltip
                      target="likelihood_rationale"
                      title="The role that is responsible for the personal data"
                    /> -->
                  <code>Value is based on the Likelihood settings</code>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <!-- <span v-html="form.likelihood_rationale" /> -->
                  <textarea
                    id="likelihood_rationale"
                    v-model="form.likelihood_rationale"
                    class="form-control"
                    disabled
                  />
                  <!-- <textarea
                      id="likelihood_rationale"
                      v-model="form.likelihood_rationale"
                      placeholder="Likelihood Rationale"
                      class="form-control"
                      type="text"
                      @blur="updateField($event.target.value, 'likelihood_rationale')"
                    /> -->
                </b-form-group>
              </b-col>
              <b-col
                v-for="(impact_data, impact_data_index) in form.impact_data"
                :key="`impact1-${impact_data_index}`"
                md="6"
              >
                <b-form-group
                  :label="impact_data.name"
                >
                  <!-- <b-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'impact_data', impact_data.slug)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col
                v-for="(impact_data, impact_data_index) in form.impact_on_areas"
                :key="`impact2-${impact_data_index}`"
                md="6"
              >
                <b-form-group
                  :label="impact_data.name"
                >
                  <!-- <b-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'impact_on_areas', impact_data.slug)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3>Impact Value: {{ form.impact_of_occurence }}</h3>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Impact Rationale"
                >
                  <code>Value is based on the Impact Analysis settings</code>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <!--       -->
                  <ckeditor
                    id="impact_rationale"
                    v-model="form.impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                  <!-- <b-tooltip
                      target="impact_rationale"
                      title="The role that is responsible for the personal data"
                    />
                    <textarea
                      id="impact_rationale"
                      v-model="form.impact_rationale"
                      placeholder="Impact Rationale"
                      class="form-control"
                      type="text"
                      @blur="updateField($event.target.value, 'impact_rationale')"
                    /> -->
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            v-if="form.risk_score !== null"
            title="TREATMENT"
          >
            <risk-treatment-options
              :selected-data="form"
              :risk-score="form.risk_score"
              :risk-appetite="riskAppetite"
              @selected="resetForm"
            />
          </app-collapse-item>
          <app-collapse-item
            v-if="form.treatment_option === 'Mitigate'"
            title="POST-TREATMENT"
          >

            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Control/Mitigating Actions"
                >
                  <ckeditor
                    id="recommended_control"
                    v-model="form.recommended_control"
                    :editor="editor"
                    :config="editorConfig"
                    @blur="updateField(form.recommended_control, 'recommended_control')"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Control Effectiveness Level"
                >
                  <select
                    v-model="form.control_effectiveness_level"
                    placeholder="Select"
                    class="form-control"
                    @change="updateField($event.target.value, 'control_effectiveness_level')"
                  >
                    <option
                      v-for="(assessment_option, option_index) in assessment_options"
                      :key="option_index"
                      :label="assessment_option"
                      :value="assessment_option"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Likelihood"
                >
                  <!-- <b-tooltip
                      target="revised_likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
                  <select
                    id="revised_likelihood"
                    v-model="form.revised_likelihood_of_occurence"
                    placeholder="Select Likelihood Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_likelihood_of_occurence')"
                  >
                    <option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="likelihood.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Likelihood Rationale"
                >

                  <!-- <b-tooltip
                      target="revised_likelihood_rationale"
                      title="The role that is responsible for the personal data"
                    /> -->
                  <textarea
                    id="revised_likelihood_rationale"
                    v-model="form.revised_likelihood_rationale"
                    class="form-control"
                    type="text"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col
                v-for="(impact_data, impact_data_index) in form.revised_impact_data"
                :key="`r_impact1-${impact_data_index}`"
                md="6"
              >
                <b-form-group
                  :label="impact_data.name"
                >
                  <select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_impact_data', impact_data.slug)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col
                v-for="(impact_data, impact_data_index) in form.revised_impact_on_areas"
                :key="`r_impact2-${impact_data_index}`"
                md="6"
              >
                <b-form-group
                  :label="impact_data.name"
                >
                  <!-- <b-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_impact_on_areas', impact_data.slug)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Impact Rationale"
                >

                  <ckeditor
                    id="revised_impact_rationale"
                    v-model="form.revised_impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                  <!-- <textarea
                      id="revised_impact_rationale"
                      v-model="form.revised_impact_rationale"
                      placeholder="Impact Rationale"
                      class="form-control"
                      type="text"
                      @blur="updateField($event.target.value, 'revised_impact_rationale')"
                    /> -->
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3>Impact Value: {{ form.revised_impact_of_occurence }}</h3>
              </b-col>
              <b-col
                md="12"
              >
                <b-form-group
                  label="Comments"
                >
                  <!-- <b-tooltip
                      target="comments"
                      title="Any other relevant information"
                    />
                    <textarea
                      id="comments"
                      v-model="form.comments"
                      class="form-control"
                      @blur="updateField($event.target.value, 'comments');"
                    /> -->
                  <ckeditor
                    id="comments"
                    v-model="form.comments"
                    :editor="editor"
                    :config="editorConfig"
                    @blur="updateField(form.comments, 'comments');"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
        </app-collapse>
        <b-row>
          <b-col
            md="12"
          >
            <b-form-group
              label="Key Risk Indicator"
            >
              <textarea
                v-model="form.key_risk_indicator"
                placeholder=""
                class="form-control"
                row="5"
                @blur="updateField($event.target.value, 'key_risk_indicator')"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <P />
        <b-button
          gradient="primary"
          @click="formSubmitted()"
        >
          Done
        </b-button>
      </b-col>
      <b-col
        md="4"
      >
        <div
          v-if="selectedData !== null"
        >
          <div
            style="background: #f7f0da; padding: 10px; border-radius: 5px; border: 2px solid #d2a204; border-radius: 5px;"
          >
            <!-- <span class="pull-right"><img src="images/pin.png"></span>
            <span><img src="images/pin.png"></span><br> -->
            <h3><strong>Risk: {{ selectedData.risk_id }}</strong></h3>
            <p>
              <strong>Threat:</strong><br>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.threat" />
            </p>

            <div v-if="selectedData.business_unit !== null">
              <p>
                <strong>Business Unit:</strong><br>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.business_unit" />
              </p>
              <p>
                <strong>Business Process:</strong><br>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.business_process" />
              </p>
            </div>
            <div v-if="selectedData.asset_type_name !== null">
              <p>
                <strong>Asset Type:</strong><br>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.asset_type_name" />
              </p>
              <p>
                <strong>Asset:</strong><br>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.asset_name" />
              </p>
            </div>
            <p>
              <strong>Risk Owner:</strong><br>
              {{ selectedData.risk_owner }}
            </p>
            <p>
              <strong>Risk Description:</strong><br>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.vulnerability_description" />
            </p>
            <p>
              <strong>Existing Controls:</strong><br>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.control_description" />
            </p>
          </div>
        </div>
        <hr>
        <aside>
          <div align="center">
            <h4>Risk Analysis</h4>
            <img
              :src="changeImpactImage(form.risk_level)"
            >
          </div>
          <p>
            Risk Score: <strong>{{ form.risk_score }}</strong><br>
            Risk Level: <strong>{{ form.risk_level }}</strong>
          </p>
        </aside>
        <hr>
        <aside v-if="form.treatment_option === 'Mitigate'">
          <div align="center">
            <h4>Post Treatment Risk Analysis</h4>
            <img
              :src="changeImpactImage(form.revised_risk_level)"
            >
          </div>
          <p>
            Risk Score: <strong>{{ form.revised_risk_score }}</strong><br>
            Risk Level: <strong>{{ form.revised_risk_level }}</strong>
          </p>
        </aside>
      </b-col>
    </b-row>
    <b-modal
      v-model="showTreatmentModal"
      title="Risk Treatment Option"
      centered
      size="md"
      hide-footer
    >
      <div>
        <div>
          <el-alert
            :type="treatment_alert_type"
            :closable="false"
          >
            {{ treatment_comment }}
          </el-alert>
        </div>
        <div v-if="!showTreatmentOption">
          <el-button
            type="success"
            @click="updateField('Accept', 'treatment_option'); showTreatmentModal = false"
          >
            Accept
          </el-button>
          <el-button
            type="default"
            @click="showTreatmentOption = true"
          >
            I want to explore other options
          </el-button>
        </div>
        <div v-else>
          <p>Select your option</p>
          <select
            v-model="form.treatment_option"
            class="form-control"
            placeholder="Select Option"
            @change="updateField($event.target.value, 'treatment_option'); showTreatmentModal = false"
          >
            <option
              v-for="(treatment_option, option_index) in treatment_options"
              :key="option_index"
              :label="treatment_option"
              :value="treatment_option"
            />
          </select>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup, BModal, BButton,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import RiskTreatmentOptions from './RiskTreatmentOptions.vue'

export default {
  components: {
    BModal,
    BRow,
    BCol,
    BFormGroup,
    AppCollapse,
    AppCollapseItem,
    RiskTreatmentOptions,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedData: {
      type: Object,
      required: true,
    },
    riskAppetite: {
      type: Number,
      required: true,
    },
    likelihoods: {
      type: Array,
      default: () => ({}),
    },
    impacts: {
      type: Array,
      default: () => ({}),
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        personal_data_asset: '',
        risk_scenerio: '',
        risk_owner: '',
        existing_controls: '',
        likelihood: '',
        likelihood_rationale: '',
        impact: '',
        impact_rationale: '',
        risk_score: null,
        risk_level: '',
        treatment_option: '',
        treatment_option_details: [],
        treatment_actions: '',
        revised_likelihood: '',
        revised_likelihood_rationale: '',
        revised_impact: '',
        rivised_impact_rationale: '',
        revised_risk_score: '',
        revised_risk_level: '',
        comments: '',
      },
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      assessment_options: ['Effective', 'Ineffective', 'Sub-optimal'],
      loading: false,
      selectedClient: {},
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
    }
  },
  watch: {
    selectedData() {
      this.fetchDetails()
    },
  },
  created() {
    this.fetchDetails()
  },
  methods: {
    resetForm(data) {
      const app = this
      app.form = data
    },
    changeImpactImage(str) {
      if (str) {
        return `images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return 'images/project-icons/no-impact-level.png'
    },
    treatRisk() {
      const app = this
      const assessment = app.form
      const riskValue = assessment.risk_score
      const { riskAppetite } = app
      if (riskValue <= riskAppetite) {
        app.treatment_comment = `Risk Score of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk, it's up to you.`
        app.treatment_alert_type = 'success'
        app.showTreatmentOption = false
      } else {
        app.treatment_comment = `Risk Score of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        app.treatment_alert_type = 'error'
        app.showTreatmentOption = true
      }
      app.showTreatmentModal = true
    },
    updateField(value, field, subField = '') {
      const app = this
      const params = {
        field, value, sub_field: subField,
      }
      // eslint-disable-next-line no-param-reassign
      // assessment.loader = true
      const updateResources = new Resource('risk-assessment/update-fields')
      updateResources.update(app.selectedData.id, params)
        .then(response => {
          app.form = response
        }).catch(() => {
          // eslint-disable-next-line no-param-reassign
          app.selectedData.loader = false
        })
    },
    fetchDetails() {
      const app = this
      app.loading = true
      const fetchDetailsResources = new Resource('risk-assessment/details')
      fetchDetailsResources.get(app.selectedData.id)
        .then(response => {
          app.form = response.risk_assessment
          app.form.impact_rationale = (response.risk_assessment.impact_rationale) ? response.risk_assessment.impact_rationale : ''
          app.form.revised_impact_rationale = (response.risk_assessment.revised_impact_rationale) ? response.risk_assessment.revised_impact_rationale : ''
          app.loading = false
        }).catch(() => {
          // eslint-disable-next-line no-param-reassign
          app.loading = false
        })
    },
    formSubmitted() {
      const app = this
      app.$emit('updated')
    },
  },
}
</script>
