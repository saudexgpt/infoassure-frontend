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
      View More
    </el-button>
    <el-button
      v-else
      type="danger"
      size="mini"
      @click="expand = false"
    >
      View Less
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
            <div style="width: 150px">
              Business Unit
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
              Legal, Regulatory and Contractual Obligations
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              Impact Criteria
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              Less than 1 Hour (60 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              3 Hours (180 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              1 day (540 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              3 days (1420 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
              1 week (2700 mins)
            </div>
          </th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 14px;"
            data-f-sz="14"
          >
            <div style="width: 150px">
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
            <div style="width: 50px">
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
            <div style="width: 100px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
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
            <div style="width: 150px">
              Remote Working
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!downloading">
        <template
          v-for="(report, index1) in business_impact_analyses"
        >

          <tr :key="index1">
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ index1 + 1 }}
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
            <td>
              <select
                v-model="report.impacts[0].one_hr"
                placeholder="Select"
                class="form-control"
                @change="updateImpact($event, report.impacts[0].id, 'one_hr')"
              >
                <option
                  v-for="(imp, imp_index) in impacts_list"
                  :key="imp_index"
                  :value="imp.value"
                  :label="imp.label"
                />
              </select>
            </td>
            <td>
              <select
                v-model="report.impacts[0].three_hrs"
                placeholder="Select"
                class="form-control"
                @change="updateImpact($event, report.impacts[0].id, 'three_hrs')"
              >
                <option
                  v-for="(imp, imp_index) in impacts_list"
                  :key="imp_index"
                  :value="imp.value"
                  :label="imp.label"
                />
              </select>
            </td>
            <td>
              <select
                v-model="report.impacts[0].one_day"
                placeholder="Select"
                class="form-control"
                @change="updateImpact($event, report.impacts[0].id, 'one_day')"
              >
                <option
                  v-for="(imp, imp_index) in impacts_list"
                  :key="imp_index"
                  :value="imp.value"
                  :label="imp.label"
                />
              </select>
            </td>
            <td>
              <select
                v-model="report.impacts[0].three_days"
                placeholder="Select"
                class="form-control"
                @change="updateImpact($event, report.impacts[0].id, 'three_days')"
              >
                <option
                  v-for="(imp, imp_index) in impacts_list"
                  :key="imp_index"
                  :value="imp.value"
                  :label="imp.label"
                />
              </select>
            </td>
            <td>
              <select
                v-model="report.impacts[0].one_week"
                placeholder="Select"
                class="form-control"
                @change="updateImpact($event, report.impacts[0].id, 'one_week')"
              >
                <option
                  v-for="(imp, imp_index) in impacts_list"
                  :key="imp_index"
                  :value="imp.value"
                  :label="imp.label"
                />
              </select>
            </td>
            <td>
              <select
                v-model="report.impacts[0].two_weeks"
                placeholder="Select"
                class="form-control"
                @change="updateImpact($event, report.impacts[0].id, 'two_weeks')"
              >
                <option
                  v-for="(imp, imp_index) in impacts_list"
                  :key="imp_index"
                  :value="imp.value"
                  :label="imp.label"
                />
              </select>
            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
              :style="`background: ${calculatePriority(report.impacts)[1]}`"
            >
              {{ calculatePriority(report.impacts)[0] }}

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              {{ calculateMinumimServiceLevel(report.business_process.minimum_no_of_people_involved, report.business_process.no_of_people_involved) }}%

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              <textarea
                v-model="report.maximum_allowable_outage"
                class="form-control"
                placeholder="Type something..."
                @blur="updateBIA($event, report.id, 'maximum_allowable_outage')"
              />

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              <textarea
                v-model="report.recovery_time_objective"
                class="form-control"
                placeholder="Type something..."
                @blur="updateBIA($event, report.id, 'recovery_time_objective')"
              />

            </td>
            <td
              v-if="expand"
              :rowspan="report.impacts.length"
            >
              <textarea
                v-model="report.recovery_point_objective"
                class="form-control"
                placeholder="Type something..."
                @blur="updateBIA($event, report.id, 'recovery_point_objective')"
              />

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
                <td>
                  <select
                    v-model="report.impacts[impact_index + 1].one_hr"
                    placeholder="Select"
                    class="form-control"
                    @change="updateImpact($event, report.impacts[impact_index + 1].id, 'one_hr')"
                  >
                    <option
                      v-for="(imp, imp_index) in impacts_list"
                      :key="imp_index"
                      :value="imp.value"
                      :label="imp.label"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.impacts[impact_index + 1].three_hrs"
                    placeholder="Select"
                    class="form-control"
                    @change="updateImpact($event, report.impacts[impact_index + 1].id, 'three_hrs')"
                  >
                    <option
                      v-for="(imp, imp_index) in impacts_list"
                      :key="imp_index"
                      :value="imp.value"
                      :label="imp.label"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.impacts[impact_index + 1].one_day"
                    placeholder="Select"
                    class="form-control"
                    @change="updateImpact($event, report.impacts[impact_index + 1].id, 'one_day')"
                  >
                    <option
                      v-for="(imp, imp_index) in impacts_list"
                      :key="imp_index"
                      :value="imp.value"
                      :label="imp.label"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.impacts[impact_index + 1].three_days"
                    placeholder="Select"
                    class="form-control"
                    @change="updateImpact($event, report.impacts[impact_index + 1].id, 'three_days')"
                  >
                    <option
                      v-for="(imp, imp_index) in impacts_list"
                      :key="imp_index"
                      :value="imp.value"
                      :label="imp.label"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.impacts[impact_index + 1].one_week"
                    placeholder="Select"
                    class="form-control"
                    @change="updateImpact($event, report.impacts[impact_index + 1].id, 'one_week')"
                  >
                    <option
                      v-for="(imp, imp_index) in impacts_list"
                      :key="imp_index"
                      :value="imp.value"
                      :label="imp.label"
                    />
                  </select>
                </td>
                <td>
                  <select
                    v-model="report.impacts[impact_index + 1].two_weeks"
                    placeholder="Select"
                    class="form-control"
                    @change="updateImpact($event, report.impacts[impact_index + 1].id, 'two_weeks')"
                  >
                    <option
                      v-for="(imp, imp_index) in impacts_list"
                      :key="imp_index"
                      :value="imp.value"
                      :label="imp.label"
                    />
                  </select>
                </td>
              </template>
            </tr>
          </template>

        </template>

      </tbody>
      <tbody v-else>
        <tr
          v-for="(report, index2) in business_impact_analyses"
          :key="index2"
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
    this.storeBIA()
  },
  methods: {
    calculatePriority(impacts) {
      const critical = impacts.filter(impact => impact.one_hr === 3 || impact.three_hrs === 3 || impact.one_day === 3)
      const monitor = impacts.filter(impact => impact.three_days === 3 || impact.one_week === 3)

      if (critical.length > 0) {
        return ['Critical', '#F56C6C']
      }
      if (monitor.length > 0) {
        return ['Monitor', '#FFFFFF']
      }
      return ['Non-Critical', '#17ca17']
    },
    calculateMinumimServiceLevel(a, b) {
      return (a / b) * 100
    },
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
    storeBIA() {
      const app = this
      app.loading = true
      const storeBIAResource = new Resource('bia/store')
      storeBIAResource.store({ client_id: app.clientId, business_unit_id: app.businessUnitId })
        .then(() => {
          app.fetchBIA()
        }).catch(error => {
          app.loading = false
          app.$alert(error.response.data.message)
        })
    },
    async updateImpact(event, id, field) {
      const updateImpactResource = new Resource('bia/update-disruption-impact')
      await updateImpactResource.update(id, { value: event.target.value, field })
    },
    async updateBIA(event, id, field) {
      const updateBIAResource = new Resource('bia/update-bia')
      await updateBIAResource.update(id, { value: event.target.value, field })
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
