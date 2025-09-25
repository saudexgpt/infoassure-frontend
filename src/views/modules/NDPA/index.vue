<template>
  <div>
    <!-- <h4>Welcome to the NDPA Module</h4> -->
    <el-tabs v-model="activeName" type="border-card" @tab-click="forceRerender" stretch>
      <el-tab-pane lazy label="Overview" name="#overview">
        <NDPADashboard />
      </el-tab-pane>
      <el-tab-pane label="The NDPA Journey" name="#ndpa-journey" lazy>
        <NDPAJourney />
      </el-tab-pane>
      <!-- <el-tab-pane lazy label="Compliance Assessment" name="#compliance">
        <GapAssessment
          :selected-client="selectedClient"
          :selected-project="selectedProject"
          :is-admin="isAdmin"
        />
      </el-tab-pane> -->
      <el-tab-pane lazy label="Business Unit Setup" name="#business_unit">
        <BusinessUnit />
      </el-tab-pane>
      <el-tab-pane lazy label="Risk Library" name="#risk_library">
        <RiskLibrary module="ndpa" view-only="ndpa" />
      </el-tab-pane>
      <el-tab-pane lazy label="PDA" name="#pda">
        <PDA :selected-client="selectedClient" />
      </el-tab-pane>
      <el-tab-pane lazy label="RoPA" name="#ropa">
        <RoPA :selected-client="selectedClient" />
      </el-tab-pane>
      <el-tab-pane lazy label="DPIA" name="#dpia">
        <ConsolidatedRA v-if="activeName === '#dpia'" module="ndpa" view-only="ndpa" />
      </el-tab-pane>
      <!-- <el-tab-pane lazy
      label="Reports"
      name="third"
    >
      <n-d-p-a-report />
    </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
// import NDPAManage from '@/views/modules/NDPA/Manage.vue'
import BusinessUnit from '@/views/modules/settings/partials/business-units/SetUp.vue'
// import GapAssessment from './partials/GapAssessment.vue'
import RiskLibrary from '@/views/modules/settings/partials/RiskAndThreats/ViewRiskControlMatrix.vue'
import ConsolidatedRA from '@/views/modules/risk-assessment/index.vue'

// import DPIA from './DPIA/index.vue'
import RoPA from './RoPA/index.vue'
import PDA from './PDA/index.vue'
import NDPAJourney from './NDPAJourney.vue'
// import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    NDPADashboard,
    NDPAJourney,
    PDA,
    RoPA,
    // NDPAManage,
    BusinessUnit,
    // GapAssessment,
    RiskLibrary,
    // DPIA
    ConsolidatedRA
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#overview',
      isAdmin: this.$store.getters.isAdmin,
      moduleIsActive: false,
      projects: [],
      selectedProject: null
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
    clientActivatedProjects() {
      this.checkIfProjectIsActive()
    },
    selectedClient() {
      this.checkIfProjectIsActive()
    }
  },
  mounted() {
    this.setCurrentPage()
    if (this.selectedClient.id !== null) {
      this.checkIfProjectIsActive()
    }
  },
  methods: {
    checkIfProjectIsActive() {
      const projects = this.clientActivatedProjects.filter(
        (project) => project.available_module.slug === 'ndpa'
      )
      this.moduleIsActive = false
      if (projects.length > 0) {
        this.moduleIsActive = true
        this.projects = projects

        this.selectedProject = projects[0]
      }
    },
    forceRerender(tab, event) {
      // console.log(event.target.id)
      let hashString = event.target.id
      hashString = hashString.replace('tab-', '')
      // this.activeName = value
      this.$router.push({ hash: `${hashString}` })
      this.keyValue += 1
    },
    setCurrentPage() {
      this.activeName = window.location.hash !== '' ? window.location.hash : '#overview'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
