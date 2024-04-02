<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab
        lazy
      >
        <template #title>
          <span>Business Units</span>
        </template>
        <business-units />
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <span>Business Processes</span>
        </template>
        <business-processes />
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <span>Manage Access</span>
        </template>
        <manage-access />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import BusinessProcesses from './partials/BusinessProcesses.vue'
import BusinessUnits from './partials/BusinessUnitsTable.vue'
import ManageAccess from './partials/ManageAccess.vue'

export default {
  components: {
    BTabs,
    BTab,
    BusinessProcesses,
    BusinessUnits,
    ManageAccess,
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
