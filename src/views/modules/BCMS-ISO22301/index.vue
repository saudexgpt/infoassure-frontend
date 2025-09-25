<template>
  <div>
    <h4>Welcome to the BCMS Module</h4>
    <el-tabs v-model="activeName" @tab-click="forceRerender">
      <!-- <el-tab-pane :key="keyValue" label="Overview" name="#dashboard" lazy>
        <dashboard />
      </el-tab-pane> -->
      <el-tab-pane label="The BCMS Journey" name="#bcms-journey" lazy>
        <BCMSJourney v-if="activeName === '#bcms-journey'" />
      </el-tab-pane>
      <el-tab-pane label="Business Units Setup" name="#business-unit" lazy>
        <BusinessUnits />
      </el-tab-pane>
      <el-tab-pane label="BIA" name="#bia" lazy>
        <BIA />
      </el-tab-pane>
      <!-- <el-tab-pane :key="keyValue" label="Compliance Assessment" name="#compliance-assessment" lazy>
        <ComplianceAssessment />
      </el-tab-pane> -->
      <el-tab-pane label="Risk Assessment" name="#risk-assessment" lazy>
        <ConsolidatedRA />
      </el-tab-pane>
      <el-tab-pane label="Incident Management" name="#incident-management" lazy>
        <IncidentManagement />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import Dashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
import BusinessUnits from '@/views/modules/settings/partials/business-units/SetUp.vue'
import ConsolidatedRA from '@/views/modules/risk-assessment/index.vue'
import IncidentManagement from '@/views/modules/Incidents/index.vue'
import BIA from './BIA/Analyze.vue'
import BCMSJourney from './BCMSJourney.vue'

export default {
  name: 'BCMS',
  components: {
    ConsolidatedRA,
    BIA,
    // Dashboard,
    BusinessUnits,
    IncidentManagement,
    BCMSJourney
  },
  data() {
    return {
      activeName: '#business-unit',
      keyValue: 1
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    forceRerender(tab, event) {
      // console.log(event.target.id)
      let hashString = event.target.id
      hashString = hashString.replace('tab-', '')
      // this.activeName = value
      this.$router.push({ hash: `${hashString}` })
      this.keyValue += 1
    },
    setCurrentPage() {
      this.activeName = window.location.hash !== '' ? window.location.hash : '#business-unit'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
