<template>
  <div>
    <div v-if="moduleIsActive || isAdmin">
      <el-row :gutter="5">
        <el-col :md="8">
          <p>Activities of the NDPA Module</p>
        </el-col>
        <!-- <el-col :md="8">
          <el-select
            v-model="selectedProject"
            placeholder="Select Project"
            value-key="id"
            filterable
            style="width: 100%;"
          >
            <el-option
              v-for="(proj, project_index) in projects"
              :key="project_index"
              :value="proj"
              :label="proj.title"
            >
              <span style="float: left">{{ proj.title }}</span>
              <span style="float: right; color: #8492a6;">{{ proj.year }}</span>
            </el-option>
          </el-select>
        </el-col> -->
      </el-row>
      <p />
      <div v-if="selectedProject !== null">
        <el-row :gutter="5">
          <el-col :md="24">
            <b-button-group>
              <!-- <b-button
                id="business_unit"

                variant="outline-secondary"
                @click="setView('business_unit')"
              >
                <img
                  src="images/project-icons/business-unit.png"
                  width="30"
                >
                Business Units
              </b-button> -->
              <b-button
                v-if="selectedProject.feature_slug.includes('compliance')"
                id="gap_assessment"

                variant="outline-secondary"
                @click="setView('gap_assessment')"
              >
                <img
                  src="images/project-icons/gap-assessment.png"
                  width="30"
                >
                Compliance Assessment
              </b-button>
              <b-button
                v-if="selectedProject.feature_slug.includes('pda')"
                id="pda"

                variant="outline-secondary"
                @click="setView('pda')"
              >
                <img
                  src="images/project-icons/pda.png"
                  width="30"
                >
                PDA
              </b-button>
              <b-button
                v-if="selectedProject.feature_slug.includes('ropa')"
                id="ropa"

                variant="outline-secondary"
                @click="setView('ropa')"
              >
                <img
                  src="images/project-icons/ropa.png"
                  width="30"
                >
                RoPA
              </b-button>
              <b-button
                v-if="selectedProject.feature_slug.includes('dpia')"
                id="risk_library"

                variant="outline-secondary"
                @click="setView('risk_library')"
              >
                <img
                  src="images/project-icons/risk_library.png"
                  width="30"
                >
                Risk & Controls
              </b-button>
              <b-button
                v-if="selectedProject.feature_slug.includes('dpia')"
                id="dpia"

                variant="outline-secondary"
                @click="setView('dpia')"
              >
                <img
                  src="images/project-icons/dpia.png"
                  width="30"
                >
                DPIA
              </b-button>
            </b-button-group>
          </el-col>
        </el-row>
        <p />
        <div>
          <business-unit
            v-if="current_view === 'business_unit'"
          />
          <gap-assessment
            v-if="current_view === 'gap_assessment'"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
            :is-admin="isAdmin"
          />
          <risk-assessment
            v-if="current_view === 'dpia'"
            module="ndpa"
            view-only="ndpa"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
            :is-admin="isAdmin"
          />
          <!-- <d-p-i-a
            v-if="current_view === 'dpia'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
          /> -->
          <ro-p-a
            v-if="current_view === 'ropa'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
            :is-admin="isAdmin"
          />
          <p-d-a
            v-if="current_view === 'pda'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
          />
          <risk-library
            v-if="current_view === 'risk_library'"
            module="ndpa"
            view-only="ndpa"
            :is-admin="isAdmin"
          />
        </div>
      </div>
    </div>
    <!-- <div
        v-else
        align="center"
      >
        <img
          src="/images/caution.png"
          width="300"
          alt="NOT FOUND"
        >
        <br>
        <br>
        <br>
        <h3>MODULE NOT ACTIVE</h3>
      </div> -->
  </div>
</template>

<script>
import {
  BButtonGroup, BButton,
} from 'bootstrap-vue'
import BusinessUnit from '@/views/modules/business-units/SetUp.vue'
import GapAssessment from './partials/GapAssessment.vue'
import RiskLibrary from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
// import RiskLibrary from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
import RiskAssessment from '@/views/modules/risk-assessment/index.vue'

// import DPIA from './DPIA/index.vue'
import RoPA from './RoPA/index.vue'
import PDA from './PDA/index.vue'
// import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BButtonGroup,
    BButton,
    BusinessUnit,
    GapAssessment,
    RiskAssessment,
    RoPA,
    PDA,
    RiskLibrary,
    // ProjectPlanDetails,
  },
  props: {
    project: {
      type: Object,
      default: () => (null),
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      current_view: 'gap_assessment',
      assessment_activities_array: [],
      moduleIsActive: false,
      projects: [],
      selectedProject: null,
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
    clientActivatedProjects() {
      this.checkIfProjectIsActive()
    },
    selectedClient() {
      this.checkIfProjectIsActive()
    },
  },
  created() {
    this.selectedProject = this.project
    if (this.selectedClient.id !== null) {
      this.checkIfProjectIsActive()
    }
    setTimeout(() => {
      this.setView('gap_assessment')
    }, 5000)
  },
  methods: {
    checkPermission,
    checkIfProjectIsActive() {
      const app = this
      const projects = app.clientActivatedProjects.filter(project => project.available_module.slug === 'ndpa')
      app.moduleIsActive = false
      if (projects.length > 0) {
        app.moduleIsActive = true
        app.projects = projects
        // eslint-disable-next-line prefer-destructuring
        app.selectedProject = projects[0]
      }
    },
    setAssessmentActivities() {
      const app = this
      const { standard } = app.selectedProject
      const assessmentActivities = standard.assessment_activities
      app.assessment_activities_array = (assessmentActivities !== null) ? assessmentActivities.split('|') : []
    },
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
