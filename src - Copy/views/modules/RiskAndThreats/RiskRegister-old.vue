<template>
  <div v-if="selectedClient !== null">
    <view-details
      :client-id="selectedClient.id"
      :assessment-module="assessmentModule"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import ViewDetails from './partials/ViewRiskControlMatrix.vue'

export default {
  components: {
    ViewDetails,
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => (null),
    },
    assessmentModule: {
      type: String,
      default: () => { 'ra' },
    },
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
    }
  },
  methods: {
    checkPermission,
  },
}
</script>
