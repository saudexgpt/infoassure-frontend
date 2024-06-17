<template>
  <div>
    <el-row :gutter="5">
      <!-- <el-col :md="4">
      <div class="card">
        <div class="project-menu">
          <feather-icon
            size="36"
            icon="LayersIcon"
          />
          <p>Project Plan</p>
        </div>
      </div>
    </el-col> -->
      <el-col :md="4">
        <div
          id="business_unit"
          class="card activeCard"
          @click="setView('business_unit')"
        >
          <div class="project-menu">
            <img src="images/project-icons/business-unit.png">
            <p>Business Units</p>
          </div>
        </div>
      </el-col>
      <el-col
        :md="4"
      >
        <div
          id="rcm"
          class="card"
          @click="setView('rcm')"
        >
          <div class="project-menu">
            <img src="images/project-icons/risk-matrix.png">
            <p>RCM</p>
          </div>
        </div>
      </el-col>
      <el-col
        :md="4"
      >
        <div
          id="rcsa"
          class="card"
          @click="setView('rcsa')"
        >
          <div class="project-menu">
            <img src="images/project-icons/rcsa.png">
            <p>RCSA</p>
          </div>
        </div>
      </el-col>
      <el-col
        :md="4"
      >
        <div
          id="risk_log"
          class="card"
          @click="setView('risk_log')"
        >
          <div class="project-menu">
            <img src="images/project-icons/risk-log.png">
            <p>Risk Register</p>
          </div>
        </div>
      </el-col>
      <el-col
        :md="4"
      >
        <div
          id="enterprise"
          class="card"
          @click="setView('enterprise')"
        >
          <div class="project-menu">
            <img src="images/project-icons/err.png">
            <p><small>Enterprise Risk Register</small></p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <business-unit
        v-if="current_view === 'business_unit'"
      />
      <r-c-m
        v-if="current_view === 'rcm'"
      />
      <r-c-s-a
        v-if="current_view === 'rcsa'"
      />
      <risk-register
        v-if="current_view === 'risk_log'"
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
// import {
//   BTabs, BTab,
// } from 'bootstrap-vue'
import BusinessUnit from '@/views/modules/business-units/SetUp.vue'
import RCM from '@/views/modules/RCSA/RCM.vue'
import RCSA from '@/views/modules/RCSA/RCSAAssessments.vue'
import RiskRegister from '@/views/modules/RCSA/RiskRegister.vue'
import EnterpriseRiskRegister from '@/views/modules/RCSA/EnterpriseRiskRegister.vue'
// import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // BTabs,
    // BTab,
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
  methods: {
    checkPermission,
    setView(viewId) {
      const app = this
      app.current_view = viewId
      app.changeActiveTabBgColor(viewId)
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('card')
      // Loop through the buttons and add the activeCard class to the current/clicked button
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < divs.length; i++) {
        const current = document.getElementsByClassName('activeCard')
        // If there's no activeCard class
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' activeCard', '')
        }
      }
      document.getElementById(viewId).className += ' activeCard'
    },
  },
}
</script>
<style scoped>
.project-menu {
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  padding: 10px;
}
.card {
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  border-radius: 5px;
  color: #303133;
}
.card :hover {
  background-color: #3458cf;
  border-radius: 5px;
  color: #ffffff;
}
.activeCard {
  background-color: #0B173D;
  border-radius: 5px;
  color: #ffffff;
}
</style>
