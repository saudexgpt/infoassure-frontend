<template>
  <div>
    <button
      id="close_notification_pane"
      style="display: none"
    />
    <b-nav-item-dropdown
      class="dropdown-notification mr-25"
      menu-class="dropdown-menu-media"
      right
    >
      <audio id="myAudio">
        <source
          src="/alert.mp3"
          type="audio/mpeg"
        >
      </audio>
      <div style="display: none">
        <button
          id="play_audio"
          @click="playAudio()"
        >
          Play Audio
        </button>
      </div>
      <template #button-content>
        <feather-icon
          :badge="unreadNotificationCount"
          badge-classes="bg-primary"
          class="text-body"
          icon="BellIcon"
          size="21"
        />
      </template>

      <!-- Header -->
      <li class="dropdown-menu-header">
        <div class="dropdown-header d-flex">
          <h4 class="notification-title mb-0 mr-auto">
            Recent Notifications
          </h4>
        </div>
      </li>

      <!-- Notifications -->
      <vue-perfect-scrollbar
        v-if="notifications.length > 0"
        v-once
        :settings="perfectScrollbarSettings"
        class="scrollable-container media-list scroll-area"
        tagname="li"
      >
        <!-- Account Notification -->
        <b-link
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <b-media v-if="index <= 10">
            <template #aside>
              <feather-icon
                badge-classes="bg-info"
                class="text-body"
                icon="InfoIcon"
                size="20"
              />
            </template>
            <p class="media-heading">
              <span class="font-weight-bolder">
                {{ notification.data.title }}
              </span>
            </p>
            <small class="notification-text">{{ notification.data.description }}</small><br>
            <small class="pull-right mt-1 whitespace-no-wrap">{{ moment(notification.created_at).fromNow() }}</small>
          </b-media>
        </b-link>
      </vue-perfect-scrollbar>
      <vue-perfect-scrollbar
        v-else
        :settings="perfectScrollbarSettings"
        class="scrollable-container media-list scroll-area"
        tagname="li"
      >
        <b-link>
          <b-media>
            <template #aside>
              <feather-icon
                badge-classes="bg-info"
                class="text-body"
                icon="InfoIcon"
                size="20"
              />
            </template>
            <small class="notification-text">You have no recent notifications</small>
          </b-media>
        </b-link>
      </vue-perfect-scrollbar>
      <!-- Cart Footer -->
      <li
        class="dropdown-menu-footer"
      >
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          block
          @click="loadNotifications"
        >Read all notifications
        </b-button>
      </li>
    </b-nav-item-dropdown>
  </div>
</template>

<script>
import moment from 'moment'
import {
  BNavItemDropdown, BMedia, BLink, BButton,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Ripple from 'vue-ripple-directive'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BNavItemDropdown,
    BMedia,
    BLink,
    VuePerfectScrollbar,
    BButton,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      // settings: {
      //   maxScrollbarLength: 60,
      //   wheelSpeed: 0.60,
      // },
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false,
      },
    }
  },
  computed: {
    unreadNotificationCount() {
      return this.$store.getters.userData.unreadNotificationCount
    },
    notifications() {
      return this.$store.getters.userData.notifications
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag
    },
    listenForChanges() {
      window.Pusher = Pusher
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.VUE_APP_MIX_PUSHER_APP_KEY,
        cluster: process.env.VUE_APP_MIX_PUSHER_APP_CLUSTER,
        encrypted: true,
        authEndpoint: `${process.env.VUE_APP_MIX_BASE_SERVER_URL}broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        },
      })
      const currentUserId = this.$store.getters.userId
      return window.Echo.private(`App.Models.User.${currentUserId}`)
        .notification(notification => {
          // this.playAudio()
          // console.log(this.$refs.play_audio)
          document.getElementById('play_audio').click()
          this.pushNotification(notification)
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: notification.title, // .response.statusText,
              icon: 'AlertTriangleIcon',
              variant: 'success',
              text: notification.description,
            },
          })
        })
    },
  },
  mounted() {
    this.fetchUserNotifications()
  },
  methods: {
    moment,
    fetchUserNotifications() {
      const app = this
      const userNotifications = new Resource('user-notifications')
      userNotifications.list().then(response => {
        app.$store.dispatch('user/setNotifications', response.notifications)
        app.$store.dispatch('user/setUnreadNotificationCount', response.unread_notifications)
        // eslint-disable-next-line no-unused-expressions
        this.listenForChanges
      })
    },
    pushNotification(notification) {
      const data = {
        title: notification.title,
        description: notification.description,
      }
      // eslint-disable-next-line no-param-reassign
      notification.data = data
      this.$store.dispatch('user/addNewNotifications', notification)
      this.$store.dispatch('user/setUnreadNotificationCount', 1)
    },
    playAudio() {
      const audio = document.getElementById('myAudio')
      audio.play()
    },
    loadNotifications() {
      document.getElementById('close_notification_pane').click()
      this.show_notification = false
      // then update notifications as read
      this.$router.push('/notifications')
    },
  },
}
</script>

<style>

</style>
