<template>
  <el-card>
    <el-button
      :loading="downloading"
      type="primary"
      @click="exportTableToExcel('riskAssessmentTable')"
    >
      Export
    </el-button>
    <table
      id="riskAssessmentTable"
      class="table table-bordered table-striped table-responsive"
    >
      <thead>
        <tr>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >RA-ID</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Risk Owner</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Assets</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Asset Types</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Applicable Threat</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Applicable Vulnerability Description</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Existing Controls</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Likelihood Justification</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Likelihood Value</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >C</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >I</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >A</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Impact Value</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Risk Value</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Risk Category</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Option</th>
          <th
            colspan="13"
            style="font-size: 18px;"
            data-f-sz="18"
            data-fill-color="45058d"
            data-f-color="ffffff"
          >
            RISK TREATMENT
          </th>
          <th
            colspan="3"
            style="font-size: 18px;"
            data-f-sz="18"
            data-fill-color="46035a"
            data-f-color="ffffff"
          >
            RESIDUAL PLAN
          </th>
        </tr>
        <tr>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Recommended Control</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Applicable Annexture Controls</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Present Status</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Timeline</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Responsibility (Actual Name)</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Revised Likelihood Value</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Justification</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Revised C</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Reversed I</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Reversed A</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Revised Impact Value</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Revised Risk Value</th>
          <th
            data-fill-color="45058d"
            data-f-color="ffffff"
          >Revised Risk</th>
          <th
            data-fill-color="46035a"
            data-f-color="ffffff"
          >Risk Treatment Option B</th>
          <th
            data-fill-color="46035a"
            data-f-color="ffffff"
          >Risk Treatment Plan Residual</th>
          <th
            data-fill-color="46035a"
            data-f-color="ffffff"
          >Residual Plan Present Status</th>
        </tr>
      </thead>
      <tbody v-if="!downloading">
        <tr
          v-for="(assessment, index) in riskAssessments"
          :key="index"
        >
          <td>{{ assessment.ra_id }}</td>
          <td>

            <input
              v-model="assessment.risk_owner"
              placeholder="e.g CEO"
              type="text"
              @blur="updateField($event, 'risk_owner', assessment)"
            >

          </td>
          <td>

            <input
              v-model="assessment.asset"
              placeholder="e.g Head of Units"
              type="text"
              @blur="updateField($event, 'asset', assessment)"
            >

          </td>
          <td>

            <select
              v-model="assessment.asset_type_id"
              placeholder="Select Asset Type"
              @change="updateField($event, 'asset_type_id', assessment)"
            >
              <option
                v-for="(asset_type, ass_index) in asset_types"
                :key="ass_index"
                :label="asset_type.name"
                :value="asset_type.id"
              />
            </select>

          </td>
          <td>

            <input
              v-model="assessment.threat_impact_description"
              placeholder="Describe applicable threat sources"
              type="text"
              @blur="updateField($event, 'threat_impact_description', assessment)"
            >

          </td>
          <td>

            <input
              v-model="assessment.vulnerability_description"
              placeholder="Describe applicable vulnerabilities"
              type="text"
              @blur="updateField($event, 'vulnerability_description', assessment)"
            >

          </td>
          <td>

            <input
              v-model="assessment.existing_controls"
              placeholder="what controls do you have on ground?"
              type="text"
              @blur="updateField($event, 'existing_controls', assessment)"
            >

          </td>
          <td>

            <input
              v-model="assessment.likelihood_justification"
              placeholder="Likelihood Justification"
              type="text"
              @blur="updateField($event, 'likelihood_justification', assessment)"
            >

          </td>
          <td>

            <select
              v-model="assessment.risk_likelihood_id"
              placeholder="Select Likelihood Value"
              @change="updateField($event, 'risk_likelihood_id', assessment)"
            >
              <option
                v-for="(likelihood, l_index) in likelihoods"
                :key="l_index"
                :label="`${likelihood.value}-${likelihood.name}`"
                :value="likelihood.value"
              />
            </select>

          </td>
          <td>

            <select
              v-model="assessment.confidentiality"
              placeholder="Select Impact Value"
              @change="updateField($event, 'confidentiality', assessment)"
            >
              <option
                v-for="(impact, c_index) in impacts"
                :key="c_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
            </select>

          </td>
          <td>

            <select
              v-model="assessment.integrity"
              placeholder="Select Impact Value"
              @change="updateField($event, 'integrity', assessment)"
            >
              <option
                v-for="(impact, i_index) in impacts"
                :key="i_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
            </select>

          </td>
          <td>

            <select
              v-model="assessment.availability"
              placeholder="Select Impact Value"
              @change="updateField($event, 'availability', assessment)"
            >
              <option
                v-for="(impact, a_index) in impacts"
                :key="a_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
            </select>

          </td>
          <td>

            <span v-loading="assessment.loader">{{ assessment.impact_value }}</span>

          </td>
          <td>

            <span v-loading="assessment.loader">{{ assessment.risk_value }}</span>

          </td>
          <td :style="`background: #${customClass(assessment, 'risk_category')}`">
            <div
              v-loading="assessment.loader"
            >{{ assessment.risk_category }}
            </div>
          </td>
          <td>

            <select
              v-model="assessment.assessment_option"
              placeholder="Select"
              @change="updateField($event, 'assessment_option', assessment)"
            >
              <option
                v-for="(assessment_option, option_index) in assessment_options"
                :key="option_index"
                :label="assessment_option"
                :value="assessment_option"
              />
            </select>

          </td>
          <td
            width="250"
            label="Recommended Control"
          >
            <input
              v-model="assessment.recommended_control"
              placeholder="Recommend control"
              type="text"
              @blur="updateField($event, 'recommended_control', assessment)"
            >
          </td>
          <td>
            <input
              v-model="assessment.applicable_annexture"
              placeholder="Applicable Annexture Controls"
              type="text"
              @blur="updateField($event, 'applicable_annexture', assessment)"
            >
          </td>
          <td>
            <select
              v-model="assessment.present_status"
              placeholder="Select"
              @change="updateField($event, 'present_status', assessment)"
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
              @blur="updateField($event, 'timeline', assessment)"
            >
          </td>
          <td>
            <input
              v-model="assessment.responsibility"
              placeholder="Responsibility"
              type="text"
              @blur="updateField($event, 'responsibility', assessment)"
            >
          </td>
          <td>
            <select
              v-model="assessment.revised_likelihood_id"
              placeholder="Select"
              @change="updateField($event, 'revised_likelihood_id', assessment)"
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
            <input
              v-model="assessment.revised_justification"
              placeholder="Justification"
              type="text"
              @blur="updateField($event, 'revised_justification', assessment)"
            >
          </td>
          <td><select
            v-model="assessment.reversed_confidentiality"
            placeholder="Select"
            @change="updateField($event, 'reversed_confidentiality', assessment)"
          >
            <option
              v-for="(impact, c_index) in impacts"
              :key="c_index"
              :label="`${impact.value}-${impact.name}`"
              :value="impact.value"
            />
            <option
              value="0"
              label="N/A"
            />
          </select>

          </td>
          <td>
            <select
              v-model="assessment.reversed_integrity"
              placeholder="Select"
              @change="updateField($event, 'reversed_integrity', assessment)"
            >
              <option
                v-for="(impact, i_index) in impacts"
                :key="i_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
              <option
                value="0"
                label="N/A"
              />
            </select>
          </td>
          <td>
            <select
              v-model="assessment.reversed_availability"
              placeholder="Select Impact Value"
              @change="updateField($event, 'reversed_availability', assessment)"
            >
              <option
                v-for="(impact, a_index) in impacts"
                :key="a_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
              <option
                value="0"
                label="N/A"
              />
            </select>

          </td>
          <td>
            <span v-loading="assessment.loader">{{ assessment.revised_impact_value }}</span>

          </td>
          <td>
            <span v-loading="assessment.loader">{{ assessment.revised_risk_value }}</span>

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
              @change="updateField($event, 'risk_treatment_option_b', assessment)"
            >
              <option
                v-for="(assessment_option, option_index) in assessment_options"
                :key="option_index"
                :label="assessment_option"
                :value="assessment_option"
              />
            </select>
          </td>
          <td>
            <input
              v-model="assessment.risk_treatment_plan_residual"
              placeholder=""
              type="text"
              @blur="updateField($event, 'risk_treatment_plan_residual', assessment)"
            >
          </td>
          <td>
            <select
              v-model="assessment.residual_plan_present_status"
              placeholder="Select"
              @change="updateField($event, 'residual_plan_present_status', assessment)"
            >
              <option
                v-for="(status, status_index) in ['N/A', 'ONGOING', 'NOT STARTED', 'COMPLETED']"
                :key="status_index"
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
          <td>{{ assessment.ra_id }}</td>
          <td>{{ assessment.risk_owner }}</td>
          <td>{{ assessment.asset }}</td>
          <td>{{ assessment.asset_type.name }}</td>
          <td>{{ assessment.threat_impact_description }}</td>
          <td>{{ assessment.vulnerability_description }}</td>
          <td>{{ assessment.existing_controls }}</td>
          <td>{{ assessment.likelihood_justification }}</td>
          <td>{{ formatIds(assessment.risk_likelihood_id, 'likelihood') }}</td>
          <td>{{ formatIds(assessment.confidentiality, 'impact') }}</td>
          <td>{{ formatIds(assessment.integrity, 'impact') }}</td>
          <td>{{ formatIds(assessment.availability, 'impact') }}</td>
          <td data-t="n">
            {{ assessment.impact_value }}
          </td>
          <td data-t="n">
            {{ assessment.risk_value }}
          </td>
          <td
            :style="`background: #${customClass(assessment, 'risk_category')}`"
            :data-fill-color="customClass(assessment, 'risk_category')"
          >
            {{ assessment.risk_category }}
          </td>
          <td>{{ assessment.assessment_option }}</td>
          <td>{{ assessment.recommended_control }}</td>
          <td>{{ assessment.applicable_annexture }}</td>
          <td>{{ assessment.present_status }}</td>
          <td>{{ assessment.timeline }}</td>
          <td>{{ assessment.responsibility }}</td>
          <td>{{ formatIds(assessment.revised_likelihood_id, 'likelihood') }}</td>
          <td>{{ assessment.revised_justification }}</td>
          <td>{{ formatIds(assessment.reversed_confidentiality, 'impact') }}</td>
          <td>{{ formatIds(assessment.reversed_integrity, 'impact') }}</td>
          <td>{{ formatIds(assessment.reversed_availability, 'impact') }}</td>
          <td data-t="n">
            {{ assessment.revised_impact_value }}
          </td>
          <td data-t="n">
            {{ assessment.revised_risk_value }}
          </td>
          <td
            :style="`background: #${customClass(assessment, 'revised_risk_category')}`"
            :data-fill-color="customClass(assessment, 'revised_risk_category')"
          >
            {{ assessment.revised_risk_category }}
          </td>
          <td>{{ assessment.risk_treatment_option_b }}</td>
          <td>{{ assessment.risk_treatment_plan_residual }}</td>
          <td>{{ assessment.residual_plan_present_status }}</td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script>
