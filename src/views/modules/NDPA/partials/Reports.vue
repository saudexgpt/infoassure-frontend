<template>
  <b-tabs
    content-class="mt-1"
  >
    <b-tab
      lazy
    >
      <template #title>
        <feather-icon icon="BarChartIcon" />
        <span>Assessment Summary</span>
      </template>
      <div v-if="selectedProject.standard.name === 'NDPA'">
        <assessment-summary
          :selected-project="selectedProject"
        />
        <summary-by-requirement
          :selected-project="selectedProject"
        />
      </div>
      <div v-else>
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
    </b-tab>
    <b-tab
      lazy
    >
      <template #title>
        <feather-icon icon="ListIcon" />
        <span>Detailed Assessment Findings</span>
      </template>
      <assessment-findings
        :selected-project="selectedProject"
      />
    </b-tab>
  </b-tabs>

</template>
<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import AssessmentSummary from './charts/AssessmentSummary.vue'
import ManagementClause from './charts/ManagementClause.vue'
import PercentageCompletion from './charts/PercentageCompletion.vue'
import AssessmentFindings from './AssessmentFindings.vue'
import SummaryByRequirement from './charts/NDPA/SummaryByRequirement.vue'

export default {
  components: {
    BTabs,
    BTab,
    AssessmentSummary,
    ManagementClause,
    PercentageCompletion,
    AssessmentFindings,
    SummaryByRequirement,
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
