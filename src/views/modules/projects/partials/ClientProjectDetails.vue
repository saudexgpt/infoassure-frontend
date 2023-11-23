<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
    >
      <b-tab lazy>
        <template #title>
          <feather-icon icon="LayersIcon" />
          <span>Project Plan in Phases</span>
        </template>
        <project-plan-details
          :selected-project="selectedProject"
          :is-admin="isAdmin"
        />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="FileTextIcon" />
          <span>Project Activities</span>
        </template>
        <project-activities
          :selected-project="selectedProject"
          :is-admin="isAdmin"
        />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import ProjectActivities from './ProjectActivities.vue'
import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    ProjectActivities,
    ProjectPlanDetails,
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
  methods: {
    checkPermission,
  },
}
</script>
