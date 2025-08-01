<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span class="pull-right">
          <el-button type="primary" @click="viewType = 'tabular'"
            ><i class="el-icon-menu"></i> Tabular View</el-button
          >
        </span>
        <h3>Personal Data Asset</h3>
      </div>
    </template>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside v-if="showMenu" v-loading="loading" width="400px" style="background-color: #fcfcfc">
        <el-menu background-color="#fcfcfc" text-color="#00000">
          <div style="background: #d2a204; color: #000000; padding: 10px">
            Grouped by Business Unit/Process
            <el-tooltip class="item" effect="dark" content="Create New Entry" placement="right">
              <el-button variant="secondary" size="sm" class="pull-right" @click="createNewEntry()">
                <i class="el-icon-plus"></i>
              </el-button>
            </el-tooltip>
          </div>
          <el-submenu v-for="(pda_data, index) in grouped_pdas" :key="index" :index="`${index}`">
            <template v-slot:title>
              <strong>{{ index }}</strong>
            </template>
            <el-menu-item
              v-for="(data, data_index) in pda_data"
              :key="data_index"
              :index="`${index}-${data_index}`"
              @click="viewDetails(data)"
            >
              <div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="data.description"
                  placement="right"
                  :open-delay="500"
                >
                  <small>{{ data.business_process }}</small>
                </el-tooltip>
              </div>
            </el-menu-item>
          </el-submenu>
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
              <img src="/images/project-icons/risk_library.png" width="200" />
              <h3>Manage your Personal Data Asset Here</h3>
              <span align="center">
                <el-button variant="outline-secondary" @click="createNewEntry()"
                  ><i class="el-icon-plus"></i> Create New Entry</el-button
                >
              </span>
            </div>
            <tabular-p-d-a
              v-if="viewType === 'tabular'"
              :client-id="clientId"
              :table-data="pdas"
              :business-unit-id="form.business_unit_id"
            />
            <edit-p-d-a
              v-if="viewType === 'edit'"
              :selected-data="selectedData"
              :personal-data-items="personal_data_items"
              :countries="countries"
              @updated="($notify({ title: 'Data Updated' }), fetchPDA())"
            />
            <div v-if="viewType === 'create'">
              <create-p-d-a
                :client-id="clientId"
                :countries="countries"
                :personal-data-items="personal_data_items"
                @submitted="fetchPDA"
              />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
import CreatePDA from './partials/CreatePDA.vue'
import EditPDA from './partials/EditPDA.vue'
import TabularPDA from './PDATable.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    CreatePDA,
    EditPDA,
    TabularPDA
  },
  props: {
    riskGroup: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      viewType: 'welcome',
      loading: false,
      loadNew: false,
      downloading: false,
      selectedData: null,
      pdas: [],
      grouped_pdas: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      showMenu: true,
      form: {
        client_id: '',
        business_unit_id: null
      },
      selectedRisk: null,
      filterText: '',
      risk_group: '',
      countries: [],
      personal_data_items: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    clientId() {
      return this.$store.getters.selectedClient.id
    }
  },
  watch: {
    clientId() {
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
    loadData() {
      this.form.client_id = this.clientId
      this.fetchPersonalDataItems()
      this.fetchCountries()
      this.fetchPDA()
    },
    fetchCountries() {
      const countriesResources = new Resource('countries')
      countriesResources
        .list()
        .then((response) => {
          this.countries = response.countries
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchPDA(load = true) {
      this.loading = load
      const pdaResource = new Resource('pda')
      pdaResource
        .list({
          client_id: this.clientId
          // , standard_id: this.standardId,
        })
        .then((response) => {
          this.pdas = response.pdas
          this.grouped_pdas = response.grouped_pdas
          this.loading = false
        })
    },
    fetchPersonalDataItems(load = true) {
      this.loading = load
      const pdiResource = new Resource('pda/fetch-personal-data-item')
      pdiResource.list().then((response) => {
        this.personal_data_items = response.personal_data_items
        this.loading = false
      })
    },
    createNewEntry() {
      this.viewType = 'create'
    },
    viewDetails(data) {
      // if (riskRegister.id) {

      this.selectedData = data
      this.viewType = 'edit'

      // }
    }
  }
}
</script>
