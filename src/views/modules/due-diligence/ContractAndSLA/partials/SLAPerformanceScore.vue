<template>
  <el-row
    v-if="contract !== null"
    :gutter="5"
  >
    <el-col :md="24">
      <div style="border: #f0f0f0 4px solid; padding: 10px; border-radius: 5px;">
        <el-row>
          <el-col :md="24">
            <div style="text-align: center;">
              <h4>SLA PERFORMANCE SCORE CARD</h4>
              <strong>{{ contract.title }}</strong>
            </div>
          </el-col>
          <el-col :md="12">
            <p><strong>Contract ID:</strong> #{{ contract.id }}</p>
            <p><strong>Start Date:</strong> {{ contract.start_date }}</p>
            <p><strong>Expiry Date:</strong> {{ contract.expiry_date }}</p>
          </el-col>
          <el-col :md="12">
            <div style="text-align: right;">
              <p>
                <strong>Created:</strong> {{ moment(contract.created_at).fromNow() }}
              </p>
              <p><strong>Last Modified:</strong> {{ moment(contract.updated_at).fromNow() }}</p>
            </div>
          </el-col>
        </el-row>
        <div>
          <h4><em>SLA Performance Score Card</em></h4>
          <table
            v-loading="loading"
            class="table table-bordered"
          >
            <tbody>
              <tr>
                <td>
                  <strong>Service Name/Title</strong>
                </td>
                <td>
                  {{ sla.service_name }}
                </td>
              </tr>
              <tr>
                <td><strong>Service Description</strong></td>
                <td>
                  {{ sla.service_description }}
                </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td
                  colspan="4"
                  align="center"
                >
                  <h4>KPI METRICS</h4>
                  <small>Key Performance Indicators</small>
                </td>
              </tr>
              <tr>
                <td />
                <td>Metrics</td>
                <td>Target</td>
                <td>Achieved Value</td>
              </tr>
              <tr
                v-for="(item, index) in score.kpi_metrics"
                :key="index"
              >
                <template v-if="item.metrics !== '' && item.metrics !== null">
                  <td>
                    <span>
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td width="400">
                    <strong>{{ item.metrics }}</strong><br>
                    <small><em>{{ item.hint }}</em></small>
                  </td>
                  <td>
                    <strong>{{ item.target }}{{ item.unit }}</strong>
                  </td>
                  <td>
                    <el-input
                      v-model="item.result"
                      type="number"
                      :min="1"
                      :max="100"
                    >
                      <template slot="append">
                        {{ item.unit }}
                      </template>
                    </el-input>
                    <small>Supply achieved value</small>
                  </td>
                </template>
              </tr>
              <tr>
                <td colspan="2">
                  <strong>Service Quality Rating</strong>
                </td>
                <td colspan="2">
                  <el-rate
                    v-model="score.service_quality_rating"
                    :colors="['red', 'orange', 'green']"
                    :texts="['Bad', 'Poor', 'Average', 'Good', 'Excellent']"
                    show-text
                    :allow-half="true"
                  />
                  <small>Customer satisfaction rating</small>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td><strong>SLA Compliance Status</strong></td>
                <td>
                  Pending
                </td>
              </tr>
              <tr>
                <td><strong>Overall Performance Score</strong></td>
                <td>
                  Pending
                </td>
              </tr>
              <tr>
                <td><strong>Action Required</strong></td>
                <td>
                  <el-select
                    v-model="score.action_required"
                    style="width: 100%"
                    placeholder="Set Value"
                  >
                    <el-option
                      v-for="(method, index2) in ['None', 'Escalate', 'Issue Warning', 'Terminate']"
                      :key="index2"
                      :label="method"
                      :value="method"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <td><strong>Notes/Comments</strong></td>
                <td>
                  <div style="width: 99%">
                    <ckeditor
                      v-model="score.comments"
                      :editor="editor"
                      :config="editorConfig"
                    />
                    <small>Additional observations</small>
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Approval Status</strong></td>
                <td>
                  <el-select
                    v-model="score.approval_status"
                    style="width: 100%"
                    placeholder="Set Value"
                  >
                    <el-option
                      v-for="(type, index4) in ['Pending', 'Approved', 'Reject']"
                      :key="index4"
                      :label="type"
                      :value="type"
                    />
                  </el-select>
                </td>
              </tr>
              <tr v-if="score.penalty_type === 'Financial Penalties'">
                <td><strong>Penalty Amount (%)</strong></td>
                <td>
                  <el-input
                    v-model="score.penalty_amount"
                    type="number"
                  >
                    <template slot="append">
                      %
                    </template>
                  </el-input>
                  <small>Set percentage of contract value as penalty</small>
                </td>
              </tr>
              <tr>
                <td
                  align="right"
                  colspan="2"
                >
                  <el-button
                    type="success"
                    @click="saveSLA()"
                  >
                    Save Changes
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-col>
    <!-- <el-col :md="7">
      <aside>
        <h4>Uploaded Contract</h4>
        <iframe
          class="doc"
          :src="baseServerUrl+'storage/'+contract.file_link"
          width="330"
          height="500"
        />
      </aside>
    </el-col> -->
  </el-row>
</template>
<script>
import moment from 'moment'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Resource from '@/api/resource'

export default {
  props: {
    selectedContract: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      currency: '₦',
      loading: false,
      contract: null,
      defaultScoreVal: {
        contract_id: '',
        client_id: '',
        vendor_id: '',
        sla_config_id: '',
        delivery_timeliness: '',
        service_quality_rating: '',
        uptime_performance: '',
        issue_resolution_time: '',
        sla_compliance_status: '',
        overall_performance_score: '',
        action_required: '',
        comments: '',
        approval_status: '',
        kpi_metrics: [],
      },
      score: null,
      sla: null,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  mounted() {
    this.setupSLAValues()
  },
  methods: {
    moment,
    setupSLAValues() {
      const app = this
      app.contract = app.selectedContract
      app.sla = app.selectedContract.sla
      app.score = (app.selectedContract.score !== null) ? app.selectedContract.score : app.defaultScoreVal
      app.score.kpi_metrics = (app.selectedContract.score !== null) ? app.score.kpi_metrics : app.sla.performance_metrics
      app.score.vendor_id = app.contract.vendor_id
      app.score.client_id = app.contract.client_id
      app.score.contract_id = app.contract.id
      app.score.sla_config_id = app.sla.id
    },
    saveSLA() {
      const app = this
      app.loading = true
      const form = app.score
      const saveScoreResource = new Resource('vdd/client-contracts/save-performance-score')
      saveScoreResource.store(form)
        .then(() => {
          app.$message({ message: 'Action Successful', type: 'success' })
          app.loading = false
        })
        .catch(() => { app.loading = false })
    },
  },
}
</script>
