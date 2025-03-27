<!-- eslint-disable vue/html-indent -->
<template>
  <el-card>
    <div slot="header">
      <span
        v-if="isEdit"
        class="pull-right"
      >
        <el-button
          type="primary"
          size="mini"
          @click="isEdit= false"
        >
          View Summary Sheet
        </el-button>
      </span>
      <h4>Risk Assessment</h4>
    </div>

    <el-container style="height: 100%; border: 1px solid #eee; background: #fff;">
      <el-aside
        width="300px"
        style="overflow: auto; padding: 0"
      >
        <!-- <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside> -->
        <div
          style="max-height: 250px; overflow: auto;"
        >
          <el-menu
            background-color="#fcfcfc"
            text-color="#00000"
          >
            <el-submenu
              v-for="(assessments, index) in grouped_risk_assessments"
              :key="index"
              :index="index"
            >
              <template slot="title">
                {{ index.substring(0,20) }}
              </template>
              <el-menu-item
                v-for="(detail, detail_index) in assessments"
                :key="detail_index"
                :index="`${index}-${detail_index}`"
                @click="viewDetails(detail)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="detail.vulnerability_description"
                  placement="top-start"
                >
                  <template slot="content">
                    <!-- eslint-disable-next-line vue/no-v-html-->
                    <span v-html="detail.vulnerability_description" />
                  </template>
                  <span v-if="detail.vulnerability_description.length > 30">
                    {{ detail.risk_id }} - {{ detail.vulnerability_description.substring(0,30) }}...
                  </span>
                  <span v-else>
                    {{ detail.risk_id }} - {{ detail.vulnerability_description }}
                  </span>
                </el-tooltip>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div
          v-if="selectedData !== null && isEdit"
          style="background: #fff;"
        >
          <div
            class="alert-dark"
            style="text-align: center"
          >
            Details of {{ selectedData.risk_id }}
          </div>
          <div
            style="background: #f7f0da; padding: 10px;"
          >
            <strong>Risk Owner:</strong><br>
            <small>{{ selectedData.risk_owner }}</small><br>
            <strong>Business Unit:</strong><br>
            <small>{{ selectedData.business_unit }}</small><br>
            <strong>Business Process:</strong><br>
            <small>{{ selectedData.business_process }}</small><br>
            <strong>Risk Type:</strong><br>
            <small>{{ selectedData.type }}</small><br>
            <strong>Risk Description:</strong><br>
            <!-- eslint-disable-next-line vue/no-v-html-->
            <small v-html="selectedData.vulnerability_description" /><br>
            <strong>Outcome/Impact:</strong><br>
            <!-- eslint-disable-next-line vue/no-v-html-->
            <small v-html="selectedData.outcome" />
          </div>
        </div>
      </el-aside>

      <el-container>

        <el-main v-loading="loadView">
          <div v-if="isEdit">
            <edit-risk-assessment
            :impacts="impacts"
            :likelihoods="likelihoods"
            :selected-data="selectedData"
            :risk-appetite="risk_appetite"
            @updated="renderViewAgain"
            />
          </div>
          <div v-else>
            <view-risk-assessment
              v-loading="loading"
              :selected-client="selectedClient"
              :standard-id="0"
              :impacts="impacts"
              :likelihoods="likelihoods"
              :assessment-module="'rcsa'"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import EditRiskAssessment from './partials/EditRiskAssessment.vue'
// import RiskAssessmentTable from './partials/RiskAssessmentTable.vue'
import ViewRiskAssessment from './partials/RiskAssessmentDetails.vue'

export default {
  components: {
    EditRiskAssessment,
    ViewRiskAssessment,
  },
  props: {
    selectedClient: {
      type: Object,
      default: null,
    },
    assessmentModule: {
      type: String,
      default: () => ('rcsa'), // this is the general risk assessment
    },
  },
  data() {
    return {
      selectedData: null,
      grouped_risk_assessments: {},
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      loadView: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      response: {},
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.fetchRiskAssessments(true)
    this.setMatrix()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.label.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_dpias.splice(this.sub_dpias.indexOf(tag), 1)
    },
    createNew() {
      const app = this
      app.isEdit = false
      app.form = { name: '', sub_dpias: [] }
      app.sub_dpias = []
    },
    viewDetails(data) {
      if (data.id) {
        const app = this
        app.loadView = true
        app.isEdit = false
        setTimeout(() => {
          app.selectedData = data
          app.isEdit = true
          app.loadView = false
        }, 10)
      }
    },
    fetchRiskAssessments(load = true) {
      const app = this
      app.loading = load
      const fetchRiskAssessmentsResource = new Resource('rcsa/fetch-risk-assessments')
      fetchRiskAssessmentsResource.list({ client_id: app.selectedClient.id, standard_id: 0, module: app.assessmentModule })
        .then(response => {
          app.grouped_risk_assessments = response.grouped_risk_assessments
          app.risk_appetite = response.risk_appetite
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const app = this
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list(param)
        .then(response => {
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
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource.list(param)
        .then(response => {
          app.likelihoods = response.likelihoods
        })
        .catch(error => {
        // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    renderViewAgain() {
      this.fetchRiskAssessments()
      this.$notify({ title: 'Entry Updated', type: 'success' })
    },
  },
}
</script>
  <style>
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  </style>
