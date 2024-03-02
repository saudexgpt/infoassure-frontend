<template>
  <div class="dashboard-container">

    <component :is="currentRole" />
  </div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import AdminDashboard from './admin/index.vue'
import PartnerDashboard from './partner/index.vue'
import OthersDashboard from './others/index.vue'

export default {
  components: {
    AdminDashboard, PartnerDashboard, OthersDashboard,
  },
  data() {
    return {
      currentRole: 'OthersDashboard',
    }
  },
  computed: {
    ...mapGetters([
      'userData',
    ]),
  },
  created() {
    // if (this.userData.roles.includes('super') || this.userData.roles.includes('admin') || this.userData.roles.includes('user')) {
    //   this.currentRole = 'AdminDashboard'
    // }
    if (this.userData.roles.includes('super')) {
      this.currentRole = 'AdminDashboard'
    } else if (this.userData.roles.includes('partner')) {
      this.currentRole = 'PartnerDashboard'
    } else if (!this.userData.roles.includes('client')) {
      this.currentRole = 'AdminDashboard'
    }
  },
}
</script>
