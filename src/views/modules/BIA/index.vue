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
          <feather-icon icon="ToolIcon" />
          <span>Details</span>
        </template>
        {{ business_impact_analyses }}
      </b-tab>
      <b-tab
        lazy
      >
        <template #title>
          <feather-icon icon="ToolIcon" />
          <span>Create New</span>
        </template>
        <create />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import Create from './Create.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    Create,
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
    }
  },
  created() {
    this.fetchBIA()
  },
  methods: {
    checkPermission,
    fetchBIA() {
      const app = this
      const fetchClientsResource = new Resource('bia/fetch-bia')
      fetchClientsResource.list({ client_id: 1 })
        .then(response => {
          app.business_impact_analyses = response.business_impact_analyses
        })
    },
  },
}
</script>
