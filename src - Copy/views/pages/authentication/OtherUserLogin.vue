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
            width="150"
            class="mx-auto"
          >
        </b-link>
        <!-- form -->
        <b-card-title
          class="mb-1"
          align="center"
        >
          Check In
        </b-card-title>

        <b-form
          class="auth-forgot-password-form mt-2"
          @submit.prevent="submitForm"
        >
          <b-form-group
            label="Email"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="form.email"
              name="email"
              placeholder="john@example.com"
            />
          </b-form-group>
          <b-form-group
            label="Password"
            label-for="password"
          >
            <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              name="password"
              placeholder="Password"
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

        <!-- <p class="text-center mt-2">
          <b-link :to="{name:'page-login'}">
            <feather-icon icon="ChevronLeftIcon" /> Back to login
          </b-link>
        </p> -->
      </b-card>
    <!-- /Reset Password v1 -->
    </div>
  </div>

</template>

<script>
import {
  BCard, BCardTitle, BForm, BFormGroup, BLink, BFormInput, BButton,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BButton,
    BCardTitle,
    BForm,
    BFormGroup,
    BLink,
    BFormInput,
  },
  props: {
    productModule: {
      type: String,
      default: () => (''),
    },
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        product_module: 'vdd',
      },
      load: false,
    }
  },
  created() {
    this.form.product_module = this.productModule
  },
  methods: {
    submitForm() {
      const app = this
      app.load = true
      const { form } = app
      this.$store
        .dispatch('user/otherUserLogin', form)
        .then(response => {
          app.$message({
            message: response.message,
            type: 'success',
          })
          app.form = {
            email: '',
            password: '',
          }
          app.load = false
          window.location = app.$route.path
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
