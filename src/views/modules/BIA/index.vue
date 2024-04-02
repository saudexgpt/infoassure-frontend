<template>
  <el-card v-if="getOtherToken()">
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="ToolIcon" />
          <span>Create New</span>
        </template>
        <create />
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="ToolIcon" />
          <span>Details</span>
        </template>
        <b-i-a-details />
      </b-tab>
    </b-tabs>
  </el-card>
  <div v-else>
    <other-user-login />
  </div>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import { getOtherToken } from '@/utils/auth'
import checkPermission from '@/utils/permission'
import Create from './Create.vue'
import BIADetails from './Details.vue'
import OtherUserLogin from '@/views/pages/authentication/OtherUserLogin.vue'

export default {
  components: {
    BTabs,
    BTab,
    Create,
    BIADetails,
    OtherUserLogin,
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
    }
  },
  methods: {
    checkPermission,
    getOtherToken,
  },
}
</script>
