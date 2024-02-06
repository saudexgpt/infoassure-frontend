<template>
  <el-card>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab lazy>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Partner List</span>
        </template>
        <partner-list />
      </b-tab>
      <b-tab
        v-if="checkPermission(['create-partners'])"
        lazy
      >
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Register Partner</span>
        </template>
        <partner-registration />
      </b-tab>
      <b-tab
        v-if="checkPermission(['create-partners'])"
        lazy
      >
        <template #title>
          <feather-icon icon="UserPlusIcon" />
          <span>Register Partner Users</span>
        </template>
        <partner-user-registration />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import PartnerList from './partials/PartnerList.vue'
import PartnerRegistration from './partials/RegisterPartner.vue'
import PartnerUserRegistration from './partials/RegisterUserPartner.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BTabs,
    BTab,
    PartnerList,
    PartnerRegistration,
    PartnerUserRegistration,
  },
  methods: {
    checkPermission,
  },
}
</script>
