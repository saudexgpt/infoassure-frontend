<template>
  <el-card class="app-container">
    <div class="block">
      <legend>{{ title }}</legend>
      <div v-if="notifications.length > 0">

        <el-timeline
          v-loading="listLoading"
          style="height: 400px; overflow:auto;"
        >
          <el-timeline-item
            v-for="(activity_log, index) in notifications"
            :key="index"
            :timestamp="moment(activity_log.created_at).fromNow()"
            placement="top"
            color="#0bbd87"
          >
            <el-card>
              <label>{{ activity_log.data.title }}</label>
              <p>{{ activity_log.data.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-else>
        <el-empty description="You have no notification" />
      </div>
    </div>
  </el-card>
</template>

<script>
import moment from 'moment'
import Resource from '@/api/resource'

const markNotificationAsRead = new Resource('notification/mark-as-read')
export default {
  props: {
    title: {
      type: String,
      default: 'Notification',
    },
  },
  data() {
    return {
      show_notification: true,
      listLoading: false,
    }
  },
  computed: {
    notifications() {
      return this.$store.getters.userData.notifications
    },
  },
  created() {
    this.markAsRead()
  },
  methods: {
    moment,
    markAsRead() {
      const app = this
      app.listLoading = true
      markNotificationAsRead.list()
        .then(response => {
          app.$store.dispatch('user/setNotifications', response.notifications)
          app.$store.dispatch('user/setUnreadNotificationCount', response.unread_notifications)
          this.listLoading = false
        })
    },
  },
}
</script>
