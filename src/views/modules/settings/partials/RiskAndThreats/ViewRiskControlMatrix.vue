<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span class="pull-right">
          <el-button type="secondary" @click="viewType = 'tabular'"
            ><icon icon="tabler:table" /> Tabular View</el-button
          >
        </span>
        <h3>Risk and Control Matrix</h3>
      </div>
    </template>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside v-if="showMenu" v-loading="loading" style="width: 350px; background-color: #fcfcfc">
        <div style="background: #cccccc; color: #000000; padding: 10px; border-radius: 5px 5px 0 0">
          Grouped by Assets
          <el-tooltip
            class="item"
            effect="dark"
            content="Create New Asset Risk Library"
            placement="right"
          >
            <el-button
              type="default"
              size="small"
              class="pull-right"
              @click="createNewRiskRegister('isms')"
            >
              <icon icon="tabler:plus" />
            </el-button>
          </el-tooltip>
        </div>
        <el-menu style="max-height: 250px; overflow: auto">
          <el-sub-menu
            v-for="(asset_type, index) in asset_types"
            :key="index"
            :index="index"
            :value="asset_type.name"
          >
            <template #title>
              <strong>{{ asset_type.name }}</strong>
            </template>

            <el-sub-menu
              v-for="(asset, asset_index) in asset_type.assets"
              :key="asset_index"
              :index="`${index}-${asset_index}`"
            >
              <template #title>
                <span>{{ asset.name }}</span>
              </template>
              <el-menu-item
                v-for="(risk_register, ra_index) in asset.risk_registers"
                :key="ra_index"
                :index="`${index}-${asset_index}-${ra_index}`"
                :title="`${risk_register.risk_id}- ${risk_register.threat}`"
                :value="title"
                @click="viewDetails(risk_register)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="risk_register.threat"
                  placement="right"
                  :open-delay="500"
                >
                  <div>
                    {{ risk_register.risk_id }}
                  </div>
                </el-tooltip>
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
        <div style="background: #cccccc; color: #000000; padding: 10px; border-radius: 5px 5px 0 0">
          <small>Grouped by Business Unit/Process</small>
          <el-tooltip
            class="item"
            effect="dark"
            content="Create New Risk Library"
            placement="right"
          >
            <el-button
              v-if="viewOnly === 'rcsa' || viewOnly === 'bcms' || viewOnly === 'all'"
              variant="secondary"
              size="small"
              class="pull-right"
              @click="createNewRiskRegister(module)"
            >
              <icon icon="tabler:plus" />
            </el-button>
          </el-tooltip>
        </div>
        <el-menu
          style="max-height: 250px; overflow: auto"
          v-if="
            (viewOnly !== 'isms' || viewOnly === 'all') &&
            (activatedModules.includes('rcsa') ||
              activatedModules.includes('bcms') ||
              activatedModules.includes('ndpa'))
          "
        >
          <el-sub-menu
            v-for="(business_unit, index) in business_units"
            :key="index"
            :index="`${index}`"
          >
            <template v-slot:title>
              <strong>{{ business_unit.unit_name }}</strong>
            </template>

            <el-sub-menu
              v-for="(business_process, business_process_index) in business_unit.business_processes"
              :key="business_process_index"
              :index="`${index}-${business_process_index}`"
            >
              <template v-slot:title>
                <small style="padding-left: 5px !important"
                  >{{ business_process.generated_process_id }} {{ business_process.name }}</small
                >
              </template>
              <el-menu-item
                v-for="(risk_register, ra_index) in business_process.risk_registers"
                :key="ra_index"
                :index="`${index}-${business_process_index}-${ra_index}`"
                @click="viewDetails(risk_register)"
              >
                <div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="risk_register.vulnerability_description"
                    placement="right"
                    :open-delay="500"
                  >
                    <small style="padding-left: 13px !important"
                      >{{ risk_register.risk_id }}-{{
                        risk_register.asset_name ? risk_register.asset_name : risk_register.threat
                      }}</small
                    >
                  </el-tooltip>
                </div>
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
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
              <div v-if="module !== 'isms'">
                <label>Select Business Unit</label>
                <el-select
                  v-model="form.business_unit_id"
                  placeholder="Select Business Unit"
                  style="width: 100%"
                  filterable
                  @input="fetchRisks()"
                >
                  <el-option
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :value="business_unit.id"
                    :label="business_unit.unit_name"
                  />
                </el-select>
                <p></p>
                <create-r-c-m
                  v-if="form.business_unit_id !== null"
                  :client-id="selectedClient.id"
                  :business-unit-id="form.business_unit_id"
                  :module="module"
                  @submitted="loadData"
                />
              </div>
              <create-r-c-m
                v-else
                :client-id="selectedClient.id"
                :business-unit-id="form.business_unit_id"
                :module="module"
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
import CreateRCM from './partials/CreateRiskControlMatrix.vue'
import TabularRCM from './partials/TabularRiskControlMatrix.vue'
import EditRCM from './partials/EditRiskControlMatrix.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    CreateRCM,
    EditRCM,
    TabularRCM
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
      activatedModules: []
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
    createNewRiskRegister(module) {
      // eslint-disable-next-line vue/no-mutating-props
      this.module = module
      this.form.business_unit_id = null
      if (this.module === 'isms') {
        this.form.business_unit_id = 0
        this.fetchRisks()
      }
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
    fetchAssetTypes() {
      this.loading = true
      const param = { client_id: this.selectedClient.id }
      const fetchAssetResource = new Resource(
        'risk-assessment/fetch-asset-types-with-risk-registers'
      )
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
