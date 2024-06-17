<template>
  <el-card>
    <h4>Risk Control Self Assessment</h4>
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.client_id"
            placeholder="Select Client"
            style="width: 100%;"
            filterable
            @input="fetchBusinessUnits()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client.id"
              :label="client.name"
            />
          </el-select>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            filterable
            @input="createRCSA()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit.id"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <div v-if="form.business_unit_id !== ''">
      <div v-if="showNewCategoryForm">
        <span class="pull-right">
          <el-button
            type="danger"
            @click="showNewCategoryForm = false"
          >
            Close Form
          </el-button>
        </span>
        <p />
        <create-r-c-s-a-category
          :client-id="form.client_id"
          :business-unit-id="form.business_unit_id"
          @save="fetchRCSA(); showNewCategoryForm = false"
        />
      </div>
      <div
        v-else
      >
        <span class="pull-right">
          <el-button
            type="primary"

            @click="exportToExcel('RCSAReport', 'ProcessScoreDetails')"
          >
            Export
          </el-button>
          <el-button
            type="success"

            @click="showNewCategoryForm = true"
          >
            Create New Category
          </el-button>
        </span>
        <div class="table-responsive">
          <p />
          <table
            id="RCSAReport"
            v-loading="loading"
            class="table table-bordered"
          >
            <thead>
              <tr>
                <th colspan="7" />
                <th
                  data-fill-color="CCCCCC"
                  data-b-a-s="thin"
                  data-f-color="000000"
                  style="font-size: 14px;"
                  data-f-sz="14"
                  colspan="3"
                >
                  SELF ASSESSMENT
                </th>
                <th
                  data-fill-color="9fb5b6"
                  data-b-a-s="thin"
                  data-f-color="000000"
                  style="font-size: 14px;"
                  data-f-sz="14"
                  colspan="3"
                >
                  VALIDATION
                </th>
                <th
                  data-fill-color="CCCCCC"
                  data-b-a-s="thin"
                  data-f-color="000000"
                  style="font-size: 14px;"
                  data-f-sz="14"
                  colspan="2"
                >
                  PROCESS LEVEL RISK ASSESSMENT
                </th>
              </tr>
              <tr>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    KEY PROCESS
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    CONTROL ACTIVITIES
                  </div>
                </th>
                <th

                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    CONTROL OWNER
                  </div>
                </th>
                <th

                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    SOURCE
                  </div>
                </th>
                <th

                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 150px">
                    CONTROL TYPE
                  </div>
                </th>
                <th

                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 150px">
                    RISK DESCRIPTION
                  </div>
                </th>
                <th

                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    RESIDUAL RISK RATING IN THE RISK REGISTER
                  </div>
                </th>
                <th

                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    SELF ASSESSMENT OF CONTROL
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    SELF ASSESSMENT SCORE
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    COMMENT ON CURRENT STATUS OR ACTION PLAN
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    RM RATING OF CONTROL
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 100px">
                    VALIDATION
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    BASIS OF RM RATING
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    SELF ASSESSMENT OF PROCESS LEVEL RISK
                  </div>
                </th>
                <th
                  data-fill-color="666666"
                  data-b-a-s="thin"
                  data-f-color="ffffff"
                  style="font-size: 14px;"
                  data-f-sz="12"
                >
                  <div style="width: 250px">
                    RM VALIDATED PROCESS LEVEL RISK
                  </div>
                </th>
              </tr>
            </thead>
            <tbody v-if="!downloading">
              <template
                v-for="(categories, category_key) in rcsas"
              >
                <tr :key="category_key + '_a'">
                  <td
                    colspan="15"
                    style="background-color: #409EFF; color: #ffffff;"
                  >
                    {{ category_key }}
                  </td>
                </tr>
                <tr
                  v-for="report in categories"
                  :key="report.id"
                >

                  <td>{{ report.key_process }}</td>
                  <td>{{ report.control_activities }}</td>
                  <td>{{ report.control_owner }}</td>
                  <td>
                    <input
                      v-model="report.source"
                      type="text"
                      class="form-control"
                      @blur="updateField($event, 'source', report)"
                    >
                  </td>
                  <td>
                    {{ report.control_type }}
                  </td>
                  <td>
                    {{ report.risk_description }}
                  </td>
                  <td>
                    <select
                      v-model="report.risk_rating"
                      class="form-control"
                      @change="updateField($event, 'risk_rating', report)"
                    >
                      <option
                        label="High"
                        value="High"
                      />
                      <option
                        label="Medium"
                        value="Medium"
                      />
                      <option
                        label="Low"
                        value="Low"
                      />
                    </select>
                  </td>
                  <td :style="`background-color: #${setControlBgColor(report.self_assessment_control)}`">
                    <select
                      v-model="report.self_assessment_control"
                      class="form-control"
                      @change="updateField($event, 'self_assessment_control', report)"
                    >
                      <option
                        v-for="(control, control_index) in control_assessments"
                        :key="control_index"
                        :label="control"
                        :value="control"
                      />
                    </select>
                  </td>
                  <td>
                    {{ report.self_assessment_score }}
                  </td>
                  <td>
                    <textarea
                      v-model="report.comment_on_status"
                      type="text"
                      class="form-control"
                      @blur="updateField($event, 'comment_on_status', report)"
                    />
                  </td>
                  <td :style="`background-color: #${setControlBgColor(report.rm_rating_of_control)}`">
                    <select
                      v-model="report.rm_rating_of_control"
                      class="form-control"
                      @change="updateField($event, 'rm_rating_of_control', report)"
                    >
                      <option
                        v-for="(control, control_index) in control_assessments"
                        :key="control_index"
                        :label="control"
                        :value="control"
                      />
                    </select>
                  </td>
                  <td>
                    {{ report.validation }}
                  </td>
                  <td>
                    <textarea
                      v-model="report.basis_of_rm_rating"
                      type="text"
                      class="form-control"
                      @blur="updateField($event, 'basis_of_rm_rating', report)"
                    />
                  </td>
                  <td :style="`background-color: #${setRiskBgColor(report.self_assessment_of_process_level_risk)}; color: #ffffff`">
                    {{ report.self_assessment_of_process_level_risk }}
                  </td>
                  <td :style="`background-color: 3${setRiskBgColor(report.rm_validated_process_level_risk)}; color: #ffffff`">
                    {{ report.rm_validated_process_level_risk }}
                  </td>
                </tr>
              </template>

            </tbody>
            <tbody v-else>
              <template
                v-for="(categories, category_key) in rcsas"
              >
                <tr :key="category_key +'_b'">
                  <td
                    colspan="15"
                    data-fill-color="409EFF"
                    data-b-a-s="thin"
                    data-f-color="FFFFFF"
                  >
                    <strong>{{ category_key }}</strong>
                  </td>
                </tr>
                <tr
                  v-for="report in categories"
                  :key="report.id"
                >

                  <td>{{ report.key_process }}</td>
                  <td>{{ report.control_activities }}</td>
                  <td>{{ report.control_owner }}</td>
                  <td>
                    {{ report.source }}
                  </td>
                  <td>
                    {{ report.control_type }}
                  </td>
                  <td>
                    {{ report.risk_description }}
                  </td>
                  <td>
                    {{ report.risk_rating }}
                  </td>
                  <td
                    :data-fill-color="setControlBgColor(report.self_assessment_control)"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.self_assessment_control }}
                  </td>
                  <td
                    data-fill-color="CCCCCC"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.self_assessment_score }}
                  </td>
                  <td
                    data-fill-color="CCCCCC"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.comment_on_status }}
                  </td>
                  <td
                    :data-fill-color="setControlBgColor(report.rm_rating_of_control)"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.rm_rating_of_control }}
                  </td>
                  <td
                    data-fill-color="9fb5b6"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.validation }}
                  </td>
                  <td
                    data-fill-color="9fb5b6"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.basis_of_rm_rating }}
                  </td>
                  <td
                    :data-fill-color="setRiskBgColor(report.self_assessment_of_process_level_risk)"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.self_assessment_of_process_level_risk }}
                  </td>
                  <td
                    :data-fill-color="setRiskBgColor(report.rm_validated_process_level_risk)"
                    data-b-a-s="thin"
                    data-f-color="000000"
                  >
                    {{ report.rm_validated_process_level_risk }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <br>
      </div>
      <table
        id="ProcessScoreDetails"
        class="table table-bordered"
      >
        <thead>
          <tr>
            <th colspan="4">
              <h4>Process Score</h4>
            </th>
          </tr>
          <tr>
            <th>Category</th>
            <th>Self Assessment Score</th>
            <th>Validation Score</th>
            <th>Overall Process Control Ratings</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(detail, index) in category_details"
            :key="index + 'cat_details'"
          >
            <td>{{ detail.category }}</td>
            <td>{{ detail.percent_self_assessment_score }}%</td>
            <td>{{ detail.percent_validation_score }}%</td>
            <td>
              <select
                v-if="!downloading"
                v-model="detail.overall_process_control_rating"
                class="form-control"
                @change="updateOverallRating($event, detail.category)"
              >
                <option
                  v-for="(control, control_index) in control_assessments"
                  :key="control_index"
                  :label="control"
                  :value="control"
                />
              </select>
              <div v-else>
                {{ detail.overall_process_control_rating }}
              </div>
            </td>
          </tr>
          <tr>
            <td>Total Score</td>
            <td>{{ total_scores.total_self_assessment_score }}</td>
            <td>{{ total_scores.total_validation_score }}</td>
            <td />
          </tr>
          <tr>
            <td>Potential Maximum Score</td>
            <td>{{ total_scores.potential_max_score }}</td>
            <td>{{ total_scores.potential_max_score }}</td>
            <td />
          </tr>
          <tr>
            <td>Percentage Rating</td>
            <td>{{ total_scores.self_assessment_percentage_rating }}%</td>
            <td>{{ total_scores.validation_percentage_rating }}%</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>

<script>
// import {
//   BButton,
// } from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import TableToExcel from '@linways/table-to-excel'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateRCSACategory from './partials/CreateRCSACategory.vue'

export default {
  components: {
    CreateRCSACategory,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      downloading: false,
      control_assessments: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'N/A'],
      rcsas: [],
      category_details: [],
      total_scores: '',
      clients: [],
      business_units: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
      },
      selectedRisk: null,
      showNewCategoryForm: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      const fetchCriteriaResource = new Resource('clients')
      fetchCriteriaResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.form.client_id = app.clients[0].id
            app.fetchBusinessUnits()
          }
        })
    },
    fetchBusinessUnits() {
      const app = this
      app.form.business_unit_id = ''
      const fetchCriteriaResource = new Resource('business-units/fetch-business-units')
      fetchCriteriaResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.business_units = response.business_units
        }).catch(() => { app.loading = false })
    },
    createRCSA() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('rcsa/create-rcsa-from-rcm')
      fetchRisksResource.store({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.rcsas = response.rcsas
          app.total_scores = response.total_scores
          app.category_details = response.category_details
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchRCSA() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('rcsa/fetch')
      fetchRisksResource.get({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.rcsas = response.rcsas
          app.total_scores = response.total_scores
          app.category_details = response.category_details
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    updateField(event, field, assessment) {
      const app = this
      const params = {
        field, value: event.target.value, client_id: app.form.client_id, business_unit_id: app.form.business_unit_id,
      }
      const updateResource = new Resource('rcsa/update-fields')
      updateResource.update(assessment.id, params)
        .then(response => {
          app.rcsas = response.rcsas
          app.total_scores = response.total_scores
          app.category_details = response.category_details
        })
    },
    updateOverallRating(event, category) {
      const app = this
      const params = {
        category, value: event.target.value, client_id: app.form.client_id, business_unit_id: app.form.business_unit_id,
      }
      const updateResource = new Resource('rcsa/update-overall-control-rating')
      updateResource.store(params)
        .then(response => {
          app.rcsas = response.rcsas
          app.total_scores = response.total_scores
          app.category_details = response.category_details
        })
    },
    setControlBgColor(value) {
      let color = 'ff0000'
      switch (value) {
        case 'Level 2':
          color = 'ffa500'
          break
        case 'Level 3':
          color = 'ffff00'
          break
        case 'Level 4':
          color = '008000'
          break
        default:
          break
      }
      return color
    },
    setRiskBgColor(value) {
      let color = 'c9004d'
      switch (value) {
        case 'Medium':
          color = 'ebaf41'
          break
        case 'Low':
          color = '056b16'
          break
        default:
          break
      }
      return color
    },
    exportToExcel(id1, id2) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        const table1 = document.getElementById(id1)
        const table2 = document.getElementById(id2)
        const book = TableToExcel.tableToBook(table1, { sheet: { name: 'Risk Control Self Assessment' } })
        TableToExcel.tableToSheet(book, table2, { sheet: { name: 'Overall Process Control Rating' } })
        TableToExcel.save(book, 'RCSA-Report.xlsx')
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
    // exportToExcel(id) {
    //   const app = this
    //   app.downloading = true
    //   setTimeout(() => {
    //     TableToExcel.convert(document.getElementById(id), {
    //       name: 'RCSA-Report.xlsx',
    //       sheet: {
    //         name: 'Sheet 1',
    //       },
    //     })
    //   }, 1000)

    //   setTimeout(() => {
    //     app.downloading = false
    //   }, 30000)
    // },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyProjectsResource = new Resource('risk-assessment/destroy')
        destroyProjectsResource.destroy(row.id)
          .then(() => {
            app.fetchRisks()
            app.loading = false
          })
      }
    },
  },
}
</script>
      <style lang="scss" >
      @import '@core/scss/vue/libs/vue-good-table.scss';
      </style>
