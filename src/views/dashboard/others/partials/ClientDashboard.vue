<template>
  <div>
    <statistics />
    <enterprise-risk-assessment-analysis title="Enterprise Risk Analysis" /><p />
    <project-data-analysis />
  </div>
</template>

<script>
import Statistics from './Statistics.vue'
import ProjectDataAnalysis from './ProjectDataAnalysis.vue'
import EnterpriseRiskAssessmentAnalysis from './EnterpriseRiskAssessmentAnalysis.vue'

export default {
  components: { Statistics, ProjectDataAnalysis, EnterpriseRiskAssessmentAnalysis },
  data() {
    return {
      style: {
        background: '#000',
        color: '#fff',
      },
      dashboardData: null,
      load: false,
    }
  },
  created() {
  },
  methods: {

  },
}
</script>
<style lang="scss" >
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
</style>
