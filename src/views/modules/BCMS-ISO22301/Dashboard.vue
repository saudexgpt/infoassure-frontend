<template>
  <el-tabs type="border-card">
    <el-tab-pane
      label="BIA ANALYSIS"
      lazy
    >
      <b-i-a-data-analysis
        v-if="selectedClient !== null"
        :selected-client="selectedClient"
      />
    </el-tab-pane>
    <el-tab-pane label="RISK ASSESSMENT KPI">
      <risk-assessment-analysis
        v-if="selectedClient !== null"
        :selected-client="selectedClient"
        module="bcms"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
} from 'bootstrap-vue'
import BIADataAnalysis from './charts/BIADataAnalysis.vue'
import RiskAssessmentAnalysis from '@/views/dashboard/others/partials/EnterpriseRiskAssessmentAnalysis.vue'

export default {
  components: {
    BIADataAnalysis,
    RiskAssessmentAnalysis,
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
            if (project.available_module.slug === 'bcms') {
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
