<template>
  <el-tabs
    type="border-card"
  >
    <el-tab-pane lazy>
      <template slot="label">
        <feather-icon icon="LayersIcon" />
        <span>Project Plan in Phases</span>
      </template>
      <project-plan-details
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </el-tab-pane>
    <el-tab-pane lazy>
      <template slot="label">
        <feather-icon icon="FileTextIcon" />
        <span>Project Activities</span>
      </template>
      <project-activities
        :selected-client="selectedClient"
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import {
//   BTabs, BTab,
// } from 'bootstrap-vue'
import ProjectActivities from './ProjectActivities.vue'
import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // BTabs,
    // BTab,
    ProjectActivities,
    ProjectPlanDetails,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true,
    },
    selectedProject: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    checkPermission,
  },
}
</script>
