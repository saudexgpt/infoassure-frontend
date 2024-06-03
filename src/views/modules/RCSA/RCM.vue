<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
    >
      <b-tab
        lazy
      >
        <template #title>
          <span>Create New</span>
        </template>
        <create />
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <span>View All</span>
        </template>
        <view-details />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import Create from './partials/CreateRCM.vue'
import ViewDetails from './partials/ViewRCMDetails.vue'

export default {
  components: {
    BTabs,
    BTab,
    Create,
    ViewDetails,
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
