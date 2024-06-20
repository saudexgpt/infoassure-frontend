<template>
  <el-card>
    <h4>Risk Control Self Assessment</h4>
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.client_id"
            placeholder="Select Client"
            style="width: 100%;"
            filterable
            @input="fetchBusinessUnits()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client.id"
              :label="client.name"
            />
          </el-select>
        </el-col>
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
            @input="createRCSA()"
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
    <el-container
      v-if="form.business_unit_id !== ''"
      style="height: 100%; border: 1px solid #eee; background: #fff;"
    >
      <el-aside
        width="300px"
        style="background-color: #ffffff;"
      >
        <div style="text-align: center; background-color: #333333; color: #ffffff; border-top-left-radius: 5px; border-top-right-radius: 5px;">
          <span>RCSA By Category</span>
        </div>
        <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside>
        <el-tree
          ref="tree"
          v-loading="loading"
          style="overflow: auto;"
          class="filter-tree"
          :highlight-current="true"
          :accordion="true"
          :indent="1"
          :data="rcsa_data"
          :filter-node-method="filterNode"
          @node-click="viewDetails"
        />
      </el-aside>

      <el-container>

        <el-main>
          <div v-if="isEdit">
            <edit-r-c-s-a-entry
              :selected-data="selectedData"
              @updated="renderViewAgain"
            />
          </div>
          <div v-else>
            <h4>Click on the menu for an assessment</h4>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <b-modal
      v-model="showNewCategoryForm"
      title="Create New Category"
      centered
      size="md"
      hide-footer
    >
      <create-r-c-s-a-category
        :client-id="form.client_id"
        :business-unit-id="form.business_unit_id"
        @save="fetchRCSA(); showNewCategoryForm = false"
      />
    </b-modal>
  </el-card>
</template>

<script>
// import {
//   BButton,
// } from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import TableToExcel from '@linways/table-to-excel'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateRCSACategory from './partials/CreateRCSACategory.vue'
import EditRCSAEntry from './partials/EditRCSAEntry.vue'

export default {
  components: {
    CreateRCSACategory,
    EditRCSAEntry,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      downloading: false,
      control_assessments: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'N/A'],
      rcsa_data: [],
      category_details: [],
      total_scores: '',
      clients: [],
      business_units: [],
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false,
      selectedData: null,
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
      },
      selectedRisk: null,
      showNewCategoryForm: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.name.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    viewDetails(data) {
      if (data.id) {
        const app = this
        app.isEdit = false
        setTimeout(() => {
          app.selectedData = data
          app.isEdit = true
        }, 10)
      }
    },
    fetchClients() {
      const app = this
      const fetchCriteriaResource = new Resource('clients')
      fetchCriteriaResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.form.client_id = app.clients[0].id
            app.fetchBusinessUnits()
          }
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
    createRCSA() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('rcsa/create-rcsa-from-rcm')
      fetchRisksResource.store({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.rcsa_data = response.rcsa_data
          app.total_scores = response.total_scores
          app.category_details = response.category_details
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchRCSA() {
      const app = this
      app.loading = true
      app.rcsa_data = []
      const fetchRisksResource = new Resource('rcsa/fetch')
      fetchRisksResource.get({ client_id: app.form.client_id, business_unit_id: app.form.business_unit_id })
        .then(response => {
          app.rcsa_data = response.rcsa_data
          app.total_scores = response.total_scores
          app.category_details = response.category_details
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    renderViewAgain() {
      this.createRCSA()
      this.$notify({ title: 'Entry Updated', type: 'success' })
    },
    exportToExcel(id1, id2) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        const table1 = document.getElementById(id1)
        const table2 = document.getElementById(id2)
        const book = TableToExcel.tableToBook(table1, { sheet: { name: 'Risk Control Self Assessment' } })
        TableToExcel.tableToSheet(book, table2, { sheet: { name: 'Overall Process Control Rating' } })
        TableToExcel.save(book, 'RCSA-Report.xlsx')
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
    // exportToExcel(id) {
    //   const app = this
    //   app.downloading = true
    //   setTimeout(() => {
    //     TableToExcel.convert(document.getElementById(id), {
    //       name: 'RCSA-Report.xlsx',
    //       sheet: {
    //         name: 'Sheet 1',
    //       },
    //     })
    //   }, 1000)

    //   setTimeout(() => {
    //     app.downloading = false
    //   }, 30000)
    // },
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
