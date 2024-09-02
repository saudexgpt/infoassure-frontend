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
      <h3>Personal Data Asset</h3>
    </div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside
        v-if="showMenu"
        v-loading="loading"
        width="400px"
        style="background-color: #fcfcfc;"
      >
        <el-menu
          background-color="#fcfcfc"
          text-color="#00000"
        >
          <div style="background: #d2a204; color: #000000; padding: 10px;">
            Grouped by Business Unit/Process
            <el-tooltip
              class="item"
              effect="dark"
              content="Create New Entry"
              placement="right"
            >
              <b-button
                variant="secondary"
                size="sm"
                class="pull-right"
                @click="createNewEntry()"
              >
                <i class="el-icon-plus" />
              </b-button>
            </el-tooltip>
          </div>
          <el-submenu
            v-for="(pda_data, index) in grouped_pdas"
            :key="index"
            :index="`${index}`"
          >
            <template slot="title">
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
        <el-main>
          <div>
            <div
              v-if="viewType === 'welcome'"
              align="center"
            >
              <img
                src="/images/project-icons/risk_library.png"
                width="200"
              >
              <h3>Manage your Personal Data Asset Here</h3>
              <span
                align="center"
              >
                <b-button
                  variant="outline-secondary"
                  @click="createNewEntry()"
                ><i class="el-icon-plus" /> Create New Entry</b-button>
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
              @updated="$notify({ title: 'Data Updated'}); fetchPDA()"
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
import {
  BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import CreatePDA from './partials/CreatePDA.vue'
import EditPDA from './partials/EditPDA.vue'
import TabularPDA from './PDATable.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BButton,
    CreatePDA,
    EditPDA,
    TabularPDA,
  },
  directives: {
    Ripple,
  },
  props: {
    riskGroup: {
      type: String,
      default: () => null,
    },
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
        business_unit_id: null,
      },
      selectedRisk: null,
      filterText: '',
      risk_group: '',
      countries: [],
      personal_data_items: [],
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    clientId() {
      return this.$store.getters.selectedClient.id
    },
  },
  watch: {
    clientId() {
      this.loadData()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    checkPermission,
    toggleMenu() {
      const app = this
      app.showMenu = !app.showMenu
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
      const app = this
      app.form.client_id = app.clientId
      app.fetchPersonalDataItems()
      app.fetchCountries()
      app.fetchPDA()
    },
    fetchCountries() {
      const app = this
      const countriesResources = new Resource('countries')
      countriesResources.list()
        .then(response => {
          app.countries = response.countries
        }).catch(() => { app.loading = false })
    },
    fetchPDA(load = true) {
      const app = this
      app.loading = load
      const pdaResource = new Resource('pda')
      pdaResource.list({
        client_id: app.clientId,
        // , standard_id: app.standardId,
      })
        .then(response => {
          app.pdas = response.pdas
          app.grouped_pdas = response.grouped_pdas
          app.loading = false
        })
    },
    fetchPersonalDataItems(load = true) {
      const app = this
      app.loading = load
      const pdiResource = new Resource('pda/fetch-personal-data-item')
      pdiResource.list()
        .then(response => {
          app.personal_data_items = response.personal_data_items
          app.loading = false
        })
    },
    createNewEntry() {
      const app = this
      app.viewType = 'create'
    },
    viewDetails(data) {
      // if (riskRegister.id) {
      const app = this
      app.selectedData = data
      app.viewType = 'edit'

      // }
    },
  },
}
</script>
