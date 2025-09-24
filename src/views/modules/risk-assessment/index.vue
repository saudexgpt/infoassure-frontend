<!-- eslint-disable vue/html-indent -->
<template>
  <el-tabs type="border-card">
    <el-tab-pane v-if="checkRole(['admin'])" label="Setup" lazy>
      <RiskSetup :module="module" />
    </el-tab-pane>
    <el-tab-pane label="Risk Assessment" lazy>
      <div>
        <!-- <div>
          <h3>&nbsp;</h3>
          <span class="pull-right">
            <el-button type="primary" @click="viewType = 'tabular'"
              ><icon icon="tabler:table" />&nbsp;Summary</el-button
            >
          </span>
        </div> -->
        <el-container style="height: 100%">
          <el-aside
            v-loading="loading"
            element-loading-text="loading assessment, please wait..."
            width="350px"
            style="width: 350px; background-color: #fcfcfc"
          >
            <!-- <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside> -->
            <h4>Identified Risks</h4>
            <el-button type="primary" @click="viewType = 'tabular'"
              ><icon icon="tabler:table" />&nbsp;Summary</el-button
            >
            <el-tabs stretch>
              <el-tab-pane
                v-if="
                  activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')
                "
                label="By Assets"
              >
                <div style="max-height: 500px; overflow: auto">
                  <el-collapse>
                    <el-collapse-item
                      v-for="(assetsArray, index) in asset_types"
                      :key="index"
                      :name="`${index}`"
                    >
                      <template #title>
                        <strong>{{ index }}</strong>
                      </template>
                      <el-collapse expand-icon-position="left" accordion>
                        <el-collapse-item
                          v-for="(assessments, asset_index) in assetsArray"
                          :key="asset_index"
                          :name="`asset-${asset_index}`"
                        >
                          <template #title>
                            <span>{{ asset_index }}</span>
                          </template>
                          <div
                            v-for="(risk_assessment, assessments_index) in assessments"
                            :key="assessments_index"
                          >
                            <CardNavView
                              :id="`asset-${risk_assessment.id}`"
                              :title="`${risk_assessment.risk_id}`"
                              @clickToView="viewDetails(risk_assessment)"
                            >
                              <template #description>
                                <div>
                                  <em>
                                    <icon icon="tabler:arrow-badge-right" />
                                    {{ risk_assessment.threat }}
                                  </em>
                                  <!-- <em><strong>Vulnerabilities:</strong></em
                                  ><br />
                                  <span v-html="risk_assessment.vulnerability_description"></span> -->
                                </div>
                              </template>
                            </CardNavView>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </el-collapse-item>
                  </el-collapse>
                </div>
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
                <div style="max-height: 500px; overflow: auto">
                  <el-collapse>
                    <el-collapse-item
                      v-for="(assessments, index) in business_units"
                      :key="index"
                      :name="`${index}`"
                    >
                      <template #title>
                        <strong>{{ index }}</strong>
                      </template>
                      <div
                        v-for="(risk_assessment, assessments_index) in assessments"
                        :key="assessments_index"
                      >
                        <CardNavView
                          :id="`process-${index}-${assessments_index}`"
                          :title="`${risk_assessment.risk_id}-${risk_assessment.threat}`"
                          @clickToView="viewDetails(risk_assessment)"
                        >
                          <template #description>
                            <div>
                              <em><strong>Vulnerabilities:</strong></em
                              ><br />
                              <span v-html="risk_assessment.vulnerability_description"></span>
                            </div>
                          </template>
                        </CardNavView>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
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
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Resource from '@/api/resource'
import EditRiskAssessment from './partials/EditRiskAssessment.vue'
import RiskAssessmentTable from './partials/RiskAssessmentTable.vue'
import RiskSetup from '@/views/modules/settings/partials/RiskAndThreats/index.vue'
import checkRole from '@/utils/role'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    EditRiskAssessment,
    RiskAssessmentTable,
    RiskSetup,
    CardNavView
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
    setTimeout(() => {
      this.setMatrix()
    }, 1000)
    // if (this.selectedClient.id !== null) {
    //   this.setMatrix()
    // } else {
    //   this.$alert('Please select a client to continue')
    // }
  },
  methods: {
    checkRole,
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
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
        }, 10)
      }
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
          // console.log(error.response)
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
