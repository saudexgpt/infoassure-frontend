<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
      <b-card
        v-loading="load"
        class="mb-0"
      >

        <!-- logo -->
        <b-link class="brand-logo">
          <img
            src="/images/logo/logo.png"
            alt="logo"
            width="300"
            class="mx-auto"
          >
        </b-link>
        <!-- form -->
        <b-card-title class="mb-1">
          🔒 Forgot Password?
        </b-card-title>
        <b-card-text class="mb-2">
          Enter your email and we'll guide you on how to reset your password
        </b-card-text>

        <b-form
          class="auth-forgot-password-form mt-2"
          @submit.prevent="validationForm"
        >
          <b-form-group
            label="Email"
            label-for="forgot-password-email"
          >
            <b-form-input
              id="forgot-password-email"
              v-model="userEmail"
              name="forgot-password-email"
              placeholder="john@example.com"
            />
          </b-form-group>
          <!-- <b-form-group>
            <vue-recaptcha
              :sitekey="recaptchaSiteKey"
              :load-recaptcha-script="true"
              @verify="validate"
            />
          </b-form-group> -->
          <div
            id="recaptcha-2"
            class="g-recaptcha"
            :data-sitekey="recaptchaSiteKey"
          />
          <br>
          <b-button
            type="submit"
            variant="primary"
            block
          >
            Send reset link
          </b-button>
        </b-form>

        <p class="text-center mt-2">
          <b-link :to="{name:'page-login'}">
            <feather-icon icon="ChevronLeftIcon" /> Back to login
          </b-link>
        </p>
      </b-card>
    <!-- /Reset Password v1 -->
    </div>
  </div>

</template>

<script>
import {
  BCard, BCardTitle, BCardText, BForm, BFormGroup, BLink, BFormInput, BButton,
} from 'bootstrap-vue'
// import VueRecaptcha from 'vue-recaptcha'
import Resource from '@/api/resource'

export default {
  components: {
    // VueRecaptcha,
    BCard,
    BButton,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BLink,
    BFormInput,
  },
  data() {
    return {
      userEmail: '',
      load: false,
    }
  },
  computed: {
    recaptchaSiteKey() {
      return process.env.VUE_APP_MIX_RECAPTCHA_SITE_KEY
    },
  },
  mounted() {
    this.$nextTick(() => {
      // eslint-disable-next-line no-undef
      grecaptcha.render('recaptcha-2')
    })
  },
  methods: {
    validate(response) {
      console.log(response)
      // Validation.validate({ Response: response }).then(result => {
      //   this.$emit('validate', result.objectResult.success)
      // }).catch(error => console.log(error))
    },
    validationForm() {
      const app = this
      const confirmEmailResource = new Resource('auth/recover-password')
      app.load = true
      confirmEmailResource.store({ email: app.userEmail })
        .then(response => {
          app.$message({
            message: response.message,
            type: 'success',
          })
          app.userEmail = ''
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
