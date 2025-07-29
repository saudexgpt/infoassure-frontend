<!-- eslint-disable vue/html-indent -->
<template>
  <el-tabs>
    <el-tab-pane label="Setup" lazy>
      <RiskSetup />
    </el-tab-pane>
    <el-tab-pane label="Assessment" lazy>
      <el-card>
        <template v-slot:header>
          <div>
            <span class="pull-right">
              <el-button type="primary" @click="viewType = 'tabular'"
                ><icon icon="tabler:table" />&nbsp;Summary</el-button
              >
            </span>
            <h3>Risk Assessment</h3>
          </div>
        </template>
        <el-container style="height: 100%">
          <el-aside
            v-loading="loading"
            element-loading-text="loading assessment, please wait..."
            width="350px"
          >
            <!-- <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside> -->
            <h4>Risk Library</h4>
            <el-tabs>
              <el-tab-pane
                v-if="
                  activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')
                "
                label="By Assets"
              >
                <el-collapse>
                  <el-collapse-item
                    v-for="(assessments, index) in asset_types"
                    :key="index"
                    :name="`${index}`"
                  >
                    <template #title>
                      <strong>{{ index }}</strong>
                    </template>
                    <el-card
                      v-for="(risk_assessment, assessments_index) in assessments"
                      :key="assessments_index"
                      :id="`asset-${index}-${assessments_index}`"
                      @click="viewDetails(risk_assessment, `asset-${index}-${assessments_index}`)"
                      style="cursor: pointer; margin-bottom: 5px"
                      shadow="hover"
                    >
                      <strong>{{ risk_assessment.risk_id }} - {{ risk_assessment.threat }}</strong>
                      <div>
                        <em><strong>Vulnerabilities:</strong></em
                        ><br />
                        <span v-html="risk_assessment.vulnerability_description"></span>
                      </div>
                    </el-card>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane
                v-if="
                  (viewOnly !== 'isms' || viewOnly === 'all') &&
                  (activatedModules.includes('rcsa') ||
                    activatedModules.includes('bcms') ||
                    activatedModules.includes('ndpa'))
                "
                label="By Business Process"
              >
                <el-collapse>
                  <el-collapse-item
                    v-for="(assessments, index) in business_units"
                    :key="index"
                    :name="`${index}`"
                  >
                    <template #title>
                      <strong>{{ index }}</strong>
                    </template>
                    <el-card
                      v-for="(risk_assessment, assessments_index) in assessments"
                      :key="assessments_index"
                      :id="`process-${index}-${assessments_index}`"
                      @click="viewDetails(risk_assessment, `process-${index}-${assessments_index}`)"
                      style="cursor: pointer; margin-bottom: 5px"
                      shadow="hover"
                    >
                      <strong>{{ risk_assessment.risk_id }} - {{ risk_assessment.threat }}</strong>
                      <div>
                        <em><strong>Vulnerabilities:</strong></em
                        ><br />
                        <span v-html="risk_assessment.vulnerability_description"></span>
                      </div>
                    </el-card>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
            </el-tabs>
          </el-aside>

          <el-container>
            <!-- <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu">
              <icon icon="tabler:menu-2" />
            </a>
            <a v-else style="cursor: pointer" @click="toggleMenu">
              <icon icon="tabler:menu-2" />
            </a>
          </el-tooltip>
        </h1> -->

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
              <div v-if="viewType === 'welcome'" align="center">
                <img src="/images/project-icons/assessment.png" width="250" />
                <h3>Perform your Risk Assessment Here</h3>
                <span align="center">
                  <p>Use the Risk Library Navigation to perform your assessment </p>
                </span>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Resource from '@/api/resource'
import EditRiskAssessment from './partials/EditRiskAssessment.vue'
import RiskAssessmentTable from './partials/RiskAssessmentTable.vue'
import RiskSetup from '@/views/modules/settings/partials/RiskAndThreats/index.vue'

export default {
  components: {
    EditRiskAssessment,
    RiskAssessmentTable,
    RiskSetup
  },
  props: {
    module: {
      type: String,
      default: () => 'all' // this is the general risk assessment
    },
    viewOnly: {
      type: String,
      default: () => 'all'
    }
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
      activatedModules: []
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    selectedClient() {
      this.viewType = 'welcome'
      this.setMatrix()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    if (this.selectedClient.id !== null) {
      this.setMatrix()
    } else {
      this.$alert('Please select a client to continue')
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    setMatrix() {
      this.setModuleSlug()
      this.fetchImpacts()
      this.fetchLikelihoods()
      this.fetchAllRiskAssessments(true)
    },
    async setModuleSlug() {
      await this.$store.dispatch('navItems/fetchActivatedModules', this.selectedClient)
      const moduleSlug = []
      this.clientActivatedProjects.forEach((project) => {
        if (project.available_module) {
          moduleSlug.push(project.available_module.slug)
        }
      })
      this.activatedModules = moduleSlug
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
    viewDetails(data, viewId) {
      if (data.id) {
        this.selectedData = data
        this.viewType = 'edit'
        this.showMenu = false
        this.changeActiveTabBgColor(viewId)
      }
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('el-card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      if (divs.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.background = '#ffffff'
          divs[i].style.color = '#000000'
        }
      }
      document.getElementById(viewId).style.background = '#000000'
      document.getElementById(viewId).style.color = '#ffffff'
    },
    fetchAllRiskAssessments(load) {
      this.loading = load
      const fetchCriteriaResource = new Resource('risk-assessment/fetch-risk-assessments')
      fetchCriteriaResource
        .list({ client_id: this.selectedClient.id, module: this.module })
        .then((response) => {
          this.business_units = response.business_units
          this.asset_types = response.asset_types
          this.risk_assessments = response.risk_assessments
          this.risk_appetite = response.risk_appetite
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchImpacts() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          console.log(error.response)
          // this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          console.log(error.response)
          // this.$message.error(error.response.data.error)
        })
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchAllRiskAssessments(false)
      this.$notify({ title: 'Entry Saved', type: 'success' })
    }
  }
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
