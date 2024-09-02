<template>
  <el-tabs
    type="border-card"
    lazy
  >
    <el-tab-pane
      label="COMPLIANCE STATUS"
      lazy
    >
      <b-row class="match-height">
        <b-col :md="12">
          <gap-assessment-data-analysis
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </b-col>
      </b-row>
      <b-row class="match-height">
        <b-col :md="8">
          <el-skeleton
            :loading="load"
            :rows="3"
            animated
          />
          <management-clause
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </b-col>
        <b-col :md="4">
          <el-skeleton
            :loading="load"
            :rows="3"
            animated
          />
          <gap-assessment-summmary
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </b-col>
      </b-row>
      <b-row class="match-height">
        <b-col :md="12">
          <el-skeleton
            :loading="load"
            :rows="6"
            animated
          />
          <percentage-completion
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </b-col>
      </b-row>
      <!-- <el-row :gutter="10">
          <el-col :md="14">
            <percentage-completion />
          </el-col>
          <el-col :md="10">
            <gap-assessment-data-analysis />
          </el-col>
        </el-row> -->
    </el-tab-pane>
    <el-tab-pane
      label="DPIA KPI"
      lazy
    >
      <d-p-i-a-data-analysis
        v-if="selectedClient !== null"
        :selected-client="selectedClient"
        module="ndpa"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import GapAssessmentDataAnalysis from './partials/GapAssessmentDataAnalysis.vue'
// import DPIADataAnalysis from './charts/DPIADataAnalysis.vue'
import DPIADataAnalysis from '@/views/dashboard/others/partials/EnterpriseRiskAssessmentAnalysis.vue'
import GapAssessmentSummmary from './charts/GapAssessmentSummmary.vue'
import ManagementClause from './charts/ManagementClause.vue'
import PercentageCompletion from './charts/PercentageCompletion.vue'

export default {
  components: {
    BRow,
    BCol,
    GapAssessmentDataAnalysis,
    DPIADataAnalysis,
    GapAssessmentSummmary,
    ManagementClause,
    PercentageCompletion,
  },
  data() {
    return {
      selectedProject: null,
      load: false,
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
      this.setModuleSlug()
    },
  },
  mounted() {
    this.setModuleSlug()
  },
  methods: {
    setModuleSlug() {
      const app = this
      let selectedProject = null
      app.load = true
      setTimeout(() => {
        app.clientActivatedProjects.forEach(project => {
          if (project.available_module) {
            if (project.available_module.slug === 'ndpa') {
              selectedProject = project
            }
          }
        })
        app.selectedProject = selectedProject
        app.load = false
      }, 2000)
    },
  },
}
</script>
