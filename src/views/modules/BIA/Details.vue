<template>
  <el-card>
    <el-button
      :loading="downloading"
      type="primary"
      size="mini"
      @click="exportToExcel('BIAReport')"
    >
      Export
    </el-button>
    <el-button
      v-if="!expand"
      type="warning"
      size="mini"
      @click="expand = true"
    >
      Expand Table
    </el-button>
    <el-button
      v-else
      type="danger"
      size="mini"
      @click="expand = false"
    >
      Shrink Table
    </el-button>
    <table
      id="BIAReport"
      v-loading="loading"
      class="table table-bordered table-responsive"
    >
      <thead>
        <tr>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 10px">
              SN
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Business Unit
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Business Process Name
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Business Process Description Summary
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Role(s) responsible for business process
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              Number of individuals involved in performing the business process
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              Minimum number of people that can carry out this process that would still make economic sense
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Product or Service being delivered
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Legal, Regulatory and Contractual Obligations
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Impact Criteria
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Less than 1 Hour (60 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              3 Hours (180 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              1 day (540 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              3 days (1420 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              1 week (2700 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              2 weeks (5400 mins)
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Priority
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Minimum Service Level
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              MAO (Maximum Allowable Outage)
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              RTO (Recovery Time Objective)
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              RPO (Recovery Point Objective)
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Applications used by process
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Which Business Units are you dependent on?
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Which Business Processes are you dependent on in the Business Unit(s) listed in the previous cell.
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Who are your Key vendors or External dependencies
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Vital Non-Electronic Records
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Vital Electronic Records
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Alternative Workarounds during system failure
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Are there important key individuals this process is dependent on
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Peak Period
            </div>
          </th>
          <th
            v-if="expand"
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 250px">
              Remote Working
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!downloading">
        <template
          v-for="(report, index) in business_impact_analyses"
        >

          <tr :key="index">
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ index + 1 }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_unit.unit_name }}
            </td>
            <td :rowspan="report.impacts.length">
              {{ report.business_process.name }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.description }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.roles_responsible }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.no_of_people_involved }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.minimum_no_of_people_involved }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.product_or_service_delivered }}
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.regulatory_obligations }}
            </td>
            <td>{{ report.impacts[0].criteria }}</td>
            <td>{{ report.impacts[0].one_hr }}</td>
            <td>{{ report.impacts[0].three_hrs }}</td>
            <td>{{ report.impacts[0].one_day }}</td>
            <td>{{ report.impacts[0].three_days }}</td>
            <td>{{ report.impacts[0].one_week }}</td>
            <td>{{ report.impacts[0].two_weeks }}</td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.priority }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.minimum_service_level }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.maximum_allowable_outage }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.recovery_time_objective }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.recovery_point_objective }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.applications_used }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.business_units_depended_on }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.processes_depended_on }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.key_vendors_or_external_dependencies }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.vital_non_electronic_records }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.vital_electronic_records }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.alternative_workaround_during_system_failure }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.key_individuals_process_depends_on }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.peak_periods }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ report.business_process.remote_working }}

            </td>
          </tr>
          <template v-if="report.impacts.length > 1">
            <tr
              v-for="(impact, impact_index) in report.impacts"
              :key="impact_index"
            >
              <template v-if="report.impacts[impact_index + 1]">

                <td>{{ report.impacts[impact_index + 1].criteria }}</td>
                <td>{{ report.impacts[impact_index + 1].one_hr }}</td>
                <td>{{ report.impacts[impact_index + 1].three_hrs }}</td>
                <td>{{ report.impacts[impact_index + 1].one_day }}</td>
                <td>{{ report.impacts[impact_index + 1].three_days }}</td>
                <td>{{ report.impacts[impact_index + 1].one_week }}</td>
                <td>{{ report.impacts[impact_index + 1].two_weeks }}</td>
              </template>
            </tr>
          </template>

        </template>

      </tbody>
      <tbody v-else>
        <tr
          v-for="(report, index) in business_impact_analyses"
          :key="index"
        >
          <td>{{ report.question.question }}</td>
          <td>{{ report.question.key }}</td>
          <td>{{ report.answer }}</td>
          <td>{{ report.detailed_explanation }}</td>
          <td>{{ report.observation }}</td>
          <td>{{ formatRiskScore(report.risk_score) }}</td>
          <td>{{ report.impact }}</td>
          <td>{{ report.recommendations }}</td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>
<script>
// import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'

export default {
  props: {
    businessUnitId: {
      type: Number,
      default: null,
    },
    clientId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      expand: false,
      business_impact_analyses: [],
      loading: false,
      downloading: false,
      impacts_list: [{ value: 1, label: '1-Low' }, { value: 2, label: '2-Medium' }, { value: 3, label: '3-High' }],
    }
  },
  created() {
    this.fetchBIA()
  },
  methods: {

    fetchBIA() {
      const app = this
      app.loading = true
      const fetchBIAResource = new Resource('bia/fetch-bia')
      fetchBIAResource.list({ client_id: app.clientId, business_unit_id: app.businessUnitId })
        .then(response => {
          app.loading = false
          app.business_impact_analyses = response.business_impact_analyses
        })
    },
    exportToExcel(id) {
      const app = this
      app.$alert('Feature not enabled', id)
      // app.downloading = true
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: `${app.selectedClient.name}-3rd-Party-Vendor-Due-Diligence-Assessment.xlsx`,
      //     sheet: {
      //       name: 'Sheet 1',
      //     },
      //   })
      // }, 1000)

      // setTimeout(() => {
      //   app.downloading = false
      // }, 30000)
    },
  },
}
</script>
