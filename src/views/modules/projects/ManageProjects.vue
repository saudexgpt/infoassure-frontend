<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab lazy>
        <template #title>
          <feather-icon icon="BarChartIcon" />
          <span>Manage Project Phases</span>
        </template>
        <project-phases />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="LayersIcon" />
          <span>Manage Project Plan</span>
        </template>
        <project-plan />
      </b-tab>
      <b-tab lazy>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Manage Client Projects</span>
        </template>
        <client-projects />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import ClientProjects from './ClientProjects.vue'
import ProjectPhases from './ProjectPhases.vue'
import ProjectPlan from './ProjectPlan.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    ClientProjects,
    ProjectPhases,
    ProjectPlan,
  },
  methods: {
    checkPermission,
  },
}
</script>
