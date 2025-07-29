<template>
  <el-tabs type="border-card">
    <el-tab-pane label="COMPLIANCE STATUS" lazy>
      <!-- <el-row :gutter="20">
        <el-col :md="24">
          <gap-assessment-data-analysis
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :md="16">
          <el-skeleton :loading="load" :rows="3" animated />
          <management-clause
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </el-col>
        <el-col :md="8">
          <el-skeleton :loading="load" :rows="3" animated />
          <gap-assessment-summmary
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :md="24">
          <el-skeleton :loading="load" :rows="6" animated />
          <percentage-completion
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </el-col>
      </el-row> -->
    </el-tab-pane>
    <el-tab-pane label="RISK MANAGEMENT KPI">
      <asset-risk-analysis v-if="selectedClient !== null" :selected-client="selectedClient" />
    </el-tab-pane>
    <!-- <el-tab-pane label="STATEMENT OF APPLICABILITY">
      <s-o-a-data-analysis v-if="selectedClient !== null" :selected-client="selectedClient" />
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
// import GapAssessmentDataAnalysis from './partials/GapAssessmentDataAnalysis.vue'
import AssetRiskAnalysis from './charts/AssetRiskAnalysis.vue'
import GapAssessmentSummmary from './charts/GapAssessmentSummmary.vue'
import ManagementClause from './charts/ManagementClause.vue'
// import PercentageCompletion from './charts/PercentageCompletion.vue'
// import SOADataAnalysis from './partials/SOADataAnalysis.vue'

export default {
  components: {
    // GapAssessmentDataAnalysis,
    AssetRiskAnalysis,
    GapAssessmentSummmary,
    ManagementClause
    // PercentageCompletion
    // SOADataAnalysis
  },
  data() {
    return {
      selectedProject: null,
      load: false
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
      this.setModuleSlug()
    }
  },
  mounted() {
    this.setModuleSlug()
  },
  methods: {
    setModuleSlug() {
      let selectedProject = null
      this.load = true
      setTimeout(() => {
        this.clientActivatedProjects.forEach((project) => {
          if (project.available_module) {
            if (project.available_module.slug === 'isms') {
              selectedProject = project
            }
          }
        })
        this.selectedProject = selectedProject
        this.load = false
      }, 2000)
    }
  }
}
</script>
