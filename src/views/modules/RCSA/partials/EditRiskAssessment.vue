<template>
  <div v-loading="loading">
    <b-row class="match-height">
      <b-col md="8">
        <div
          style="background: #f7f0da; padding: 10px;"
        >
          <span class="pull-right"><img src="images/pin.png"></span>
          <span><img src="images/pin.png"></span><br>
          <strong>Risk Description:</strong><br>
          <!-- eslint-disable-next-line vue/no-v-html-->
          <small v-html="form.vulnerability_description" /><br>
        </div>
        <app-collapse
          accordion
          type="margin"
        >
          <app-collapse-item
            title="IMPACT ANALYSIS"
          >

            <b-row>
              <b-col
                v-for="(impact_data, impact_data_index) in form.impact_data"
                :key="impact_data_index"
                md="12"
              >
                <b-form-group
                  :label="impact_data.name"
                >
                  <select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'impact_data', impact_data.slug)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Impact of Occurence"
                >
                  {{ form.impact_of_occurence }}
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Likelihood of Occurence"
                >
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
                  <code>Value is based on the Likelihood settings</code>
                  <textarea
                    id="likelihood_rationale"
                    v-model="form.likelihood_rationale"
                    class="form-control"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Impact Rationale"
                >
                  <code>Value is based on the Impact Analysis settings</code>
                  <ckeditor
                    id="impact_rationale"
                    v-model="form.impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            title="TREATMENT"
          >
            <risk-treatment-options
              :selected-data="form"
              :risk-score="form.overall_risk_rating"
              :risk-appetite="riskAppetite"
              table="rcsa_risk_assessments"
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
              <b-col
                v-for="(impact_data, revised_impact_data_index) in form.revised_impact_data"
                :key="`${revised_impact_data_index}_post`"
                md="12"
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
                      v-for="(impact, r_index) in impacts"
                      :key="r_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Impact of Occurence"
                >
                  {{ form.revised_impact_of_occurence }}
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Likelihood of Occurence"
                >
                  <select
                    id="likelihood"
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
                  <code>Value is based on the Likelihood settings</code>
                  <textarea
                    id="revised_likelihood_rationale"
                    v-model="form.revised_likelihood_rationale"
                    class="form-control"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Impact Rationale"
                >
                  <code>Value is based on the Impact Analysis settings</code>
                  <ckeditor
                    id="impact_rationale"
                    v-model="form.revised_impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
        </app-collapse>
        <p />
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
        <p />
        <el-button
          type="primary"
          @click="$emit('updated')"
        >
          Done
        </el-button>
      </b-col>
      <b-col
        md="4"
      >
        <aside>
          <div align="center">
            <h4>Risk Values</h4>
            <img
              :src="changeImpactImage(form.risk_category)"
            >
          </div>
          <p>
            Risk Rating: <strong>{{ form.overall_risk_rating }}</strong><br>
            Inherent Risk Rating: <strong>{{ form.risk_category }}</strong>
          </p>
          <hr>
          <div v-if="form.treatment_option === 'Mitigate'">
            <div align="center">
              <h4>Post-Treatment Values</h4>
              <img
                :src="changeImpactImage(form.revised_risk_category)"
              >
            </div>
            <p>
              Risk Rating: <strong>{{ form.revised_overall_risk_rating }}</strong><br>
              Residual Risk Rating: <strong>{{ form.revised_risk_category }}</strong>
            </p>
          </div>
        </aside>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import RiskTreatmentOptions from '@/views/modules/risk-assessment/partials/RiskTreatmentOptions.vue'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    AppCollapse,
    AppCollapseItem,
    RiskTreatmentOptions,
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
        risk_score: '',
        risk_level: '',
        treatment_option: '',
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
      uploadableFile: null,
      risk_registers: [],
      risk_scenerios: [],
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
      asset_types: [],
      assets: [],
      selectedAssetTypeId: '',
      risk_appetite: null,
    }
  },
  created() {
    this.form = this.selectedData
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
    updateField(value, field, subField = '') {
      const app = this
      const params = {
        field, value, sub_field: subField,
      }
      // eslint-disable-next-line no-param-reassign
      // assessment.loader = true
      const updateResources = new Resource('rcsa/update-risk-assessment-fields')
      updateResources.update(app.selectedData.id, params)
        .then(response => {
          // app.risk_assessments[assessment.index] = response
          // app.fetchRiskAssessments(false)
          app.form = response
          // eslint-disable-next-line no-param-reassign
          app.selectedData.loader = false
        }).catch(() => {
          // eslint-disable-next-line no-param-reassign
          app.selectedData.loader = false
        })
    },
    // updateField(value, field) {
    //   const app = this
    //   const params = {
    //     field, value,
    //   }
    //   const updateResources = new Resource('dpia/update')
    //   updateResources.update(app.selectedData.id, params)
    //     .then(response => {
    //       app.form = response.dpia
    //     }).catch()
    // },
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
