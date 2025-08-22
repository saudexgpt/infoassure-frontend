<template>
  <div>
    <h4>Welcome to the ISMS Module</h4>
    <el-tabs v-model="activeName" @tab-click="forceRerender">
      <!-- <el-tabs
      v-model="activeName"
      tab-position="left"
      @tab-click="handleClick"
    > -->
      <el-tab-pane :key="keyValue" label="Overview" name="#dashboard" lazy>
        <dashboard v-if="activeName === '#dashboard'" />
      </el-tab-pane>
      <el-tab-pane :key="keyValue" label="The ISMS Journey" name="#isms-journey" lazy>
        <ISMSJourney v-if="activeName === '#isms-journey'" />
      </el-tab-pane>
      <el-tab-pane :key="keyValue" label="Compliance Assessment" name="#compliance-assessment" lazy>
        <ComplianceAssessment v-if="activeName === '#compliance-assessment'" />
      </el-tab-pane>
      <el-tab-pane :key="keyValue" label="Asset Management" name="#asset-inventory" lazy>
        <AssetManagement v-if="activeName === '#asset-inventory'" />
        <!-- <el-tabs type="border-card">
          <el-tab-pane label="Manage Asset Types" lazy>
            <AssetTypes />
          </el-tab-pane>
          <el-tab-pane label="Manage Assets" lazy>
            <AssetManagement />
          </el-tab-pane>
        </el-tabs> -->
      </el-tab-pane>
      <el-tab-pane label="Risk Management" name="#risk-management" lazy>
        <ConsolidatedRA v-if="activeName === '#risk-management'" />
      </el-tab-pane>
      <el-tab-pane label="Policy Management" name="#policy-management" lazy>
        <PolicyManagement v-if="activeName === '#policy-management'" />
      </el-tab-pane>
      <el-tab-pane label="Incident Management" name="#incident-management" lazy>
        <IncidentManagement v-if="activeName === '#incident-management'" />
      </el-tab-pane>
      <!-- <el-tab-pane label="Risk Management" name="#risk-management" lazy>
      <risk-assessment />
    </el-tab-pane>
    <el-tab-pane label="Contracts & SLA" name="#contract-and-sla" lazy>
      <contract-and-sla />
    </el-tab-pane>
    <el-tab-pane label="Financials & Billing" name="#financials-and-billing" lazy>
      <financials-and-billing />
    </el-tab-pane>
    <el-tab-pane label="Vendor Relationship" name="#vrm" lazy>
      <VRM />
    </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import Dashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
// import AssetTypes from '@/views/modules/settings/partials/ManageAssetTypes/index.vue'
import AssetManagement from '@/views/modules/settings/partials/ManageAssets/index.vue'
import ConsolidatedRA from '@/views/modules/risk-assessment/index.vue'
import ComplianceAssessment from './partials/ComplianceAssessment.vue'
import ISMSJourney from './ISMSJourney.vue'
import PolicyManagement from '@/views/modules/Policies/index.vue'
import IncidentManagement from '@/views/modules/Incidents/index.vue'
// import checkRole from '@/utils/role'
// import VRM from '@/views/modules/ISMS-ISO27001/VendorRelationshipManagement/index.vue'

export default {
  name: 'ISMS',
  components: {
    ConsolidatedRA,
    // AssetTypes,
    AssetManagement,
    Dashboard,
    ComplianceAssessment,
    PolicyManagement,
    IncidentManagement,
    ISMSJourney
    // FinancialsAndBilling,
    // ContractAndSla,
    // VRM
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#dashboard',
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
      this.activeName = window.location.hash !== '' ? window.location.hash : '#dashboard'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
