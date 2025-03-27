<template>
  <div>
    <div
      style="cursor:pointer;margin-bottom: 5px; text-align: center"
    >

      <el-select
        v-model="selectedVendor"
        filterable
        value-key="id"
        placeholder="Select Vendor"
      >
        <el-option
          v-for="(vendor, index) in vendors"
          :key="index"
          :value="vendor"
          :label="vendor.name"
        />
      </el-select>&nbsp;
      <el-button
        type="primary"
        plain
        @click="loadResources()"
      >
        <feather-icon
          icon="RefreshCwIcon"
          class="ml-50"
        /> Refresh
      </el-button>
    </div>
    <div v-if="selectedVendor !== null">
      <el-row :gutter="15">
        <el-col :md="24">
          <OverallRiskRating
            v-if="showChart"
            :selected-vendor="selectedVendor"
          />
        </el-col>
      </el-row>
      <b-row class="match-height">
        <b-col :md="8">
          <RAReport
            v-if="showChart"
            :selected-vendor="selectedVendor"
          />
        </b-col>
        <b-col :md="4">
          <RiskRankingMatrix :matrix="(selectedClient.matrix) ? selectedClient.matrix.current_matrix : '3x3'" />
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <h3 align="center">
        <img
          src="images/no-chart.png"
          width="150"
        >
        <p>Please select a Vendor to continue</p>
      </h3>
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import RAReport from './charts/RAReport.vue'
import RiskRankingMatrix from '@/views/modules/RiskAndThreats/partials/RiskRankingMatrix.vue'
import OverallRiskRating from './charts/OverallRiskRating.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    RAReport,
    RiskRankingMatrix,
    OverallRiskRating,
  },
  data() {
    return {
      showChart: true,
      loading: false,
      vendors: [],
      selectedVendor: null,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    fetchDashboardVendors() {
      const app = this
      // const { limit, page } = this.query
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list({ all: true })
        .then(response => {
          app.vendors = response.vendors
          app.loading = false
        })
    },
    loadResources() {
      const app = this
      app.showChart = false
      setTimeout(() => {
        app.showChart = true
      }, 100)
      app.fetchDashboardVendors()
    },
  },
}
</script>
