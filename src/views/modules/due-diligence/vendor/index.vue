<template>
  <el-tabs v-loading="loading" v-model="activeName" @tab-click="forceRerender">
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    > -->
    <el-tab-pane :key="keyValue" label="Onboarding" name="#onboarding" lazy>
      <template v-slot:label>
        <span><icon icon="tabler:building" /> Onboarding</span>
      </template>
      <Onboarding :vendor-id="userData.vendor_id" />
    </el-tab-pane>
    <template v-if="vendor.second_approval.action === 'Approve'">
      <el-tab-pane label="Vendor Assessment" name="#risk-assessment" lazy>
        <template v-slot:label>
          <span><icon icon="tabler:alert-triangle" /> Vendor Assessment</span>
        </template>
        <RiskAssessment :vendor-id="userData.vendor_id" />
      </el-tab-pane>
      <el-tab-pane label="Contracts & SLA" name="#contract-and-sla" lazy>
        <template v-slot:label>
          <span><icon icon="tabler:file-invoice" /> Contracts & SLA</span>
        </template>
        <ContractAndSla :vendor-id="userData.vendor_id" />
      </el-tab-pane>
      <el-tab-pane label="Financials & Billing" name="#financials-and-billing" lazy>
        <template v-slot:label>
          <span><icon icon="tabler:report-money" /> Financials & Billing</span>
        </template>
        <FinancialAndBilling :vendor-id="userData.vendor_id" />
      </el-tab-pane>
      <el-tab-pane label="Vendor Relationship" name="#vrm" lazy>
        <template v-slot:label>
          <span><icon icon="tabler:heart-handshake" /> Vendor Relationship</span>
        </template>
        <VRM :vendor-id="userData.vendor_id" />
      </el-tab-pane>
    </template>
  </el-tabs>
</template>
<script>
import checkPermission from '@/utils/permission'
// import MailBox from './email/Email.vue'
import Onboarding from './partials/Onboarding.vue'
import RiskAssessment from './partials/RiskAssessment.vue'
import FinancialAndBilling from './partials/FinancialAndBilling.vue'
import ContractAndSla from './partials/ContractAndSLA.vue'
import VRM from './partials/VRM.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // MailBox,
    Onboarding,
    RiskAssessment,
    FinancialAndBilling,
    ContractAndSla,
    VRM
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
      activeName: '#onboarding',
      keyValue: 1,
      vendor: {
        second_approval: {
          action: 'pending'
        }
      }
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    }
  },
  mounted() {
    this.setCurrentPage()
    this.fetchVendor()
  },
  methods: {
    checkPermission,
    fetchVendor() {
      this.loading = true
      const fetchVendorResource = new Resource('vdd/show-vendor')
      fetchVendorResource.vGet(this.userData.vendor_id).then((response) => {
        this.vendor = response.vendor
        this.loading = false
      })
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
      this.activeName = window.location.hash !== '' ? window.location.hash : '#onboarding'
    }
  }
}
</script>
