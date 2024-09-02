<template>
  <el-card>
    <div slot="header">
      <span
        class="pull-right"
      >
        <b-button
          variant="primary"
          @click="viewType='tabular'; showMenu = false"
        ><i class="el-icon-menu" /> Tabular View</b-button>
      </span>
      <h3>Business Impact Analysis</h3>
    </div>
    <el-container style="height: 100%; border: 1px solid #eee; background: #fff;">
      <el-aside
        v-if="showMenu"
        v-loading="loading"
        element-loading-text="loading assessment, please wait..."
        width="400px"
      >
        <div>
          <el-menu>
            <el-submenu
              v-for="(assessments, business_unit) in business_impact_analyses"
              :key="business_unit"
              :index="`${business_unit}`"
            >
              <template slot="title">
                <strong>{{ business_unit }}</strong>
              </template>

              <el-menu-item
                v-for="(assessment, assessment_index) in assessments"
                :key="assessment_index"
                :index="`${business_unit}-${assessment_index}`"
                @click="viewDetails(assessment)"
              >
                <small><strong>{{ assessment.business_process }}</strong></small>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>

      <el-container>
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

        <el-main v-loading="loadView">
          <div v-if="viewType === 'edit'">
            <edit-analysis
              :impacts="impacts"
              :selected-data="selectedData"
              @updated="renderViewAgain"
            />
          </div>
          <div v-if="viewType === 'tabular'">
            <analysis-table />
          </div>
          <div
            v-if="viewType === 'welcome'"
            align="center"
          >
            <img
              src="/images/project-icons/bia-large.png"
              width="200"
            >
            <h3>Manage your BIA here</h3>
            <span
              align="center"
            >
              <p>Use the Left Navigation to perform your analysis </p>
            </span>
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
import EditAnalysis from './EditAnalysis.vue'
import AnalysisTable from './AnalysisTable.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    EditAnalysis,
    AnalysisTable,
  },
  data() {
    return {
      viewType: 'welcome',
      showMenu: true,
      business_impact_analyses: [],
      impacts: [],
      selectedData: [],
      loading: false,
      loadView: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    },
  },
  watch: {
    selectedClient() {
      this.fetchBIA()
      this.fetchImpacts()
    },
  },
  created() {
    this.fetchBIA()
    this.fetchImpacts()
  },
  methods: {
    fetchImpacts() {
      const app = this
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list(param)
        .then(response => {
          app.impacts = response.impacts
        })
        .catch(error => {
          app.loading = false
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    toggleMenu() {
      const app = this
      app.showMenu = !app.showMenu
    },
    viewDetails(data) {
      const app = this
      app.selectedData = data
      app.viewType = 'edit'
      app.showMenu = false
    },
    fetchBIA() {
      const app = this
      app.loading = true
      const fetchBIAResource = new Resource('bia/fetch-bia')
      fetchBIAResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.loading = false
          app.business_impact_analyses = response.business_impact_analyses
        }).catch(() => {
          app.loading = false
        })
    },
    renderViewAgain() {
      this.fetchBIA()
      this.$notify({ title: 'Entry Updated', type: 'success' })
    },
  },
}
</script>
