<template>
  <el-card>
    <h3>Third Party Vendor Due Diligence Assessment</h3>
    <b-tabs
      content-class="mt-1"
    >
      <b-tab
        v-if="checkPermission(['upload-due-diligence-requirements'])"
        lazy
      >
        <template #title>
          <feather-icon icon="ToolIcon" />
          <span>Manage Requirements</span>
        </template>
        <manage-questions />
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="LayersIcon" />
          <span>Perform Due Diligence Assessment</span>
        </template>
        <create :is-admin="isAdmin" />
      </b-tab>
      <!-- <b-tab
          v-if="checkPermission(['manage-project-plan'])"
          lazy
        >
          <template #title>
            <feather-icon icon="BarChartIcon" />
            <span>Report</span>
          </template>
          <create :is-admin="isAdmin" />
        </b-tab> -->
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import Create from './Create.vue'
import ManageQuestions from './ManageQuestions.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    Create,
    ManageQuestions,
  },
  data() {
    return {
      isAdmin: false,
    }
  },
  computed: {
    ...mapGetters([
      'userData',
    ]),
  },
  created() {
    this.setAdmin()
  },
  methods: {
    setAdmin() {
      if (!this.userData.roles.includes('client')) {
        this.isAdmin = true
      }
    },
    checkPermission,
  },
}
</script>
