<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab lazy>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Client List</span>
        </template>
        <client-list />
      </b-tab>
      <b-tab
        v-if="checkPermission(['create-clients'])"
        lazy
      >
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Client Registration</span>
        </template>
        <client-registration />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import ClientList from './partials/ClientList.vue'
import ClientRegistration from './partials/RegisterClient.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    ClientList,
    ClientRegistration,
  },
  methods: {
    checkPermission,
  },
}
</script>
