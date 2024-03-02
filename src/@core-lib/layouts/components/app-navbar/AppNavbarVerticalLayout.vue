<template>
  <div
    class="navbar-container d-flex content align-items-center"
    :style="'background: ' + navbar_bg"
  >
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>
    <b-navbar-nav class="nav align-items-center ml-auto">
      <!-- <b-nav-item to="/apps/email">
        <el-tooltip
          class="item"
          effect="dark"
          content="In-App Messaging"
          placement="top-start"
        >
          <feather-icon
            icon="MailIcon"
            size="21"
          />
        </el-tooltip>
      </b-nav-item> -->
      <el-tooltip
        class="item"
        effect="dark"
        content="Notification"
        placement="top-start"
      >
        <notification-dropdown />
      </el-tooltip>
      <!-- <b-nav-item
        v-if="roles.includes('admin')"
        :href="'https://web.whatsapp.com/send?phone=' + whatsAppNo"
        target="_blank"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="WhatsApp Support Chat"
          placement="top-start"
        >
          <img src="@/assets/images/whatsapp-logo.png">
        </el-tooltip>
      </b-nav-item> -->
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav,
  // BNavItem, BButton, BPopover,
} from 'bootstrap-vue'
// import Bookmarks from './components/Bookmarks.vue'
// import Locale from './components/Locale.vue'
// import SearchBar from './components/SearchBar.vue'
// import DarkToggler from './components/DarkToggler.vue'
// import CartDropdown from './components/CartDropdown.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    // BNavItem,
    // BButton,
    // BPopover,
    // Bookmarks,
    // Locale,
    // SearchBar,
    // DarkToggler,
    // CartDropdown,
    NotificationDropdown,
    UserDropdown,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      background: 'linear-gradient(118deg, #064ee9, rgba(6, 78, 233, 0.7))',
      termPopoverShow: true,
      sessionPopoverShow: true,
      loading_session: false,
      loading_term: false,

    }
  },
  computed: {
    roles() {
      return this.$store.getters.userData.roles
    },
    navbar_bg() {
      return this.$store.getters.userData.navbar_bg
    },
  },
  methods: {
    activateSession() {
      const app = this
      app.loading_session = true
      const param = {
        current_session: app.systemSetSession.id,
      }
      const activateSessionResource = new Resource('school-setup/session/activate')
      activateSessionResource.store(param)
        .then(() => {
          app.loading_session = true
          app.$store.dispatch('user/getInfo')
          app.sessionPopoverShow = false
        })
    },
    activateTerm() {
      const app = this
      app.loading_term = true
      const param = {
        current_term: app.systemSetTerm.id,
      }
      const activateTermResource = new Resource('school-setup/term/activate')
      activateTermResource.store(param)
        .then(() => {
          app.$store.dispatch('user/getInfo')
          app.loading_term = false
          app.termPopoverShow = false
        })
    },
  },
}
</script>
<style scoped>
.el-tag {
  background: rgb(255, 255, 255, 0.9);
  color: #000000;
  border-radius: 30px !important;
  border: 2px solid #333333;
  font-weight: 600;
}
</style>
