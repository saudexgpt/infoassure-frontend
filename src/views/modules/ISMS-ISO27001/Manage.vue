<template>
  <div>
    <div v-if="moduleIsActive || isAdmin">
      <el-row :gutter="5">
        <el-col :md="8">
          <p>Activities of the ISMS Module</p>
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
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project"
              :label="project.standard.name"
            >
              <span style="float: left">{{ project.standard.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ (project.available_module) ? project.available_module.name : '' }}</span>
            </el-option>
          </el-select>
        </el-col> -->
      </el-row>
      <p></p>
      <div v-if="selectedProject !== null">
        <el-row :gutter="5">
          <el-col :md="24">
            <el-button-group>
              <!-- <el-button
                id="gap_assessment"

                variant="outline-secondary"
                @click="setView('gap_assessment')"
              >
                <img
                  src="/images/project-icons/gap-assessment.png"
                  width="30"
                >
                Gap Assessment
              </el-button> -->
              <el-button
                id="risk_library"
                variant="outline-secondary"
                @click="setView('risk_library')"
              >
                <img src="/images/project-icons/risk_library.png" width="30" />
                Risk & Controls
              </el-button>
              <el-button
                id="risk_assessment"
                variant="outline-secondary"
                @click="setView('risk_assessment')"
              >
                <img src="/images/project-icons/risk-assessment.png" width="30" />
                Risk Assessment
              </el-button>
              <el-button id="soa" variant="outline-secondary" @click="setView('soa')">
                <img src="/images/project-icons/soa.png" width="30" />
                SOA
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <p></p>
        <div>
          <gap-assessment
            v-if="current_view === 'gap_assessment'"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
            :is-admin="isAdmin"
          />
          <risk-library v-if="current_view === 'risk_library'" module="isms" view-only="isms" />
          <risk-assessment
            v-if="current_view === 'risk_assessment'"
            module="isms"
            view-only="isms"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
          />
          <s-o-a
            v-if="current_view === 'soa'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
          />
        </div>
      </div>
    </div>
    <!-- <div
      v-else
      align="center"
    >
      <img
        src="//images/caution.png"
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
import GapAssessment from '@/views/modules/projects/partials/GapAssessment.vue'
import RiskLibrary from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
import RiskAssessment from '@/views/modules/risk-assessment/index.vue'
import SOA from '@/views/modules/statement-of-applicability/StatementOfApplicability.vue'
// import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    GapAssessment,
    RiskLibrary,
    RiskAssessment,
    SOA
    // ProjectPlanDetails,
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      current_view: 'risk_library',
      assessment_activities_array: [],
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
  // created() {
  //   this.selectedProject = this.project
  //   if (this.selectedClient.id !== null) {
  //     this.checkIfProjectIsActive()
  //   }
  //   setTimeout(() => {
  //     this.setView('gap_assessment')
  //   }, 5000)
  // },
  // created() {
  //   if (this.selectedClient.id !== null) {
  //     this.checkIfProjectIsActive()
  //   } else {
  //     this.$alert('Please select a client to continue')
  //   }
  // },
  mounted() {
    // this.selectedProject = this.project
    if (this.selectedClient.id !== null) {
      this.checkIfProjectIsActive()
    }
    setTimeout(() => {
      this.setView('risk_library')
    }, 5000)
  },
  methods: {
    checkPermission,
    checkIfProjectIsActive() {
      const projects = this.clientActivatedProjects.filter(
        (project) => project.available_module.slug === 'isms'
      )
      console.log(projects)
      this.moduleIsActive = false
      if (projects.length > 0) {
        this.moduleIsActive = true
        this.projects = projects

        this.selectedProject = projects[0]
      }
    },
    setAssessmentActivities() {
      const { standard } = this.selectedProject
      const assessmentActivities = standard.assessment_activities
      this.assessment_activities_array =
        assessmentActivities !== null ? assessmentActivities.split('|') : []
    },
    setView(viewId) {
      this.current_view = viewId
      this.changeActiveTabBgColor(viewId)
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('btn')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      for (let i = 0; i < divs.length; i++) {
        const current = document.getElementsByClassName('btn btn-secondary')
        // If there's no activeCard class
        if (current.length > 0) {
          current[0].className = current[0].className.replace(
            'btn btn-secondary',
            'btn btn-outline-secondary'
          )
        }
      }
      document.getElementById(viewId).className = 'btn btn-secondary'
    }
  }
}
</script>
