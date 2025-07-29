<template>
  <div>
    <div class="mt-150px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <!-- form -->
      <h2 class="text-2xl font-bold text-center w-[100%] mb-15px">🔒 One Time Passkey </h2>
      <div class="mb-2 text-center"> Kindly enter the OTP sent to your email below </div>
      <form @submit.prevent="login">
        <v-otp-input v-model="token" placeholder="*" />
        <v-btn
          :disabled="token.length < 6 || loading"
          color="black"
          text="Submit"
          variant="outlined"
          block
          :loading="load"
          @click="validationForm"
        />
      </form>
      <br />

      <div style="cursor: pointer; margin-top: 20px; text-align: center" @click="resendToken()">
        <strong>Didn't get the token? Resend</strong>
      </div>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      token: '',
      load: false
    }
  },
  methods: {
    checkLength() {
      if (this.token.length === 6) {
        console.log(this.token.length)
        this.validationForm()
      }
    },
    resendToken() {
      this.token = ''
      const confirmTokenResource = new Resource('auth/sent-2fa-code')
      this.load = true
      confirmTokenResource
        .update(this.userId)
        .then(() => {
          this.$message('Token sent to your email')
          this.load = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.message)
          this.load = false
        })
    },
    validationForm() {
      this.load = true
      this.$store
        .dispatch('user/confirmOTP', { id: this.userId, token: this.token })
        .then(() => {
          this.$message({
            title: 'Login Success',
            type: 'success',
            message: 'Welcome'
          })

          // we load the browser this once
          window.location = '/' // this.$router.push({ path: '/' }).catch(() => {}) // window.location = '/dashboard/ecommerce'

          this.load = false
        })
        .catch((error) => {
          this.$message({
            message: error.response.data.message,
            type: 'error'
          })
          this.load = false
        })
    }
  }
}
</script>
