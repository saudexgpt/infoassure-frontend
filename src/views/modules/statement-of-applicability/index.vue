<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab
        v-if="checkPermission(['manage-soa-settings'])"
        lazy
      >
        <template #title>
          <feather-icon icon="ToolIcon" />
          <span>Setup</span>
        </template>
        <setup />
      </b-tab>
      <!-- <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="SearchIcon" />
          <span>Assess New Risk(s)</span>
        </template>
        <assessment />
      </b-tab> -->
      <!-- <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="EyeIcon" />
          <span>Statement of Applicability</span>
        </template>
        <statement-of-applicability />
      </b-tab> -->
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import Setup from './partials/Setup.vue'
// import StatementOfApplicability from './StatementOfApplicability.vue'

export default {
  components: {
    BTabs,
    BTab,
    Setup,
    // StatementOfApplicability,
  },
  data() {
    return {

    }
  },
  methods: {
    checkPermission,
  },
}
</script>
