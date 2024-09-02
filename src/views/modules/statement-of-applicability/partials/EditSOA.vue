<template>
  <div v-loading="loading">
    <b-row class="match-height">
      <b-col md="7">
        <b-row>
          <b-col md="12">
            <b-form-group
              label="Is the Control Applicable?"
            >

              <select
                v-model="form.applicable"
                class="form-control"
                placeholder="Applicable"
                style="width: 100%"
                @input="saveSOA('applicable', $event.target.value, form.id)"
              >
                <option value="Yes">
                  Yes
                </option>
                <option value="No">
                  No
                </option>
              </select>
            </b-form-group>
          </b-col>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">
            <b-row>
              <b-col md="12">
                <h3>Reasons for Selection</h3>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Legal/Contractual Requirement"
                >

                  <select
                    v-model="form.legal_requirement"
                    class="form-control"
                    placeholder="Implemented"
                    style="width: 100%"
                    @input="saveSOA('legal_requirement', $event.target.value, form.id)"
                  >
                    <option value="Yes">
                      Yes
                    </option>
                    <option value="No">
                      No
                    </option>
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Business Requirement"
                >

                  <select
                    v-model="form.business_requirement"
                    class="form-control"
                    placeholder="business_requirement"
                    style="width: 100%"
                    @input="saveSOA('business_requirement', $event.target.value, form.id)"
                  >
                    <option value="Yes">
                      Yes
                    </option>
                    <option value="No">
                      No
                    </option>
                  </select>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Result of Risk Assessment"
                >

                  <select
                    v-model="form.result_of_risk_assessment"
                    class="form-control"
                    placeholder="result_of_risk_assessment"
                    style="width: 100%"
                    @input="saveSOA('result_of_risk_assessment', $event.target.value, form.id)"
                  >
                    <option value="Yes">
                      Yes
                    </option>
                    <option value="No">
                      No
                    </option>
                  </select>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
          <b-col md="12">
            <b-form-group
              label="Kindly provide description of controls/justification for exclusion"
            >

              <textarea
                v-model="form.justification_of_exclusion"
                class="form-control"
                placeholder="Description of Controls/Justification for Exclusion"
                style="width: 100%"
                @blur="saveSOA('justification_of_exclusion', $event.target.value, form.id)"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Reference to Control Document/Evidence"
            >

              <textarea
                v-model="form.reference_to_control_document"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('reference_to_control_document', $event.target.value, form.id)"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Is the control implemented"
            >

              <select
                v-model="form.implemented"
                class="form-control"
                placeholder="Implemented"
                style="width: 100%"
                @input="saveSOA('implemented', $event.target.value, form.id)"
              >
                <option value="Fully Implemented">
                  Fully Implemented
                </option>
                <option value="Partially Implemented">
                  Partially Implemented
                </option>
                <option value="Not Implemented">
                  Not Implemented
                </option>
              </select>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Additional Controls Required (if any)"
            >

              <textarea
                v-model="form.addition_control_required"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('addition_control_required', $event.target.value, form.id)"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Specify Assets"
            >
              <el-alert
                type="info"
                :closable="false"
              >
                This field defines the assets which controls are applicable to e.g policies for information security applies to 'people' (staff, intern, guest)  OR other assets such as software, equipments, data etc.
              </el-alert>
              <br>
              <el-select
                v-model="form.assets"
                filterable
                multiple
                style="width: 100%"
                @input="saveSOA('assets', $event, form.id)"
              >
                <el-option
                  v-for="(asset_type, index) in asset_types"
                  :key="index"
                  :value="asset_type.name"
                  :label="asset_type.name"
                />
              </el-select>
              <p>
                <el-tag
                  v-for="asset in form.assets"
                  :key="asset"
                  type="success"
                >
                  {{ asset }}
                </el-tag>
              </p>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="State Risk"
            >
              <el-alert
                type="info"
                :closable="false"
              >
                A potential for a loss OR Something that hasn't happen yet but has a probability of occuring in the future if control(s) are not applied.
              </el-alert>
              <br>
              <textarea
                v-model="form.risk"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('risk', $event.target.value, form.id)"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="State Issue"
            >
              <el-alert
                type="info"
                :closable="false"
              >
                Issue is a current problem or obstacle or risk affecting information assets that requires immediate action to correct the problems.
              </el-alert>
              <br>
              <textarea
                v-model="form.issue"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('issue', $event.target.value, form.id)"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Who is Responsible? (R)"
            >

              <input
                v-model="form.r"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('r', $event.target.value, form.id)"
              >
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Who is Accountable? (A)"
            >

              <input
                v-model="form.a"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('a', $event.target.value, form.id)"
              >
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Who is Consulted? (C)"
            >

              <input
                v-model="form.c"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('c', $event.target.value, form.id)"
              >
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Who is Informed? (I)"
            >

              <input
                v-model="form.i"
                class="form-control"
                placeholder="Type here..."
                style="width: 100%"
                @blur="saveSOA('i', $event.target.value, form.id)"
              >
            </b-form-group>
          </b-col>
          <P />
          <b-button
            gradient="primary"
            @click="formSubmitted()"
          >
            Done
          </b-button>
        </b-row>
      </b-col>
      <b-col
        md="5"
      >
        <div
          v-if="selectedData !== null"
        >
          <div
            style="background: #f7f0da; padding: 10px; border-radius: 5px; border: 2px solid #d2a204; border-radius: 5px;"
          >
            <strong>Control:</strong><br>
            <!-- eslint-disable-next-line vue/no-v-html-->
            <span v-html="selectedData.name" /><br><br>

            <strong>Control Description:</strong><br>
            <!-- eslint-disable-next-line vue/no-v-html-->
            <span v-html="selectedData.description" /><br>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

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
    selectedData: {
      type: Object,
      required: true,
    },
    selectedClient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      asset_types: [],
      form: {
        assets: [],
      },
      loading: false,
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
    }
  },
  watch: {
    selectedData() {
      this.form = this.selectedData.soa
      this.fetchDetails()
    },
  },
  created() {
    this.form = this.selectedData.soa
    this.fetchAssetTypes()
    this.fetchDetails()
  },
  methods: {
    resetForm(data) {
      const app = this
      app.form = data
    },
    fetchAssetTypes() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
      app.loading = true
      fetchEntryResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.asset_types = response.asset_types
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
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
    saveSOA(field, value, id) {
      // const app = this
      const params = {
        field, value,
      }
      const updateField = new Resource('soa/update-soa')
      updateField.update(id, params)
        .then(() => {
        })
    },
    fetchDetails() {
      const app = this
      app.loading = true
      const fetchDetailsResources = new Resource('soa/details')
      fetchDetailsResources.get(app.selectedData.soa.id)
        .then(response => {
          app.form = response.soa
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
