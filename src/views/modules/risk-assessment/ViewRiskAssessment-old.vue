<template>
  <div v-loading="loading">
    <div slot="header">
      <span>
        <el-button
          size="mini"
          type="success"

          @click="isCreateSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Create</span>
        </el-button>
        <el-button
          size="mini"
          :loading="downloading"
          type="primary"

          @click="exportTableToExcel('riskAssessmentTable')"
        >
          <feather-icon
            icon="DownloadIcon"
            class="mr-50"
          />
          <span class="align-middle">Export</span>
        </el-button>
      </span>
    </div>
    <p />
    <div
      v-if="riskAssessments.length > 0"
      class="table-responsive"
    >
      <table
        id="riskAssessmentTable"
        class="table table-bordered table-striped"
      >
        <thead>
          <tr>
            <th
              :colspan="parseInt(15 + riskAssessments[0].impact_data.length)"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              RISK ANALYSIS
            </th>
            <th
              :colspan="parseInt(12 + riskAssessments[0].impact_data.length)"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              TREATMENT
            </th>
            <th
              :colspan="1"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              POST-TREATMENT
            </th>
            <th
              colspan="3"
              style="font-size: 18px;"
              data-f-sz="18"
              data-fill-color="46035a"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              RESIDUAL PLAN
            </th>
          </tr>
          <tr>
            <th
              rowspan="2"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >RA-ID</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Business Unit</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Business Process</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Risk Owner</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Asset Types</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Assets</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Applicable Threat</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Impact Outcome</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Existing Controls</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Likelihood Value</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Likelihood Justification</th>
            <th
              v-for="impact_data in riskAssessments[0].impact_data"
              :key="`${impact_data.slug}_pre`"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            > {{ impact_data.name }}</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Impact Value</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Impact Rationale</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Risk Value</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Risk Category</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Treatment Option</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Recommended Control</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Applicable Annexture Controls</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Present Status</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Timeline</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Responsibility (Actual Name)</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Revised Likelihood Value</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Revised Likelihood Justification</th>
            <th
              v-for="impact_data in riskAssessments[0].revised_impact_data"
              :key="`${impact_data.slug}_post`"
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            > {{ impact_data.name }}</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Revised Impact Value</th>
            <th
              data-fill-color="333333"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Revised Impact Rationale</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Revised Risk Value</th>
            <th
              data-fill-color="45058d"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Revised Risk</th>
            <th
              data-fill-color="46035a"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Risk Treatment Option B</th>
            <th
              data-fill-color="46035a"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Risk Treatment Plan Residual</th>
            <th
              data-fill-color="46035a"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >Residual Plan Present Status</th>
          </tr>
        </thead>
        <tbody v-if="!downloading">
          <tr
            v-for="(assessment, index) in riskAssessments"
            :key="index"
          >
            <td>{{ assessment.risk_id }}</td>
            <td>
              {{ assessment.risk_owner }}
            </td>
            <td>
              {{ assessment.business_unit }}
            </td>
            <td>
              {{ assessment.business_process }}
            </td>
            <td>
              <div style="width: 200px">
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
                  size="mini"
                  type="warning"
                  plain
                  icon="el-icon-plus"
                  @click="createAssetTypeModal = true"
                >
                  Add New
                </el-button>
              </div>
            </td>
            <td>
              <div style="width: 200px">
                <el-select
                  v-model="assessment.asset"
                  placeholder="Select Asset"
                  filterable
                  style="width: 100%"
                  @focus="fetchAssets(assessment.asset_type_id);"
                  @change="updateField($event, 'asset', assessment)"
                >
                  <el-option
                    v-for="(asset, asset_index) in assets"
                    :key="asset_index"
                    :label="asset.name"
                    :value="asset.name"
                  />
                </el-select>
                <p />
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-plus"
                  plain
                  @click="createAsset(assessment.asset_type_id)"
                >
                  Add New
                </el-button>
              </div>
            </td>
            <td>
              <div style="width: 300px">
                {{ assessment.vulnerability_description }}
              </div>
            <!-- <input
              v-model="assessment.vulnerability_description"
              placeholder="Describe applicable vulnerabilities"
              type="text"
              @blur="updateField($event.target.value, 'vulnerability_description', assessment)"
            > -->

            </td>
            <td>
              <div style="width: 250px">
                {{ assessment.outcome }}
              </div>
            <!-- <input
              v-model="assessment.threat_impact_description"
              placeholder="Describe applicable threat sources"
              type="text"
              @blur="updateField($event.target.value, 'threat_impact_description', assessment)"
            > -->

            </td>
            <td>
              <div style="width: 300px">
                {{ assessment.control_description }}
              </div>
            <!-- <input
              v-model="assessment.existing_controls"
              placeholder="what controls do you have on ground?"
              type="text"
              @blur="updateField($event.target.value, 'existing_controls', assessment)"
            > -->

            </td>
            <td>

              <select
                v-model="assessment.likelihood_of_occurence"
                placeholder="Select Likelihood Value"
                @change="updateField($event.target.value, 'likelihood_of_occurence', assessment)"
              >
                <option
                  v-for="(likelihood, l_index1) in likelihoods"
                  :key="l_index1"
                  :label="`${likelihood.value}-${likelihood.name}`"
                  :value="likelihood.value"
                />
              </select>

            </td>
            <td>

              <textarea
                v-model="assessment.likelihood_rationale"
                placeholder="Likelihood Justification"
                type="text"
                @blur="updateField($event.target.value, 'likelihood_rationale', assessment)"
              />

            </td>
            <td
              v-for="(impact_data, impact_data_index) in assessment.impact_data"
              :key="impact_data_index"
            >

              <select
                v-model="impact_data.impact_value"
                placeholder="Select Impact Value"
                @change="updateField($event.target.value, 'impact_data', assessment, impact_data.slug)"
              >
                <option
                  v-for="(impact, c_index) in impacts"
                  :key="c_index + index"
                  :label="`${impact.value}-${impact.name}`"
                  :value="impact.value"
                />
              </select>

            </td>
            <td>

              <span v-loading="assessment.loader">{{ assessment.impact_of_occurence }}</span>

            </td>
            <td>

              <div style="width: 300px">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.impact_rationale" />
              </div>
            </td>
            <td>

              <span v-loading="assessment.loader">{{ assessment.overall_risk_rating }}</span>

            </td>
            <td :style="`background: #${customClass(assessment, 'risk_category')}`">
              <div
                v-loading="assessment.loader"
              >{{ assessment.risk_category }}
              </div>
            </td>
            <td>

              <el-button
                v-if="assessment.overall_risk_rating !== null && assessment.overall_risk_rating > 0"
                type="default"
                plain
                @click="treatRisk(assessment)"
              >
                Treat
              </el-button>
              <strong>{{ assessment.treatment_option }}</strong>
              <!-- <select
                v-model="assessment.treatment_option"
                placeholder="Select"
                @change="updateField($event.target.value, 'treatment_option', assessment)"
              >
                <option
                  v-for="(treatment_option, option_index) in treatment_options"
                  :key="option_index"
                  :label="treatment_option"
                  :value="treatment_option"
                />
              </select> -->

            </td>
            <td
              width="250"
              label="Recommended Control"
            >
              <textarea
                v-model="assessment.recommended_control"
                placeholder="Recommend control"
                type="text"
                @blur="updateField($event.target.value, 'recommended_control', assessment)"
              />
            </td>
            <td>
              <textarea
                v-model="assessment.applicable_annexture"
                placeholder="Applicable Annexture Controls"
                type="text"
                @blur="updateField($event.target.value, 'applicable_annexture', assessment)"
              />
            </td>
            <td>
              <select
                v-model="assessment.present_status"
                placeholder="Select"
                @change="updateField($event.target.value, 'present_status', assessment)"
              >
                <option
                  v-for="(status, status_index) in ['N/A', 'ONGOING', 'NOT STARTED', 'COMPLETED']"
                  :key="status_index"
                  :label="status"
                  :value="status"
                />
              </select>
            </td>
            <td>
              <input
                v-model="assessment.timeline"
                placeholder="Timeline"
                type="text"
                @blur="updateField($event.target.value, 'timeline', assessment)"
              >
            </td>
            <td>
              <input
                v-model="assessment.responsibility"
                placeholder="Responsibility"
                type="text"
                @blur="updateField($event.target.value, 'responsibility', assessment)"
              >
            </td>
            <td>
              <select
                v-model="assessment.revised_likelihood_of_occurence"
                placeholder="Select"
                @change="updateField($event.target.value, 'revised_likelihood_of_occurence', assessment)"
              >
                <option
                  v-for="(likelihood, l_index) in likelihoods"
                  :key="l_index"
                  :label="`${likelihood.value}-${likelihood.name}`"
                  :value="likelihood.value"
                />
                <option
                  value="0"
                  label="N/A"
                />
              </select>
            </td>
            <td>
              <textarea
                v-model="assessment.revised_likelihood_rationale"
                placeholder="Justification"
                type="text"
                @blur="updateField($event.target.value, 'revised_likelihood_rationale', assessment)"
              />
            </td>
            <td
              v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
              :key="`${revised_impact_data_index}_post`"
            >
              <select
                v-model="impact_data.impact_value"
                placeholder="Select Impact Value"
                @change="updateField($event.target.value, 'revised_impact_data', assessment, impact_data.slug )"
              >
                <option
                  v-for="(impact, r_index) in impacts"
                  :key="r_index + index"
                  :label="`${impact.value}-${impact.name}`"
                  :value="impact.value"
                />
              </select>

            </td>
            <td>
              <span v-loading="assessment.loader">{{ assessment.revised_impact_of_occurence }}</span>

            </td>
            <td>

              <div style="width: 300px">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.revised_impact_rationale" />
              </div>
            </td>
            <td>
              <span v-loading="assessment.loader">{{ assessment.revised_overall_risk_rating }}</span>

            </td>
            <td :style="`background: #${customClass(assessment, 'revised_risk_category')}`">
              <div
                v-loading="assessment.loader"
              >{{ assessment.revised_risk_category }}
              </div>
            </td>
            <td>
              <select
                v-model="assessment.risk_treatment_option_b"
                placeholder="Select"
                @change="updateField($event.target.value, 'risk_treatment_option_b', assessment)"
              >
                <option
                  v-for="(treatment_option, option_index2) in treatment_options"
                  :key="option_index2"
                  :label="treatment_option"
                  :value="treatment_option"
                />
              </select>
            </td>
            <td>
              <textarea
                v-model="assessment.risk_treatment_plan_residual"
                placeholder=""
                type="text"
                @blur="updateField($event.target.value, 'risk_treatment_plan_residual', assessment)"
              />
            </td>
            <td>
              <select
                v-model="assessment.residual_plan_present_status"
                placeholder="Select"
                @change="updateField($event.target.value, 'residual_plan_present_status', assessment)"
              >
                <option
                  v-for="(status, status_index2) in ['N/A', 'ONGOING', 'NOT STARTED', 'COMPLETED']"
                  :key="status_index2"
                  :label="status"
                  :value="status"
                />
              </select>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr
            v-for="(assessment, index) in riskAssessments"
            :key="index"
          >
            <td>{{ assessment.risk_id }}</td>
            <td>
              {{ assessment.risk_owner }}
            </td>
            <td>
              {{ assessment.business_unit }}
            </td>
            <td>
              {{ assessment.business_process }}
            </td>
            <td>
              {{ assessment.asset_type }}
            </td>
            <td>
              {{ assessment.asset }}
            </td>
            <td>
              <div style="width: 300px">
                {{ assessment.vulnerability_description }}
              </div>
            </td>
            <td>
              <div style="width: 250px">
                {{ assessment.outcome }}
              </div>

            </td>
            <td>
              <div style="width: 300px">
                {{ assessment.control_description }}
              </div>
            </td>
            <td>

              {{ assessment.likelihood_of_occurence }}

            </td>
            <td>

              {{ assessment.likelihood_rationale }}

            </td>
            <td
              v-for="(impact_data, impact_data_index) in assessment.impact_data"
              :key="impact_data_index"
            >

              {{ impact_data.impact_value }}

            </td>
            <td>

              {{ assessment.impact_of_occurence }}

            </td>
            <td>

              <div style="width: 300px">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.impact_rationale" />
              </div>
            </td>
            <td>

              {{ assessment.overall_risk_rating }}

            </td>
            <td
              :data-fill-color="customClass(assessment, 'risk_category')"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ assessment.risk_category }}
            </td>
            <td>

              {{ assessment.treatment_option }}

            </td>
            <td
              width="250"
              label="Recommended Control"
            >
              {{ assessment.recommended_control }}
            </td>
            <td>
              {{ assessment.applicable_annexture }}
            </td>
            <td>
              {{ assessment.present_status }}
            </td>
            <td>
              {{ assessment.timeline }}
            </td>
            <td>
              {{ assessment.responsibility }}
            </td>
            <td>
              {{ assessment.revised_likelihood_of_occurence }}
            </td>
            <td>
              {{ assessment.revised_likelihood_rationale }}
            </td>
            <td
              v-for="(impact_data, revised_impact_data_index) in assessment.revised_impact_data"
              :key="`${revised_impact_data_index}_post`"
            >
              {{ impact_data.impact_value }}

            </td>
            <td>
              {{ assessment.revised_impact_of_occurence }}

            </td>
            <td>

              <div style="width: 300px">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="assessment.revised_impact_rationale" />
              </div>
            </td>
            <td>
              {{ assessment.revised_overall_risk_rating }}

            </td>
            <td
              :data-fill-color="customClass(assessment, 'revised_risk_category')"
              data-b-a-s="thin"
              data-f-color="ffffff"
            >
              {{ assessment.revised_risk_category }}
            </td>
            <td>
              {{ assessment.risk_treatment_option_b }}
            </td>
            <td>
              {{ assessment.risk_treatment_plan_residual }}
            </td>
            <td>
              {{ assessment.residual_plan_present_status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <el-empty>
        <el-button
          size="mini"
          type="success"

          @click="isCreateSidebarActive = true"
        >
          <feather-icon
            icon="PlusIcon"
            class="mr-50"
          />
          <span class="align-middle">Create New</span>
        </el-button>
      </el-empty>
    </div>
    <!-- CREATE NEW RISK ASSESSMENT-->
    <create-risk-assessment
      v-if="isCreateSidebarActive"
      v-model="isCreateSidebarActive"
      :standard-id="standardId"
      :selected-client="selectedClient"
      :assessment-module="assessmentModule"
      @submit="fetchRiskAssessments"
    />
    <!--  CREATE NEW RISK ASSESSMENT ENDS-->
    <!-- RISK TREATMENT OPTION-->
    <b-modal
      v-model="showTreatmentModal"
      title="Risk Treatment Option"
      centered
      size="md"
      hide-footer
    >
      <div>
        <div>
          <el-alert :type="treatment_alert_type">
            {{ treatment_comment }}
          </el-alert>
        </div>
        <div v-if="!showTreatmentOption">
          <el-button
            type="success"
            @click="updateField('Accept', 'treatment_option', selectedAssessment); showTreatmentModal = false"
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
          <p>Kindly specify your option</p>
          <select
            v-model="selectedAssessment.treatment_option"
            class="form-control"
            placeholder="Select Option"
            @change="updateField($event.target.value, 'treatment_option', selectedAssessment); showTreatmentModal = false"
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
    <!-- RISK TREATMENT OPTION ENDS-->
    <!-- CREATE ASSET TYPES BEGINS-->
    <b-modal
      v-model="createAssetTypeModal"
      title="Asset Type"
      centered
      size="lg"
      hide-footer
    >
      <create-asset-type
        :client-id="selectedClient.id"
        @save="fetchAssetTypes"
      />
    </b-modal>
    <!-- CREATE ASSET TYPES ENDS-->
    <b-modal
      v-model="createAssetModal"
      title="Asset"
      centered
      size="lg"
      hide-footer
    >
      <create-asset
        :asset-type-id="selectedAssetTypeId"
        :client-id="selectedClient.id"
        @save="fetchAssets(selectedAssetTypeId); createModal = false"
      />
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
} from 'bootstrap-vue'
import TableToExcel from '@linways/table-to-excel'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateRiskAssessment from './partials/CreateRiskAssessment.vue'
import CreateAssetType from '@/views/modules/ManageAssets/CreateAssetType.vue'
import CreateAsset from '@/views/modules/ManageAssets/CreateAsset.vue'

export default {
  components: {
    BModal,
    CreateRiskAssessment,
    CreateAssetType,
    CreateAsset,
  },
  directives: {
    Ripple,
  },
  props: {
    standardId: {
      type: Number,
      default: () => 0,
      // required: true,
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
      createAssetModal: false,
      createAssetTypeModal: false,
      showTreatmentModal: false,
      loading: false,
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      riskAssessments: [],
      clients: [],
      searchTerm: '',
      categories: [],
      asset_types: [],
      assets: [],
      likelihoods: [],
      impacts: [],
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      downloading: false,
      selectedAssetTypeId: '',
      risk_appetite: null,
      selectedAssessment: '',
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentOption: false,
    }
  },
  created() {
    this.fetchImpacts()
    this.fetchLikelihoods()
    this.fetchAssetTypes()
    this.fetchRiskAssessments()
  },
  methods: {
    checkPermission,
    customClassName({
      row, column,
    }) {
      if (column.label === 'Risk Category') {
        if (row.risk_category === 'High') {
          return 'btn-danger'
        } if (row.risk_category === 'Medium') {
          return 'btn-warning'
        }
        if (row.risk_category === 'Low') {
          return 'btn-success'
        }
      }
      if (column.label === 'Revised Risk') {
        if (row.revised_risk_category === 'High') {
          return 'btn-danger'
        } if (row.revised_risk_category === 'Medium') {
          return 'btn-warning'
        }
        if (row.revised_risk_category === 'Low') {
          return 'btn-success'
        }
      }
      return ''
    },
    createAsset(asseTypeId) {
      const app = this
      if (asseTypeId === '' || asseTypeId === null) {
        app.$alert('Please select an asset type')
      } else {
        app.selectedAssetTypeId = asseTypeId
        app.createAssetModal = true
      }
    },
    customClass(row, opt) {
      if (opt === 'risk_category') {
        if (row.risk_category === 'High') {
          return 'DD2C2C'
        } if (row.risk_category === 'Medium') {
          return 'F0C63E'
        }
        if (row.risk_category === 'Low') {
          return '3BD135'
        }
      }
      if (opt === 'revised_risk_category') {
        if (row.revised_risk_category === 'High') {
          return 'DD2C2C'
        } if (row.revised_risk_category === 'Medium') {
          return 'F0C63E'
        }
        if (row.revised_risk_category === 'Low') {
          return '3BD135'
        }
      }
      return ''
    },
    fetchImpacts() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.loading = false
          app.impacts = response.impacts
        })
        .catch(error => {
          app.loading = false
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.likelihoods = response.likelihoods
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('risk-assessment/fetch-risk-assessments')
      fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId, module: app.assessmentModule })
        .then(response => {
          app.riskAssessments = response.risk_assessments
          app.risk_appetite = response.risk_appetite
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateField(value, field, assessment, subField = '') {
      const app = this
      const params = {
        field, value, sub_field: subField,
      }
      // eslint-disable-next-line no-param-reassign
      // assessment.loader = true
      const fetchClientsResource = new Resource('risk-assessment/update-fields')
      fetchClientsResource.update(assessment.id, params)
        .then(() => {
          // app.risk_assessments[assessment.index] = response
          app.fetchRiskAssessments(false)
          // eslint-disable-next-line no-param-reassign
          assessment.loader = false
        }).catch(() => {
          // eslint-disable-next-line no-param-reassign
          assessment.loader = false
        })
    },
    treatRisk(assessment) {
      const app = this
      const riskValue = assessment.overall_risk_rating
      const riskAppetite = app.risk_appetite
      if (riskValue <= riskAppetite) {
        app.treatment_comment = `Your Risk Value of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk, it's up to you.`
        app.treatment_alert_type = 'success'
        app.showTreatmentOption = false
      } else {
        app.treatment_comment = `Your Risk Value of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        app.treatment_alert_type = 'error'
        app.showTreatmentOption = true
      }
      app.selectedAssessment = assessment
      app.showTreatmentModal = true
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
    fetchAssets(assetTypeId) {
      const app = this
      // const assetTypeId = event.target.value
      const fetchAssetsResource = new Resource('risk-assessment/fetch-assets')
      fetchAssetsResource.list({ client_id: app.selectedClient.id, asset_type_id: assetTypeId })
        .then(response => {
          app.assets = response.assets
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    exportTableToExcel(id) {
      const app = this
      app.downloading = true
      // const rawData = app.riskAssessments
      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_table_to_excel(id)
      //   setTimeout(() => {
      //     app.downloading = false
      //   }, 2000)
      // })
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'RiskAssessmentTable.xlsx',
          sheet: {
            name: 'Sheet 1',
          },
        })
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
    formatIds(value, option) {
      const app = this
      const { likelihoods } = app
      const { impacts } = app
      let val = ''
      if (option === 'likelihood') {
        likelihoods.forEach(likelihood => {
          if (value === likelihood.id) {
            val = `${likelihood.id}-${likelihood.name}`
          }
        })
      }
      if (option === 'impact') {
        impacts.forEach(impact => {
          if (value === impact.id) {
            val = `${impact.id}-${impact.name}`
          }
        })
      }
      return val
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
