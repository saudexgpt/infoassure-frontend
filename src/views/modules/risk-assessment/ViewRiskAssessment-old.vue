<template>
  <el-card>
    <el-button
      :loading="downloading"
      type="primary"
      @click="exportTableToExcel('riskAssessmentTable')"
    >
      Export
    </el-button>
    <el-table
      id="riskAssessmentTable"
      :data="riskAssessments"
      style="width: 100%"
      :cell-class-name="customClassName"
      height="600"
    >
      <!-- <el-table-column width="250"
          type="selection"
          width="55"
        /> -->
      <el-table-column
        width="50"
        label="RA-ID"
      >
        <template slot-scope="scope">
          {{ scope.row.ra_id }}
        </template>
      </el-table-column>
      <el-table-column
        width="250"
        label="Risk Owner"
      >
        <div
          slot-scope="props"
        >
          <input
            v-model="props.row.risk_owner"
            placeholder="e.g CEO"
            type="text"
            @blur="updateField($event, 'risk_owner', props)"
          >
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Assets"
      >
        <div
          slot-scope="props"
        >
          <input
            v-model="props.row.asset"
            placeholder="e.g Head of Units"
            type="text"
            @blur="updateField($event, 'asset', props)"
          >
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Asset Types"
      >
        <div
          slot-scope="props"
        >
          <select
            v-model="props.row.asset_type_id"
            placeholder="Select Asset Type"
            @change="updateField($event, 'asset_type_id', props)"
          >
            <option
              v-for="(asset_type, ass_index) in asset_types"
              :key="ass_index"
              :label="asset_type.name"
              :value="asset_type.id"
            />
          </select>
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Applicable Threat"
      >
        <div
          slot-scope="props"
        >
          <input
            v-model="props.row.threat_impact_description"
            placeholder="Describe applicable threat sources"
            type="text"
            @blur="updateField($event, 'threat_impact_description', props)"
          >
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Applicable Vulnerability Description"
      >
        <div
          slot-scope="props"
        >
          <input
            v-model="props.row.vulnerability_description"
            placeholder="Describe applicable vulnerabilities"
            type="text"
            @blur="updateField($event, 'vulnerability_description', props)"
          >
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Existing Controls"
      >
        <div
          slot-scope="props"
        >
          <input
            v-model="props.row.existing_controls"
            placeholder="what controls do you have on ground?"
            type="text"
            @blur="updateField($event, 'existing_controls', props)"
          >
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Likelihood Justification"
      >
        <div
          slot-scope="props"
        >
          <input
            v-model="props.row.likelihood_justification"
            placeholder="Likelihood Justification"
            type="text"
            @blur="updateField($event, 'likelihood_justification', props)"
          >
        </div>
      </el-table-column>
      <el-table-column
        width="200"
        label="Likelihood Value"
      >
        <div
          slot-scope="props"
        >
          <select
            v-model="props.row.risk_likelihood_id"
            placeholder="Select Likelihood Value"
            @change="updateField($event, 'risk_likelihood_id', props)"
          >
            <option
              v-for="(likelihood, l_index) in likelihoods"
              :key="l_index"
              :label="`${likelihood.id}-${likelihood.name}`"
              :value="likelihood.id"
            />
          </select>
        </div>
      </el-table-column>
      <el-table-column
        width="150"
        label="C"
      >
        <div
          slot-scope="props"
        >
          <select
            v-model="props.row.confidentiality"
            placeholder="Select Impact Value"
            @change="updateField($event, 'confidentiality', props)"
          >
            <option
              v-for="(impact, c_index) in impacts"
              :key="c_index"
              :label="`${impact.id}-${impact.name}`"
              :value="impact.id"
            />
          </select>
        </div>
      </el-table-column>
      <el-table-column
        width="150"
        label="I"
      >
        <div
          slot-scope="props"
        >
          <select
            v-model="props.row.integrity"
            placeholder="Select Impact Value"
            @change="updateField($event, 'integrity', props)"
          >
            <option
              v-for="(impact, i_index) in impacts"
              :key="i_index"
              :label="`${impact.id}-${impact.name}`"
              :value="impact.id"
            />
          </select>
        </div>
      </el-table-column>
      <el-table-column
        width="150"
        label="A"
      >
        <div
          slot-scope="props"
        >
          <select
            v-model="props.row.availability"
            placeholder="Select Impact Value"
            @change="updateField($event, 'availability', props)"
          >
            <option
              v-for="(impact, a_index) in impacts"
              :key="a_index"
              :label="`${impact.id}-${impact.name}`"
              :value="impact.id"
            />
          </select>
        </div>
      </el-table-column>
      <el-table-column
        width="150"
        label="Impact Value"
      >
        <div
          slot-scope="props"
        >
          <span v-loading="props.row.loader">{{ props.row.impact_value }}</span>
        </div>
      </el-table-column>
      <el-table-column
        width="150"
        label="Risk Value"
      >
        <div
          slot-scope="props"
        >
          <span v-loading="props.row.loader">{{ props.row.risk_value }}</span>
        </div>
      </el-table-column>
      <el-table-column
        width="150"
        label="Risk Category"
      >
        <template
          slot-scope="props"
        >
          <div
            v-loading="props.row.loader"
          >{{ props.row.risk_category }}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="Option"
      >
        <div
          slot-scope="props"
        >
          <select
            v-model="props.row.assessment_option"
            placeholder="Select"
            @change="updateField($event, 'assessment_option', props)"
          >
            <option
              v-for="(assessment_option, option_index) in assessment_options"
              :key="option_index"
              :label="assessment_option"
              :value="assessment_option"
            />
          </select>
        </div>
      </el-table-column>
      <el-table-column
        width="250"
        label="Risk Treatment"
      >
        <el-table-column
          width="250"
          label="Recommended Control"
        >
          <template slot-scope="props">
            <input
              v-model="props.row.recommended_control"
              placeholder="Recommend control"
              type="text"
              @blur="updateField($event, 'recommended_control', props)"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Applicable Annexture Controls"
        >
          <template slot-scope="props">
            <input
              v-model="props.row.applicable_annexture"
              placeholder="Applicable Annexture Controls"
              type="text"
              @blur="updateField($event, 'applicable_annexture', props)"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="Present Status"
        >
          <template slot-scope="props">
            <select
              v-model="props.row.present_status"
              placeholder="Select"
              @change="updateField($event, 'present_status', props)"
            >
              <option
                v-for="(status, status_index) in ['N/A', 'ONGOING', 'NOT STARTED', 'COMPLETED']"
                :key="status_index"
                :label="status"
                :value="status"
              />
            </select>
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Timeline"
        >
          <template slot-scope="props">
            <input
              v-model="props.row.timeline"
              placeholder="Timeline"
              type="text"
              @blur="updateField($event, 'timeline', props)"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Responsibility (Actual Name)"
        >
          <template slot-scope="props">
            <input
              v-model="props.row.responsibility"
              placeholder="Responsibility"
              type="text"
              @blur="updateField($event, 'responsibility', props)"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Revised Likelihood Value"
        >
          <template slot-scope="props">
            <select
              v-model="props.row.revised_likelihood_id"
              placeholder="Select"
              @change="updateField($event, 'revised_likelihood_id', props)"
            >
              <option
                v-for="(likelihood, l_index) in likelihoods"
                :key="l_index"
                :label="`${likelihood.id}-${likelihood.name}`"
                :value="likelihood.id"
              />
              <option
                value="0"
                label="N/A"
              />
            </select>
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Justification"
        >
          <template slot-scope="props">
            <input
              v-model="props.row.revised_justification"
              placeholder="Justification"
              type="text"
              @blur="updateField($event, 'revised_justification', props)"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="Revised C"
        >
          <div
            slot-scope="props"
          >
            <select
              v-model="props.row.reversed_confidentiality"
              placeholder="Select"
              @change="updateField($event, 'reversed_confidentiality', props)"
            >
              <option
                v-for="(impact, c_index) in impacts"
                :key="c_index"
                :label="`${impact.id}-${impact.name}`"
                :value="impact.id"
              />
              <option
                value="0"
                label="N/A"
              />
            </select>
          </div>
        </el-table-column>
        <el-table-column
          width="150"
          label="Reversed I"
        >
          <div
            slot-scope="props"
          >
            <select
              v-model="props.row.reversed_integrity"
              placeholder="Select"
              @change="updateField($event, 'reversed_integrity', props)"
            >
              <option
                v-for="(impact, i_index) in impacts"
                :key="i_index"
                :label="`${impact.id}-${impact.name}`"
                :value="impact.id"
              />
              <option
                value="0"
                label="N/A"
              />
            </select>
          </div>
        </el-table-column>
        <el-table-column
          width="150"
          label="Reversed A"
        >
          <div
            slot-scope="props"
          >
            <select
              v-model="props.row.reversed_availability"
              placeholder="Select Impact Value"
              @change="updateField($event, 'reversed_availability', props)"
            >
              <option
                v-for="(impact, a_index) in impacts"
                :key="a_index"
                :label="`${impact.id}-${impact.name}`"
                :value="impact.id"
              />
              <option
                value="0"
                label="N/A"
              />
            </select>
          </div>
        </el-table-column>
        <el-table-column
          width="200"
          label="Revised Impact Value"
        >
          <div
            slot-scope="props"
          >
            <span v-loading="props.row.loader">{{ props.row.revised_impact_value }}</span>
          </div>
        </el-table-column>
        <el-table-column
          width="200"
          label="Revised Risk Value"
        >
          <div
            slot-scope="props"
          >
            <span v-loading="props.row.loader">{{ props.row.revised_risk_value }}</span>
          </div>
        </el-table-column>
        <el-table-column
          width="150"
          label="Revised Risk"
        >
          <template
            slot-scope="props"
          >
            <div
              v-loading="props.row.loader"
            >{{ props.row.revised_risk_category }}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        width="250"
        label="RESIDUAL PLAN"
      >
        <el-table-column
          width="250"
          label="Risk Treatment Option B"
        >
          <template slot-scope="props">
            <select
              v-model="props.row.risk_treatment_option_b"
              placeholder="Select"
              @change="updateField($event, 'risk_treatment_option_b', props)"
            >
              <option
                v-for="(assessment_option, option_index) in assessment_options"
                :key="option_index"
                :label="assessment_option"
                :value="assessment_option"
              />
            </select>
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Risk Treatment Plan Residual"
        >
          <template slot-scope="props">
            <input
              v-model="props.row.risk_treatment_plan_residual"
              placeholder=""
              type="text"
              @blur="updateField($event, 'risk_treatment_plan_residual', props)"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="Residual Plan Present Status"
        >
          <template slot-scope="props">
            <select
              v-model="props.row.residual_plan_present_status"
              placeholder="Select"
              @change="updateField($event, 'residual_plan_present_status', props)"
            >
              <option
                v-for="(status, status_index) in ['N/A', 'ONGOING', 'NOT STARTED', 'COMPLETED']"
                :key="status_index"
                :label="status"
                :value="status"
              />
            </select>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {
} from 'bootstrap-vue'
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
  },
  data() {
    return {
      loading: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'ra_id',
        'risk_owner',
        'asset',
        'asset_type.name',
        'threat_impact_description',
        'vulnerability_description',
        'existing_controls',
        'likelihood_justification',
        'risk_likelihood_id',
        'confidentiality',
        'integrity',
        'availability',
        'impact_value',
        'risk_value',
        'risk_category',
      ],
      options: {
        headings: {
          ra_id: 'RA-ID',
          'asset_type.name': 'Asset Type',
          risk_likelihood_id: 'Likelihood Value',
          threat_impact_description: 'Applicable Threat',
          vulnerability_description: 'Applicable Vulnerability Description',
          confidentiality: 'C',
          integrity: 'I',
          availability: 'A',
          risk_category: 'Risk Category',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: ['ra_id'],
        filterable: false,
        // filterable: [
        //   // 'risk_owner', 'asset',
        // ],
        cellClasses: {
          risk_category: [
            {
              class: 'btn-danger',
              condition: row => row.risk_category === 'High',
            },
            {
              class: 'btn-warning',
              condition: row => row.risk_category === 'Medium',
            },
            {
              class: 'btn-success',
              condition: row => row.risk_category === 'Low',
            },
          ],
        },
      },
      risk_assessments: [],
      clients: [],
      searchTerm: '',
      likelihoods: [],
      categories: [],
      impacts: [],
      asset_types: [],
      assessment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      downloading: false,
    }
  },
  created() {
    this.fetchAssetTypes()
    this.fetchImpacts()
    this.fetchLikelihoods()
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
    updateField($event, field, props) {
      const app = this
      // const valuesArray = [props.row.confidentiality, props.row.integrity, props.row.availability]
      // const impactVal = app.maxValue(valuesArray)
      // const riskVal = props.row.risk_likelihood_id * impactVal
      // const riskCategory = app.analyzeRiskCategory(riskVal)
      // const params = {
      //   field, value: $event.target.value, impact_value: impactVal, risk_value: riskVal, risk_category: riskCategory,
      // }
      const params = { field, value: $event.target.value }
      // eslint-disable-next-line no-param-reassign
      props.row.loader = true
      const fetchClientsResource = new Resource('risk-assessment/update-fields')
      fetchClientsResource.update(props.row.id, params)
        .then(() => {
          // app.risk_assessments[props.index] = response
          app.$emit('reload')
          // eslint-disable-next-line no-param-reassign
          props.row.loader = false
        })
    },
    maxValue(arrayNums) {
      let max = 0
      arrayNums.forEach(num => {
        if (num > max) {
          max = num
        }
      })
      return max
    },
    analyzeRiskCategory(riskValue) {
      if (riskValue >= 6) {
        return 'High'
      }
      if (riskValue >= 3) {
        return 'Medium'
      }
      return 'Low'
    },
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
    fetchImpacts() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list()
        .then(response => {
          app.impacts = response.impacts
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource.list()
        .then(response => {
          app.likelihoods = response.likelihoods
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    exportTableToExcel(id) {
      const app = this
      app.downloading = true
      // const rawData = app.riskAssessments
      import('@/vendor/Export2Excel').then(excel => {
        app.downloading = false
        excel.export_table_to_excel(id)
      })
    },
    exportToExcel() {
      // const filtered_string = this.$refs.myTable.$refs.table.query;
      const app = this
      app.downloading = true
      const rawData = app.riskAssessments
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'RISK TREATMENT', '', '', '', '', '', '', '', '', '', '', '', '', 'RESIDUAL PLAN', '', '']]
        const tHeader = [
          'RA-ID',
          'Risk Owner',
          'Assets',
          'Asset Types',
          'Applicable Threat',
          'Applicable Vulnerability Description',
          'Existing Controls',
          'Likelihood Justification',
          'Likelihood Value',
          'C',
          'I',
          'A',
          'Impact Value',
          'Risk Value',
          'Risk Category',
          'Option',
          'Recommended Control',
          'Applicable Annexture Controls',
          'Present Status',
          'Timeline',
          'Responsibility (Actual Name)',
          'Revised Likelihood Value',
          'Justification',
          'Revised C',
          'Reversed I',
          'Reversed A',
          'Revised Impact Value',
          'Revised Risk Value',
          'Revised Risk',
          'Risk Treatment Option B',
          'Risk Treatment Plan Residual',
          'Residual Plan Present Status',
        ]
        const filterVal = [
          'ra_id',
          'risk_owner',
          'asset',
          'asset_type_id',
          'threat_impact_description',
          'vulnerability_description',
          'existing_controls',
          'likelihood_justification',
          'risk_likelihood_id',
          'confidentiality',
          'integrity',
          'availability',
          'impact_value',
          'risk_value',
          'risk_category',
          'assessment_option',
          'recommended_control',
          'applicable_annexture',
          'present_status',
          'timeline',
          'responsibility',
          'revised_likelihood_id',
          'revised_justification',
          'reversed_confidentiality',
          'reversed_integrity',
          'reversed_availability',
          'revised_impact_value',
          'revised_risk_value',
          'revised_risk_category',
          'risk_treatment_option_b',
          'risk_treatment_plan_residual',
          'residual_plan_present_status',
        ]
        const list = rawData // (filtered_string === '') ? this.items_in_stock : this.$refs.myTable.filteredData;
        const data = app.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: 'RiskAssessment',
          autoWidth: true,
          bookType: 'xlsx',
        })
        app.downloading = false
      })
    },
    formatJson(filterVal, jsonData) {
      const app = this
      const { likelihoods } = app
      const { impacts } = app
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'asset_type_id') {
          return v.asset_type.name
        }
        if (j === 'risk_likelihood_id') {
          let val = ''
          likelihoods.forEach(likelihood => {
            if (v.risk_likelihood_id === likelihood.id) {
              val = `${likelihood.id}-${likelihood.name}`
            }
          })
          return val
        }
        if (j === 'confidentiality') {
          let val = ''
          impacts.forEach(impact => {
            if (v.confidentiality === impact.id) {
              val = `${impact.id}-${impact.name}`
            }
          })
          return val
        }
        if (j === 'integrity') {
          let val = ''
          impacts.forEach(impact => {
            if (v.integrity === impact.id) {
              val = `${impact.id}-${impact.name}`
            }
          })
          return val
        }
        if (j === 'availability') {
          let val = ''
          impacts.forEach(impact => {
            if (v.availability === impact.id) {
              val = `${impact.id}-${impact.name}`
            }
          })
          return val
        }
        if (j === 'revised_likelihood_id') {
          let val = ''
          likelihoods.forEach(likelihood => {
            if (v.revised_likelihood_id === likelihood.id) {
              val = `${likelihood.id}-${likelihood.name}`
            }
          })
          return val
        }
        if (j === 'reversed_confidentiality') {
          let val = ''
          impacts.forEach(impact => {
            if (v.reversed_confidentiality === impact.id) {
              val = `${impact.id}-${impact.name}`
            }
          })
          return val
        }
        if (j === 'reversed_integrity') {
          let val = ''
          impacts.forEach(impact => {
            if (v.reversed_integrity === impact.id) {
              val = `${impact.id}-${impact.name}`
            }
          })
          return val
        }
        if (j === 'reversed_availability') {
          let val = ''
          impacts.forEach(impact => {
            if (v.reversed_availability === impact.id) {
              val = `${impact.id}-${impact.name}`
            }
          })
          return val
        }
        if (j === 'risk_category') {
          return v.risk_category
        }
        return v[j]
      }))
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
