<template>
  <el-card>
    <template v-slot:header>
      <div>
        <!-- <span class="pull-right">
          <el-button type="secondary" @click="viewType = 'tabular'">
            <icon icon="tabler:table" /> Tabular View
          </el-button>
        </span> -->
        <h3>Manage Risk Library & Control Matrix</h3>
      </div>
    </template>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside v-if="showMenu" v-loading="loading" style="width: 350px; background-color: #fcfcfc">
        <el-tabs>
          <el-tab-pane
            v-if="activatedModules.includes('isms') && (viewOnly === 'isms' || viewOnly === 'all')"
            label="By Assets"
          >
            <el-button type="primary" width="100%" @click="createNewRiskRegister('isms')">
              <icon icon="tabler:plus" /> Create New Asset Risk Library
            </el-button>
            <el-collapse expand-icon-position="left" accordion>
              <el-collapse-item
                v-for="(assetsArray, index) in asset_types"
                :key="index"
                :name="`asset_type-${index}`"
              >
                <template #title>
                  <span>
                    <h3>{{ index }}</h3>
                  </span>
                </template>
                <el-collapse expand-icon-position="right" accordion>
                  <el-collapse-item
                    v-for="(asset, asset_index) in assetsArray"
                    :key="asset_index"
                    :name="`asset-${asset_index}`"
                  >
                    <template #title>
                      <span>{{ asset.name }}</span>
                    </template>
                    <div v-if="asset.risk_registers.length > 0">
                      <el-alert type="error" :closable="false">
                        Identified threats for {{ asset.name }}
                      </el-alert>
                      <div
                        v-for="(risk_register, risk_register_index) in asset.risk_registers"
                        :key="risk_register_index"
                      >
                        <CardNavView
                          :id="`risk_register-${index}`"
                          :title="`${risk_register.risk_id}-${risk_register.threat}`"
                          title-icon="tabler:file-text"
                          @clickToView="viewDetails(risk_register)"
                        >
                          <!-- <template #description>
                        <div>
                          <em><icon icon="tabler:arrow-badge-right" /> {{ task.name }}</em>
                          <br />
                          <span v-html="task.description"></span>
                        </div>
                      </template> -->
                        </CardNavView>
                      </div>
                    </div>
                    <div v-else>
                      <el-card style="margin-bottom: 5px">
                        <div style="cursor: pointer">
                          <strong>No Threat Identified Yet!</strong>
                          <el-popconfirm
                            width="550"
                            hide-icon
                            confirm-button-text="Proceed"
                            cancel-button-text="Cancel"
                            :title="`The system will attempt to identify threats associated with ${asset.name}.`"
                            @confirm="loadAutoRiskRegisters(asset.id)"
                          >
                            <template #reference>
                              <el-button type="info" style="width: 100%">
                                <icon icon="tabler:package-import" /> Click to auto identify
                              </el-button>
                            </template>
                          </el-popconfirm>
                        </div>
                      </el-card>
                    </div>
                  </el-collapse-item>
                </el-collapse>
                <!-- <Assets
              :can-change-status="true"
              :assets-array="assetsArray"
              :client-id="storedClient.id"
              @clickToView="viewDetails"
            /> -->
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
            <el-button type="primary" width="100%" @click="createNewRiskRegister('bcms')">
              <icon icon="tabler:plus" /> Create New Process Risk Library
            </el-button>
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
          </el-tab-pane>
        </el-tabs>
      </el-aside>

      <el-container v-loading="loadNew">
        <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-fold"></i
            ></a>
            <a v-else style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-unfold"></i
            ></a>
          </el-tooltip>
        </h1>
        <el-main>
          <div>
            <div v-if="viewType === 'welcome'" align="center">
              <img src="/images/project-icons/risk_library-large.png" width="200" />
              <h3>Manage your Risk Library</h3>
              <span align="center">
                <p>Use the left navigation to perform your tasks </p>
              </span>
            </div>
            <tabular-r-c-m
              v-if="viewType === 'tabular'"
              :client-id="selectedClient.id"
              :assessment-module="module"
            />
            <edit-r-c-m
              v-if="viewType === 'edit'"
              :client-id="selectedClient.id"
              :selected-risk-register="selectedRiskRegister"
              @done="((viewType = 'tabular'), fetchRisks())"
            />
            <div v-if="viewType === 'create'">
              <div v-if="selectedModule !== 'isms'">
                <label>Select Business Unit</label>
                <el-select
                  v-model="form.business_unit_id"
                  placeholder="Select Business Unit"
                  style="width: 100%"
                  filterable
                  @change="fetchRisks()"
                >
                  <el-option
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :value="business_unit.id"
                    :label="business_unit.unit_name"
                  />
                </el-select>
                <p></p>
                <CreateBusinessProcessRiskControlMatrix
                  v-if="form.business_unit_id !== null"
                  :client-id="selectedClient.id"
                  :business-unit-id="form.business_unit_id"
                  @submitted="loadData"
                />
              </div>
              <CreateAssetRiskControlMatrix
                v-else
                :client-id="selectedClient.id"
                @submitted="loadData"
              />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
