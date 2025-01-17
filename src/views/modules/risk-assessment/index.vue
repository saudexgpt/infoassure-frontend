<!-- eslint-disable vue/html-indent -->
<template>
  <el-card>
    <div slot="header">
      <span
        class="pull-right"
      >
        <b-button
          variant="primary"
          @click="viewType='tabular'"
        ><i class="el-icon-menu" /> Tabular View</b-button>
      </span>
      <h3>Risk Assessment</h3>
    </div>
    <el-container style="height: 100%; border: 1px solid #eee; background: #fff;">
      <el-aside
        v-if="showMenu"
        v-loading="loading"
        element-loading-text="loading assessment, please wait..."
        width="400px"
      >
        <!-- <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside> -->
        <h3>Risk Library</h3>
        <div>
          <el-menu
            v-if="activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')"
          >
            <div style="background: #cccccc; color: #000000; padding: 10px;">
              Grouped by Assets
            </div>
            <el-submenu
              v-for="(assessments, index) in asset_types"
              :key="index"
              :index="`${index}`"
            >
              <template slot="title">
                <strong>{{ index }}</strong>
              </template>

              <el-menu-item
                v-for="(risk_assessment, assessments_index) in assessments"
                :key="assessments_index"
                :index="`${index}-${assessments_index}`"
                @click="viewDetails(risk_assessment)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="risk_assessment.vulnerability_description"
                  placement="right"
                  :open-delay="500"
                >
                  <small>{{ risk_assessment.risk_id }} - {{ risk_assessment.threat }}</small>
                </el-tooltip>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          <el-menu
            v-if="(viewOnly !== 'isms' || viewOnly === 'all') && (activatedModules.includes('rcsa') || activatedModules.includes('bcms') || activatedModules.includes('ndpa'))"
          >
            <div style="background: #cccccc; color: #000000; padding: 10px;">
              Grouped by Business Process
            </div>
            <el-submenu
              v-for="(assessments, index) in business_units"
              :key="index"
              :index="`${index}`"
            >
              <template slot="title">
                <strong>{{ index }}</strong>
              </template>

              <el-menu-item
                v-for="(risk_assessment, assessments_index) in assessments"
                :key="assessments_index"
                :index="`${index}-${assessments_index}`"
                @click="viewDetails(risk_assessment)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="risk_assessment.vulnerability_description"
                  placement="right"
                  :open-delay="500"
                >
                  <small>{{ risk_assessment.risk_id }}-{{ risk_assessment.threat }}</small>
                </el-tooltip>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>

      <el-container>
        <h1>
          <el-tooltip
            effect="dark"
            content="Toggle Menu"
            placement="right"
          >
            <a
              v-if="showMenu"
              style="cursor: pointer"
              @click="toggleMenu"
            ><i class="el-icon-s-fold" /></a>
            <a
              v-else
              style="cursor: pointer"
              @click="toggleMenu"
            ><i class="el-icon-s-unfold" /></a>
          </el-tooltip>
        </h1>

        <el-main v-loading="loadView">
          <div v-if="viewType === 'edit'">
            <edit-risk-assessment
            :impacts="impacts"
            :likelihoods="likelihoods"
            :selected-data="selectedData"
            :risk-appetite="risk_appetite"
            @updated="renderViewAgain"
            />
          </div>
          <div v-if="viewType === 'tabular'">
            <risk-assessment-table
              :selected-client="selectedClient"
              :assessment-module="module"
              :risk-assessments="risk_assessments"
              :impacts="impacts"
              :likelihoods="likelihoods"
            />
          </div>
          <div
            v-if="viewType === 'welcome'"
            align="center"
          >
            <img
              src="/images/project-icons/assessment.png"
              width="250"
            >
            <h3>Perform your Risk Assessment Here</h3>
            <span
              align="center"
            >
              <p>Use the Risk Library Navigation to perform your assessment </p>
            </span>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>
<script>
import {
  BButton,
} from 'bootstrap-vue'
import Resource from '@/api/resource'
import EditRiskAssessment from './partials/EditRiskAssessment.vue'
import RiskAssessmentTable from './partials/RiskAssessmentTable.vue'

export default {
  components: {
    BButton,
    // CreateRiskAssessment,
    EditRiskAssessment,
    RiskAssessmentTable,
  },
  props: {
    module: {
      type: String,
      default: () => ('all'), // this is the general risk assessment
    },
    viewOnly: {
      type: String,
      default: () => 'all',
    },
  },
  data() {
    return {
      showMenu: true,
      asset_types: [],
      business_units: [],
      selectedData: null,
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      isCreateNew: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      risk_assessments: [],
      loadView: false,
      viewType: 'welcome',
      response: {},
      activatedModules: [],
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    },
  },
  watch: {
    selectedClient() {
      this.viewType = 'welcome'
      this.setMatrix()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    if (this.selectedClient.id !== null) {
      this.setMatrix()
    } else {
      this.$alert('Please select a client to continue')
    }
  },
  methods: {
    toggleMenu() {
      const app = this
      app.showMenu = !app.showMenu
    },
    setMatrix() {
      this.setModuleSlug()
      this.fetchImpacts()
      this.fetchLikelihoods()
      this.fetchAllRiskAssessments(true)
    },
    setModuleSlug() {
      const app = this
      const moduleSlug = []
      app.clientActivatedProjects.forEach(project => {
        if (project.available_module) {
          moduleSlug.push(project.available_module.slug)
        }
      })
      app.activatedModules = moduleSlug
    },
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.label.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_dpias.splice(this.sub_dpias.indexOf(tag), 1)
    },
    viewDetails(data) {
      if (data.id) {
        const app = this
        app.selectedData = data
        app.viewType = 'edit'
        app.showMenu = false
      }
    },
    fetchAllRiskAssessments(load) {
      const app = this
      app.loading = load
      const fetchCriteriaResource = new Resource('risk-assessment/fetch-risk-assessments')
      fetchCriteriaResource.list({ client_id: app.selectedClient.id, module: app.module })
        .then(response => {
          app.business_units = response.business_units
          app.asset_types = response.asset_types
          app.risk_assessments = response.risk_assessments
          app.risk_appetite = response.risk_appetite
          app.loading = false
        }).catch(() => { app.loading = false })
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
          console.log(error.response)
          // app.$message.error(error.response.data.error)
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
          console.log(error.response)
          // app.$message.error(error.response.data.error)
        })
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchAllRiskAssessments(false)
      this.$notify({ title: 'Entry Saved', type: 'success' })
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
