<template>
  <div>
    <aside>
      <el-row :gutter="10">
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
            @input="fetchRisks()"
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
      <el-container style="height: 100%; border: 1px solid #eee">
        <el-aside
          width="250px"
          style="background-color: #fcfcfc;"
        >
          <div style="text-align: center; background-color: #000000; color: #ffffff; border-top-left-radius: 5px; border-top-right-radius: 5px;">
            <span>Risk IDs</span>
          </div>
          <aside>
            <el-input
              v-model="filterText"
              placeholder="Filter keyword"
            />
          </aside>
          <el-tree
            ref="tree"
            class="filter-tree"
            :highlight-current="true"
            :accordion="true"
            :data="risk_registers"
            :props="{label: 'risk_id'}"
            :filter-node-method="filterNode"
            @node-click="viewDetails"
          />
          <!-- <el-menu
        background-color="#fcfcfc"
        text-color="#00000"
      >
        <el-menu-item
          v-for="(category, index) in categories"
          :key="index"
          :index="index"
          @click="viewDetails(category)"
        >
          <span slot="title">{{ category.name }}</span>
        </el-menu-item>
      </el-menu> -->
        </el-aside>

        <el-container
          v-loading="loading"
        >
          <el-header
            style="text-align: right; font-size: 12px; padding: 10px"
          >
            <el-button
              type="info"
              plain
              size="mini"
              @click="viewType='tabular'"
            >
              Tabular View
            </el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="viewType = 'create'"
            >
              Create New
            </el-button>
          </el-header>

          <el-main>
            <div>
              <tabular-r-c-m
                v-if="viewType === 'tabular'"
                :client-id="clientId"
                :assessment-module="assessmentModule"
                :business-unit-id="form.business_unit_id"
              />
              <edit-r-c-m
                v-if="viewType === 'edit'"
                :client-id="clientId"
                :business-unit-id="form.business_unit_id"
                :selected-risk-register="selectedRiskRegister"
                @done="viewType = 'tabular'"
              />
              <create-r-c-m
                v-if="viewType === 'create'"
                :client-id="clientId"
                :business-unit-id="form.business_unit_id"
              />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
// import {
//   BButton,
// } from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import TableToExcel from '@linways/table-to-excel'
import Ripple from 'vue-ripple-directive'
import CreateRCM from './partials/CreateRiskControlMatrix.vue'
import TabularRCM from './partials/TabularRiskControlMatrix.vue'
import EditRCM from './partials/EditRiskControlMatrix.vue'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
    CreateRCM,
    EditRCM,
    TabularRCM,
  },
  directives: {
    Ripple,
  },
  props: {
    clientId: {
      type: Number,
      default: null,
    },
    assessmentModule: {
      type: String,
      default: () => { 'ra' },
    },
  },
  data() {
    return {
      viewType: 'tabular',
      loading: false,
      downloading: false,
      control_frequencies: ['Per Transaction', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Biannually', 'Annually', 'N/A', 'Per Merchant', 'Per Terminal Request'],
      risk_types: [],
      risk_registers: [],
      selectedRiskRegister: null,
      clients: [],
      business_units: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      form: {
        client_id: '',
        business_unit_id: '',
      },
      selectedRisk: null,
      filterText: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.form.client_id = this.clientId
    this.fetchRiskCategories()
    this.fetchBusinessUnits()
  },
  methods: {
    checkPermission,
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.risk_id.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    viewDetails(riskRegister) {
      // if (riskRegister.id) {
      const app = this
      app.viewType = ''
      setTimeout(() => {
        app.selectedRiskRegister = riskRegister
        app.viewType = 'edit'
      }, 100)

      // }
    },
    fetchRiskCategories() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      fetchEntryResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.risk_types = response.categories
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
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
    fetchRisks() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource.list({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.risk_registers = response.risk_registers
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    exportToExcel(id) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'RCM-Report.xlsx',
          sheet: {
            name: 'Sheet 1',
          },
        })
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
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