// import { VueGoodTable } from 'vue-good-table'
import CreateAssetRiskControlMatrix from './partials/CreateAssetRiskControlMatrix.vue'
import CreateBusinessProcessRiskControlMatrix from './partials/CreateBusinessProcessRiskControlMatrix.vue'
import TabularRCM from './partials/TabularRiskControlMatrix.vue'
import EditRCM from './partials/EditRiskControlMatrix.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    CreateAssetRiskControlMatrix,
    CreateBusinessProcessRiskControlMatrix,
    EditRCM,
    TabularRCM,
    CardNavView
  },
  props: {
    module: {
      type: String,
      default: () => 'isms'
    },
    viewOnly: {
      type: String,
      default: () => 'all'
    }
  },
  data() {
    return {
      open: '',
      viewType: 'welcome',
      loading: false,
      loadNew: false,
      downloading: false,
      risk_registers: [],
      grouped_risk_registers: {},
      unsubmitted_risk_registers: {},
      selectedRiskRegister: null,
      clients: [],
      business_units: [],
      showManageProject: false,
      showAssignModal: false,
      showAssignConsultantModal: false,
      showMenu: true,
      form: {
        client_id: '',
        business_unit_id: null
      },
      ndpa_risk_registers: null,
      filterText: '',
      asset_types: [],
      activatedModules: [],
      selectedModule: 'isms'
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    selectedClient() {
      this.loadData()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    checkPermission,
    loadData() {
      this.form.client_id = this.selectedClient.id
      this.setModuleSlug()
      this.fetchBusinessUnits()
      this.fetchAssetTypes()
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
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    filterNode(value) {
      if (!value) return true
      const data = this.grouped_risk_registers
      console.log(data)
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.vulnerability_description.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    createNewRiskRegister(mod) {
      this.selectedModule = mod
      this.viewType = 'create'
    },
    viewDetails(riskRegister) {
      // if (riskRegister.id) {

      this.viewType = ''
      setTimeout(() => {
        this.selectedRiskRegister = riskRegister
        this.viewType = 'edit'
      }, 10)

      // }
    },
    loadAutoRiskRegisters(assetId) {
      this.loading = true
      const param = { client_id: this.selectedClient.id, asset_id: assetId }
      const fetchAssetResource = new Resource('generate-auto-risk-registers')
      fetchAssetResource
        .store(param)
        .then((response) => {
          this.loadData()
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.message)
        })
    },
    fetchAssetTypes() {
      this.loading = true
      const param = { client_id: this.selectedClient.id }
      const fetchAssetResource = new Resource('fetch-asset-risk-registers')
      fetchAssetResource
        .list(param)
        .then((response) => {
          this.asset_types = response.asset_types
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchBusinessUnits() {
      this.form.business_unit_id = ''
      const fetchCriteriaResource = new Resource('fetch-business-units-with-risk-registers')
      fetchCriteriaResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.business_units = response.business_units
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchRisks() {
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource
        .list({ client_id: this.form.client_id, business_unit_id: this.form.business_unit_id })
        .then((response) => {
          this.risk_registers = response.risk_registers
          this.grouped_risk_registers = response.grouped_risk_registers
          this.unsubmitted_risk_registers = response.unsubmitted_risk_registers
          this.loadNew = false
        })
        .catch(() => {
          this.loadNew = false
        })
    },
    exportToExcel(id) {
      this.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'RCM-Report.xlsx',
          sheet: {
            name: 'Sheet 1'
          }
        })
      }, 1000)

      setTimeout(() => {
        this.downloading = false
      }, 30000)
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('risk-assessment/destroy')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchRisks()
          this.loading = false
        })
      }
    }
  }
}
</script>