import {
} from 'bootstrap-vue'
import TableToExcel from '@linways/table-to-excel'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
  },
  directives: {
    Ripple,
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    riskAssessments: {
      type: Array,
      default: () => ({}),
    },
    likelihoods: {
      type: Array,
      default: () => ({}),
    },
    impacts: {
      type: Array,
      default: () => ({}),
    },
    matrix: {
      type: String,
      default: '3x3',
    },
  },
  data() {
    return {
      loading: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      risk_assessments: [],
      clients: [],
      searchTerm: '',
      categories: [],
      asset_types: [],
      assessment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      downloading: false,
    }
  },
  created() {
    this.fetchAssetTypes()
  },
  methods: {
    checkPermission,
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
    updateField($event, field, assessment) {
      const app = this
      // const valuesArray = [assessment.confidentiality, assessment.integrity, assessment.availability]
      // const impactVal = app.maxValue(valuesArray)
      // const riskVal = assessment.risk_likelihood_id * impactVal
      // const riskCategory = app.analyzeRiskCategory(riskVal)
      // const params = {
      //   field, value: $event.target.value, impact_value: impactVal, risk_value: riskVal, risk_category: riskCategory,
      // }
      const params = { field, value: $event.target.value, matrix: app.matrix }
      // eslint-disable-next-line no-param-reassign
      assessment.loader = true
      const fetchClientsResource = new Resource('risk-assessment/update-fields')
      fetchClientsResource.update(assessment.id, params)
        .then(() => {
          // app.risk_assessments[assessment.index] = response
          app.$emit('reload')
          // eslint-disable-next-line no-param-reassign
          assessment.loader = false
        })
    },
    // maxValue(arrayNums) {
    //   let max = 0
    //   arrayNums.forEach(num => {
    //     if (num > max) {
    //       max = num
    //     }
    //   })
    //   return max
    // },
    // analyzeRiskCategory(riskValue) {
    //   if (riskValue >= 6) {
    //     return 'High'
    //   }
    //   if (riskValue >= 3) {
    //     return 'Medium'
    //   }
    //   return 'Low'
    // },
    fetchAssetTypes() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
      fetchEntryResource.list()
        .then(response => {
          app.asset_types = response.asset_types
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
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
