<template>
  <div>
    <assessment-summary
      :selected-project="selectedProject"
    />
    <management-clause
      :selected-project="selectedProject"
    />
    <percentage-completion
      :selected-project="selectedProject"
    />
  </div>
</template>
<script>
import AssessmentSummary from './charts/AssessmentSummary.vue'
import ManagementClause from './charts/ManagementClause.vue'
import PercentageCompletion from './charts/PercentageCompletion.vue'

export default {
  components: {
    AssessmentSummary, ManagementClause, PercentageCompletion,
  },
  props: {
    selectedProject: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
    }
  },
  methods: {
  },

}
</script>
