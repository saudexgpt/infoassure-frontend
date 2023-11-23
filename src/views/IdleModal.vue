<template>
  <el-dialog :visible.sync="dialogVisible">
    <div
      class="form-container"
      align="center"
    >
      <feather-icon
        icon="SlashIcon"
        size="100"
        style="color: brown"
      />
      <h3>Inactive Session Timeout</h3>
      <p>To keep working, hover your mouse or press a key on your keyboard</p>
      <p>{{ time/1000 }} seconds left to automatic sign out</p>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      time: 15000,
      dialogVisible: false,
    }
  },
  created() {
    const timerId = setInterval(() => {
      this.time -= 1000
      if (!this.$store.state.idleVue.isIdle) {
        clearInterval(timerId)
      } else {
        this.dialogVisible = true
      }
      if (this.time < 1) {
        // Your logout function should be over here
        this.logout()
        clearInterval(timerId)
      }
    }, 1000)
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$router.push('/login')
    },
  },
}
</script>
