<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :md="16">
        <v-stepper model-value="0" non-linear editable hide-actions :items="stepperItems">
          <template v-slot:item.1>
            <el-row :gutter="20">
              <el-col :md="24">
                <el-form-group label="Likelihood">
                  <!-- <el-tooltip
                    target="likelihood"
                    title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                  /> -->
                  <small>Likelihood</small>
                  <el-select
                    v-model="form.likelihood_of_occurence"
                    placeholder="Select Likelihood Value"
                    @change="updateField($event, 'likelihood_of_occurence')"
                  >
                    <el-option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="parseInt(likelihood.value)"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Likelihood Rationale">
                  <span>Likelihood Rationale <code>(Based on the Likelihood settings)</code>:</span>
                  <br />
                  <div v-html="form.likelihood_rationale"></div>
                </el-form-group>
              </el-col>
              <el-col
                v-for="(impact_data, impact_data_index) in form.impact_data"
                :key="`impact1-${impact_data_index}`"
                :md="12"
              >
                <el-form-group :label="impact_data.name">
                  <small>{{ impact_data.name }}</small>
                  <!-- <el-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <el-select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    @change="updateField($event, 'impact_data', impact_data.slug)"
                  >
                    <el-option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="`${parseInt(impact.value)}`"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col
                v-for="(impact_data, impact_data_index) in form.impact_on_areas"
                :key="`impact2-${impact_data_index}`"
                :md="12"
              >
                <el-form-group :label="impact_data.name">
                  <small>{{ impact_data.name }}</small>
                  <!-- <el-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <el-select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    @change="updateField($event, 'impact_on_areas', impact_data.slug)"
                  >
                    <el-option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="`${parseInt(impact.value)}`"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <h3>Impact Value: {{ form.impact_of_occurence }}</h3>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Impact Rationale">
                  <span>Impact Rationale:</span>
                  <span v-html="form.impact_rationale"></span>
                </el-form-group>
              </el-col>
            </el-row>
          </template>

          <template v-slot:item.2>
            <risk-treatment-options
              :selected-data="form"
              :risk-score="form.risk_score"
              :risk-appetite="riskAppetite"
              @selected="resetForm"
            />
          </template>

          <template v-slot:item.3>
            <el-row :gutter="20">
              <el-col :md="24">
                <el-form-group label="Control/Mitigating Actions">
                  <small>Control/Mitigating Actions</small>
                  <Editor
                    v-model="form.recommended_control"
                    @blur="updateField(form.recommended_control, 'recommended_control')"
                  />
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Control Effectiveness Level">
                  <small>Control Effectiveness Level</small>
                  <el-select
                    v-model="form.control_effectiveness_level"
                    placeholder="Select"
                    @change="updateField($event, 'control_effectiveness_level')"
                  >
                    <el-option
                      v-for="(assessment_option, option_index) in assessment_options"
                      :key="option_index"
                      :label="assessment_option"
                      :value="assessment_option"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Likelihood">
                  <!-- <el-tooltip
                      target="revised_likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
                  <small>Likelihood</small>
                  <el-select
                    id="revised_likelihood"
                    v-model="form.revised_likelihood_of_occurence"
                    placeholder="Select Likelihood Value"
                    @change="updateField($event, 'revised_likelihood_of_occurence')"
                  >
                    <el-option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="parseInt(likelihood.value)"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Likelihood Rationale">
                  <span>Likelihood Rationale <code>(Based on the Likelihood settings)</code>:</span>
                  <br />
                  <div v-html="form.revised_likelihood_rationale"></div>
                  <!-- <textarea
                    id="revised_likelihood_rationale"
                    v-model="form.revised_likelihood_rationale"
                    class="form-control"
                    type="text"
                    disabled
                  ></textarea> -->
                </el-form-group>
              </el-col>
              <el-col
                v-for="(impact_data, impact_data_index) in form.revised_impact_data"
                :key="`r_impact1-${impact_data_index}`"
                :md="12"
              >
                <el-form-group :label="impact_data.name">
                  <small>{{ impact_data.name }}</small>
                  <el-select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    @change="updateField($event, 'revised_impact_data', impact_data.slug)"
                  >
                    <el-option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="`${parseInt(impact.value)}`"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col
                v-for="(impact_data, impact_data_index) in form.revised_impact_on_areas"
                :key="`r_impact2-${impact_data_index}`"
                :md="12"
              >
                <el-form-group :label="impact_data.name">
                  <small>{{ impact_data.name }}</small>
                  <el-select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    @change="updateField($event, 'revised_impact_on_areas', impact_data.slug)"
                  >
                    <el-option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="`${parseInt(impact.value)}`"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Impact Rationale">
                  <span>Impact Rationale:</span>
                  <span v-html="form.revised_impact_rationale"></span>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <h3>Impact Value: {{ form.revised_impact_of_occurence }}</h3>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Comments">
                  <small>Comments</small>
                  <Editor v-model="form.comments" @blur="updateField(form.comments, 'comments')" />
                </el-form-group>
              </el-col>
            </el-row>
          </template>
        </v-stepper>
        <el-row>
          <el-col :md="24">
            <el-form-group label="Key Risk Indicator">
              <small>Key Risk Indicator</small>
              <textarea
                v-model="form.key_risk_indicator"
                placeholder=""
                class="form-control"
                row="5"
                @blur="updateField($event.target.value, 'key_risk_indicator')"
              ></textarea>
            </el-form-group>
          </el-col>
        </el-row>
        <P />
        <el-button type="primary" @click="formSubmitted()"> Done </el-button>
      </el-col>
      <el-col :md="8">
        <div v-if="selectedData !== null">
          <div
            :style="`
              background: ${setCoolBackground()};
              padding: 10px;
              border-radius: 5px;
              border: 2px solid ${setCoolBackground(0.9)};
              border-radius: 5px;
            `"
          >
            <!-- <span class="pull-right"><img src="images/pin.png"></span>
            <span><img src="images/pin.png"></span><br> -->
            <h3
              ><strong>Risk ID: {{ selectedData.risk_id }}</strong></h3
            >
            <p>
              <strong>Threat:</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.threat"></span>
            </p>

            <div v-if="selectedData.business_unit !== null">
              <p>
                <strong>Business Unit:</strong><br />
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.business_unit"></span>
              </p>
              <p>
                <strong>Business Process:</strong><br />
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.business_process"></span>
              </p>
            </div>
            <div v-if="selectedData.asset_type_name !== null">
              <p>
                <strong>Asset Type:</strong><br />
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.asset_type_name"></span>
              </p>
              <p>
                <strong>Asset:</strong><br />
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="selectedData.asset_name"></span>
              </p>
            </div>
            <p>
              <strong>Risk Owner:</strong><br />
              {{ selectedData.risk_owner }}
            </p>
            <p>
              <strong>Vulnerabilities:</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.vulnerability_description"></span>
            </p>
            <p>
              <strong>Existing Controls:</strong><br />
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.control_description"></span>
            </p>
          </div>
        </div>
        <hr />
        <aside>
          <div align="center">
            <h4>Risk Analysis</h4>
            <img :src="changeImpactImage(form.risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ form.risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ form.risk_level }}</strong>
          </p>
        </aside>
        <hr />
        <aside v-if="form.treatment_option === 'Mitigate'">
          <div align="center">
            <h4>Post Treatment Risk Analysis</h4>
            <img :src="changeImpactImage(form.revised_risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ form.revised_risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ form.revised_risk_level }}</strong>
          </p>
        </aside>
      </el-col>
    </el-row>
    <el-dialog
      v-model="showTreatmentModal"
      title="Risk Treatment Option"
      centered
      size="md"
      hide-footer
    >
      <div>
        <div>
          <el-alert :type="treatment_alert_type" :closable="false">
            {{ treatment_comment }}
          </el-alert>
        </div>
        <div v-if="!showTreatmentOption">
          <el-button
            type="success"
            @click="(updateField('Accept', 'treatment_option'), (showTreatmentModal = false))"
          >
            Accept
          </el-button>
          <el-button type="default" @click="showTreatmentOption = true">
            I want to explore other options
          </el-button>
        </div>
        <div v-else>
          <p>Select your option</p>
          <el-select
            v-model="form.treatment_option"
            placeholder="Select Option"
            @change="
              (updateField($event.target.value, 'treatment_option'), (showTreatmentModal = false))
            "
          >
            <el-option
              v-for="(treatment_option, option_index) in treatment_options"
              :key="option_index"
              :label="treatment_option"
              :value="treatment_option"
            />
          </el-select>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'
import RiskTreatmentOptions from './RiskTreatmentOptions.vue'
import { setCoolBackground } from '@/utils/tsxHelper'

export default {
  components: {
    Editor,
    RiskTreatmentOptions
  },
  props: {
    selectedData: {
      type: Object,
      required: true
    },
    riskAppetite: {
      type: Number,
      required: true
    },
    likelihoods: {
      type: Array,
      default: () => {}
    },
    impacts: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
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
        comments: ''
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
      stepperItems: []
    }
  },
  watch: {
    selectedData() {
      this.fetchDetails()
    },
    form() {
      this.updateStepperItems()
    }
  },
  created() {
    this.fetchDetails()
  },
  methods: {
    setCoolBackground,
    updateStepperItems() {
      const items = ['Analysis']
      if (this.form.risk_score !== null) {
        items.push('Treatment')
      }
      if (this.form.treatment_option === 'Mitigate') {
        items.push('Post-Treatment')
      }
      this.stepperItems = items
    },
    resetForm(data) {
      this.form = data
    },
    changeImpactImage(str) {
      if (str) {
        return `/images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return '/images/project-icons/no-impact-level.png'
    },
    treatRisk() {
      const assessment = this.form
      const riskValue = assessment.risk_score
      const { riskAppetite } = this
      if (riskValue <= riskAppetite) {
        this.treatment_comment = `Risk Score of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk, it's up to you.`
        this.treatment_alert_type = 'success'
        this.showTreatmentOption = false
      } else {
        this.treatment_comment = `Risk Score of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        this.treatment_alert_type = 'error'
        this.showTreatmentOption = true
      }
      this.showTreatmentModal = true
    },
    updateField(value, field, subField = '') {
      const params = {
        field,
        value,
        sub_field: subField
      }

      // assessment.loader = true
      const updateResources = new Resource('risk-assessment/update-fields')
      updateResources
        .update(this.selectedData.id, params)
        .then((response) => {
          this.form = response
        })
        .catch(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.selectedData.loader = false
        })
    },
    fetchDetails() {
      this.loading = true
      const fetchDetailsResources = new Resource('risk-assessment/details')
      fetchDetailsResources
        .get(this.selectedData.id)
        .then((response) => {
          this.form = response.risk_assessment
          this.form.impact_rationale = response.risk_assessment.impact_rationale
            ? response.risk_assessment.impact_rationale
            : ''
          this.form.revised_impact_rationale = response.risk_assessment.revised_impact_rationale
            ? response.risk_assessment.revised_impact_rationale
            : ''

          this.form.recommended_control = response.risk_assessment.recommended_control
            ? response.risk_assessment.recommended_control
            : ''

          this.form.comments = response.risk_assessment.comments
            ? response.risk_assessment.comments
            : ''
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    formSubmitted() {
      this.$emit('updated')
    }
  }
}
</script>
