<template>
  <div>
    <!-- Reset Password v1 -->
    <b-card
      v-loading="load"
      class="mb-0"
    >
      <!-- form -->
      <b-card-title class="mb-1">
        🔒 One Time Passkey
      </b-card-title>
      <b-card-text class="mb-2">
        An OTP token was sent to your email. Kindly enter the token below
      </b-card-text>

      <b-form
        class="auth-forgot-password-form mt-2"
        @submit.prevent="validationForm"
      >
        <b-form-group
          label="Enter OTP"
          label-for="otp"
        >
          <b-form-input
            id="otp"
            v-model="token"
            name="otp"
            placeholder="Enter OTP"
          />
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          block
        >
          Submit
        </b-button>
      </b-form>
      <div
        style="cursor: pointer; margin-top: 20px"
        @click="resendToken()"
      >
        <strong>Didn't get the token? Resend</strong>
      </div>
    </b-card>
  </div>

</template>

<script>
import {
  BCard, BCardTitle, BCardText, BForm, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BButton,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BFormInput,
  },
  props: {
    userId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      token: '',
      load: false,
    }
  },
  methods: {
    resendToken() {
      const app = this
      const confirmTokenResource = new Resource('auth/sent-2fa-code')
      app.load = true
      confirmTokenResource.update(app.userId)
        .then(() => {
          app.$message('Token sent to your email')
          app.load = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.message)
          app.load = false
        })
    },
    validationForm() {
      const app = this
      app.load = true
      this.$store.dispatch('user/confirmOTP', { id: app.userId, token: app.token })
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Login Success',
              icon: 'BellIcon',
              variant: 'success',
              text: 'Welcome',
            },
          })

          // we load the browser this once
          window.location = '/' // this.$router.push({ path: '/' }).catch(() => {}) // window.location = '/dashboard/ecommerce'

          app.load = false
        })
        .catch(error => {
          app.$message({
            message: error.response.data.message,
            type: 'error',
          })
          app.load = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
