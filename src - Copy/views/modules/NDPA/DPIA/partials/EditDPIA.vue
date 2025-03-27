<template>
  <div v-loading="loading">
    <b-row class="match-height">
      <b-col md="8">
        <app-collapse
          accordion
          type="margin"
        >
          <app-collapse-item
            title="RISK DESCRIPTION"
            :is-visible="true"
          >

            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Business Unit"
                >
                  <textarea
                    v-model="form.business_unit"
                    disabled
                    class="form-control"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Business Process"
                >
                  <textarea
                    v-model="form.business_process"
                    disabled
                    class="form-control"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Personal Data Asset"
                >
                  <!-- <b-tooltip
                    target="personal_data_asset"
                    title="The personal data that could be affected by the risk. Could be defined at individual data item level e.g. date of birth, or as a group of data items e.g. delivery information."
                  /> -->
                  <code>Fed in from PDA</code>
                  <textarea
                    id="personal_data_asset"
                    v-model="form.personal_data_asset"
                    class="form-control"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Risk Scenerio"
                >
                  <b-tooltip
                    target="risk_scenerio"
                  />
                  <a
                    style="color: #409EFF"
                    @click="showRisksForm = true"
                  > <i class="el-icon-plus" /> Click to pick from Risk Register</a>
                  <ckeditor
                    id="risk_scenerio"
                    v-model="form.risk_scenerio"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                  <!-- <textarea
                    id="risk_scenerio"
                    v-model="form.risk_scenerio"
                    placeholder="Enter Risk Scenerio"
                    class="form-control"
                    @blur="updateField($event.target.value, 'risk_scenerio')"
                  /> -->
                </b-form-group>
              </b-col>
              <b-col
                md="12"
              >
                <b-form-group
                  label="Existing Controls"
                >
                  <code>Fed in from risk register selection</code>
                  <ckeditor
                    id="existing_controls"
                    v-model="form.existing_controls"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                  <!-- <textarea
                    v-model="form.existing_controls"
                    placeholder="Existing Control"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'existing_controls')"
                  /> -->
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Risk Owner"
                >
                  <code>This is also the business process owner</code>
                  <input
                    v-model="form.risk_owner"
                    placeholder="Risk owner"
                    disabled
                    class="form-control"
                  >
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            title="RISK ANALYSIS"
          >

            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Likelihood"
                >
                  <b-tooltip
                    target="likelihood"
                    title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                  />
                  <select
                    id="likelihood"
                    v-model="form.likelihood"
                    placeholder="Select Likelihood Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'likelihood')"
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
              <b-col md="12">
                <b-form-group
                  label="Impact"
                >
                  <b-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  />
                  <select
                    id="impact"
                    v-model="form.impact"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'impact')"
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
              <!-- <b-col md="12">
                <b-form-group
                  label="Risk Score"
                >

                  <b-tooltip
                    target="risk_score"
                    title="The role that is responsible for the personal data"
                  />
                  <input
                    id="risk_score"
                    v-model="form.risk_score"
                    placeholder="Risk Score"
                    class="form-control"
                    type="number"
                    disabled
                  >
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Risk Level"
                >

                  <b-tooltip
                    target="risk_level"
                    title="The role that is responsible for the personal data"
                  />
                  <input
                    id="risk_level"
                    v-model="form.risk_level"
                    placeholder="Risk Level"
                    type="text"
                    disabled
                  >
                </b-form-group>
              </b-col> -->
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            title="TREATMENT"
          >
            <risk-treatment-options
              :selected-data="form"
              :risk-score="form.risk_score"
              :risk-appetite="riskAppetite"
              table="d_p_i_assessments"
              @selected="resetForm"
            />
            <!-- <b-row>
              <b-col md="12">
                <b-form-group
                  label="Treatment Actions"
                >

                  <el-button
                    v-if="form.risk_score !== null && form.risk_score > 0"
                    type="success"
                    plain
                    @click="treatRisk()"
                  >
                    Click to Treat
                  </el-button>
                  <p />
                  <h4><strong>{{ form.treatment_option }}</strong></h4>
                </b-form-group>
                <hr>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Treatment Actions"
                >

                  <b-tooltip
                    target="treatment_actions"
                    title="The role that is responsible for the personal data"
                  />
                  <textarea
                    id="treatment_actions"
                    v-model="form.treatment_actions"
                    placeholder="Treatment Actions"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'treatment_actions')"
                  />
                </b-form-group>
              </b-col>
            </b-row> -->
          </app-collapse-item>
          <app-collapse-item
            v-if="form.treatment_option === 'Mitigate'"
            title="POST-TREATMENT"
          >

            <b-row>
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
                    v-model="form.revised_likelihood"
                    placeholder="Select Likelihood Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_likelihood')"
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
              <b-col md="12">
                <b-form-group
                  label="Post-Treatment Impact"
                >
                  <!-- <b-tooltip
                    target="revised_impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <select
                    id="revised_impact"
                    v-model="form.revised_impact"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_impact')"
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
              <!-- <b-col md="12">
                <b-form-group
                  label="Risk Score"
                >
                  <input
                    id="revised_risk_score"
                    v-model="form.revised_risk_score"
                    placeholder="Risk Score"
                    class="form-control"
                    type="number"
                    disabled
                  >
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Risk Level"
                >

                  <b-tooltip
                    target="revised_risk_level"
                    title="The role that is responsible for the personal data"
                  />
                  <input
                    id="revised_risk_level"
                    v-model="form.revised_risk_level"
                    placeholder="Risk Level"
                    class="form-control"
                    type="text"
                    disabled
                  >
                </b-form-group>
              </b-col> -->
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
                    @blur="updateField($event.target.value, 'comments');"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
        </app-collapse>
        <P />
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
            <h4>Pre-Treatment Values</h4>
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
            <h4>Post-Treatment Values</h4>
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
      v-model="showRisksForm"
      title="Select Risks"
      centered
      size="xl"
      hide-footer
    >
      <v-client-table
        v-model="risk_registers"
        :columns="columns"
        :options="options"
      >
        <div
          slot="select"
          slot-scope="{row}"
        >
          <el-checkbox
            v-model="risk_scenerios"
            :label="row.risk_id"
            border
          />
        </div>
      </v-client-table>
      <aside>
        <el-button
          type="primary"
          @click="setRiskScenerios()"
        >
          Done
        </el-button>
      </aside>
    </b-modal>
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
  BRow, BCol, BFormGroup, BTooltip,
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
    BTooltip,
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
      columns: [
        'select',
        'risk_id',
        'vulnerability_description',
        'control_description',
      ],
      options: {
        headings: {
          risk_id: 'REF',
          vulnerability_description: 'Risk Desc',
          control_description: 'Control',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: ['risk_id', 'vulnerability_description', 'control_description'],
        // filterable: false,
        filterable: ['risk_id', 'vulnerability_description', 'control_description'],
      },
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
    }
  },
  created() {
    this.form = this.selectedData
    this.fetchRiskRegister()
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
    fetchRiskRegister() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource.list({ client_id: app.selectedData.client_id, business_unit_id: app.selectedData.business_unit_id })
        .then(response => {
          app.risk_registers = response.risk_registers
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    setRiskScenerios() {
      const app = this
      app.showRisksForm = false
      let scenerio = '<ul>'
      let control = '<ul>'
      app.risk_scenerios.forEach(riskId => {
        const fileteredRiskRegister = app.risk_registers.filter(riskRegister => riskRegister.risk_id === riskId)
        scenerio += `<li> ${fileteredRiskRegister[0].vulnerability_description}</li>`
        control += `<li> ${fileteredRiskRegister[0].control_description}</li>`
      })
      app.form.risk_scenerio = scenerio
      app.form.existing_controls = control
      app.updateField(scenerio, 'risk_scenerio')
      app.updateField(control, 'existing_controls')
    },
    updateField(value, field) {
      const app = this
      const params = {
        field, value,
      }
      const updateResources = new Resource('dpia/update')
      updateResources.update(app.selectedData.id, params)
        .then(response => {
          app.form = response.dpia
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
