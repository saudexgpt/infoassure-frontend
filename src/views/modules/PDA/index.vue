<template>
  <el-card
    v-loading="loading"
  >
    <div v-if="display === 'details'">
      <span>
        <el-button
          type="success"
          size="mini"
          @click="display='create'"
        >
          Create New
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="downloading"
          @click="display='summary'"
        >
          View Summary Sheet
        </el-button>
      </span>
      <p />
      <app-collapse
        accordion
        type="border"
      >
        <app-collapse-item
          v-for="(pda, index) in pdas"
          :key="index"
          :title="`${pda.business_unit} - ${pda.business_process}`"
        >

          <edit-p-d-a
            :selected-data="pda"
            :countries="countries"
            @updated="$notify({ title: 'Data Updated'}); fetchPDA()"
          />
        </app-collapse-item>
      </app-collapse>
    </div>
    <div v-if="display=== 'summary'">
      <span>
        <el-button
          type="danger"
          size="mini"
          @click="display='details'"
        >
          View Details
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="downloading"
          @click="exportToExcel('RoPASheet')"
        >
          Export
        </el-button>
      </span>
      <p />
      <p-d-a-table
        id="PDASheet"
        :table-data="pdas"
      />
    </div>
    <div
      v-if="display==='create'"
    >
      <el-button
        type="danger"
        size="mini"
        @click="display='details'"
      >
        Close Form
      </el-button>
      <h3>Personal Data Analysis Form</h3>
      <create-p-d-a
        :client-id="selectedClient.id"
        :standard-id="standardId"
        :countries="countries"
      />
    </div>
  </el-card>
</template>
<script>
import {
} from 'bootstrap-vue'
import TableToExcel from '@linways/table-to-excel'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import CreatePDA from './partials/CreatePDA.vue'
import EditPDA from './partials/EditPDA.vue'
import PDATable from './PDATable.vue'
import Resource from '@/api/resource'

export default {
  components: {
    AppCollapse,
    AppCollapseItem,
    CreatePDA,
    EditPDA,
    PDATable,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true,
    },
    standardId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      display: 'details',
      pdas: [],
      countries: [],
      loading: false,
      downloading: false,
    }
  },
  created() {
    this.fetchPDA()
    this.fetchCountries()
  },
  methods: {
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
      const clientId = app.selectedClient.id
      const pdaResource = new Resource('pda')
      pdaResource.list({
        client_id: clientId,
        // , standard_id: app.standardId,
      })
        .then(response => {
          app.pdas = response.pdas
          app.loading = false
        })
    },
    exportToExcel(id) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'PDA-Sheet.xlsx',
          sheet: {
            name: 'Personal Data Analysis',
          },
        })
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 5000)
    },
    // exportToExcel(id1, id2) {
    //   const app = this
    //   app.downloading = true
    //   setTimeout(() => {
    //     const table1 = document.getElementById(id1)
    //     const table2 = document.getElementById(id2)
    //     const book = TableToExcel.tableToBook(table1, { sheet: { name: 'Personal Data Analysis Form' } })
    //     TableToExcel.tableToSheet(book, table2, { sheet: { name: 'Overall Process Control Rating' } })
    //     TableToExcel.save(book, 'RCSA-Report.xlsx')
    //   }, 1000)

    //   setTimeout(() => {
    //     app.downloading = false
    //   }, 30000)
    // },
  },
}
</script>
