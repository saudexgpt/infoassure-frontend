<template>
  <div class="dashboard-container">

    <component :is="currentRole" />
  </div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import UserDashboard from '@/views/modules/user/Profile.vue'
import ClientDashboard from './partials/ClientDashboard.vue'

export default {
  components: {
    UserDashboard, ClientDashboard,
  },
  data() {
    return {
      currentRole: 'UserDashboard',
    }
  },
  computed: {
    ...mapGetters([
      'userData',
    ]),
  },
  created() {
    if (this.userData.roles.includes('client')) {
      this.currentRole = 'ClientDashboard'
    }
  },
}
</script>
