<template>
  <div>
    <el-row :gutter="5">
      <el-col :md="24">
        <b-button-group>
          <b-button
            id="business_unit"

            variant="outline-secondary"
            @click="setView('business_unit')"
          >
            <img
              src="images/project-icons/business-unit.png"
              width="30"
            >
            Business Units
          </b-button>
          <b-button
            id="rcm"

            variant="outline-secondary"
            @click="setView('rcm')"
          >
            <img
              src="images/project-icons/risk_library.png"
              width="30"
            >
            RCM
          </b-button>
          <b-button
            id="rcsa"

            variant="outline-secondary"
            @click="setView('rcsa')"
          >
            <img
              src="images/project-icons/rcsa.png"
              width="30"
            >
            RCSA
          </b-button>
          <b-button
            id="risk_log"

            variant="outline-secondary"
            @click="setView('risk_log')"
          >
            <img
              src="images/project-icons/risk-assessment.png"
              width="30"
            >
            Risk Register
          </b-button>
          <b-button
            id="enterprise"

            variant="outline-secondary"
            @click="setView('enterprise')"
          >
            <img
              src="images/project-icons/err.png"
              width="30"
            >
            Enterprise Risk Register
          </b-button>
        </b-button-group>
      </el-col>
    </el-row>
    <div>
      <p />
      <business-unit
        v-if="current_view === 'business_unit'"
      />
      <r-c-m
        v-if="current_view === 'rcm'"
        module="rcsa"
        view-only="rcsa"
      />
      <r-c-s-a
        v-if="current_view === 'rcsa'"
      />
      <risk-register
        v-if="current_view === 'risk_log'"
        module="rcsa"
        view-only="rcsa"
      />
      <enterprise-risk-register
        v-if="current_view === 'enterprise'"
      />
    </div>
  </div>
  <!-- <el-tabs
    type="border-card"
  >
    <el-tab-pane lazy>
      <template slot="label">
        <feather-icon icon="LayersIcon" />
        <el-col>Project Plan in Phases</el-col>
      </template>
      <project-plan-details
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template slot="label">
        <feather-icon icon="FileTextIcon" />
        <el-col>Project Activities</el-col>
      </template>
      <project-activities
        :selected-client="selectedClient"
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </el-tab-pane>
  </el-tabs> -->
</template>

<script>
import {
  BButtonGroup, BButton,
} from 'bootstrap-vue'
import BusinessUnit from '@/views/modules/business-units/SetUp.vue'
import RCM from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
import RCSA from '@/views/modules/RCSA/RCSAAssessments.vue'
import EnterpriseRiskRegister from '@/views/modules/RCSA/EnterpriseRiskRegister.vue'
import RiskRegister from '@/views/modules/risk-assessment/index.vue' // '@/views/modules/RCSA/RiskRegister.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BButtonGroup,
    BButton,
    BusinessUnit,
    RCM,
    RCSA,
    RiskRegister,
    EnterpriseRiskRegister,
    // ProjectPlanDetails,
  },
  data() {
    return {
      current_view: 'business_unit',
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
  created() {
    if (this.selectedClient.id === null) {
      this.$alert('Please select a client to continue')
    }
  },
  mounted() {
    this.setView(this.current_view)
  },
  methods: {
    checkPermission,
    setView(viewId) {
      const app = this
      app.current_view = viewId
      app.changeActiveTabBgColor(viewId)
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('btn')
      // Loop through the buttons and add the activeCard class to the current/clicked button
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < divs.length; i++) {
        const current = document.getElementsByClassName('btn btn-secondary')
        // If there's no activeCard class
        if (current.length > 0) {
          current[0].className = current[0].className.replace('btn btn-secondary', 'btn btn-outline-secondary')
        }
      }
      document.getElementById(viewId).className = 'btn btn-secondary'
    },
  },
}
</script>
