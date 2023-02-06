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
            width="100"
            class="mx-auto"
          >
        </b-link>

        <b-card-title class="mb-1">
          Reset Password 🔒
        </b-card-title>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            method="POST"
            class="auth-reset-password-form mt-2"
            @submit.prevent="validationForm"
          >

            <!-- password -->
            <b-form-group
              label="New Password"
              label-for="reset-password-new"
            >
              <validation-provider
                #default="{ errors }"
                name="Password"
                vid="Password"
                rules="required|password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="reset-password-new"
                    v-model="password"
                    :type="password1FieldType"
                    :state="errors.length > 0 ? false:null"
                    class="form-control-merge"
                    name="reset-password-new"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password1ToggleIcon"
                      @click="togglePassword1Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- confirm password -->
            <b-form-group
              label-for="reset-password-confirm"
              label="Confirm Password"
            >
              <validation-provider
                #default="{ errors }"
                name="Confirm Password"
                rules="required|confirmed:Password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="cPassword"
                    :type="password2FieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="reset-password-confirm"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              block
              type="submit"
              variant="primary"
            >
              Set New Password
            </b-button>
          </b-form>
        </validation-observer>

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
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BCard, BCardTitle, BForm, BFormGroup, BInputGroup, BInputGroupAppend, BLink, BFormInput, BButton,
} from 'bootstrap-vue'
import { required } from '@validations'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BButton,
    BCardTitle,
    BForm,
    BFormGroup,
    BInputGroup,
    BLink,
    BFormInput,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      userEmail: '',
      cPassword: '',
      password: '',
      load: false,
      required,

      // Toggle Password
      password1FieldType: 'password',
      password2FieldType: 'password',
    }
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  created() {
    this.confirmToken()
  },
  methods: {
    confirmToken() {
      const app = this
      const { token } = app.$route.params
      const confirmTokenResource = new Resource('auth/confirm-password-reset-token')
      app.load = true
      confirmTokenResource.get(token)
        .then(response => {
          app.userEmail = response.email
          app.load = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.message)
          app.load = false
        })
    },
    togglePassword1Visibility() {
      this.password1FieldType = this.password1FieldType === 'password' ? 'text' : 'password'
    },
    togglePassword2Visibility() {
      this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password'
    },
    validationForm() {
      const app = this
      app.load = true
      this.$store.dispatch('user/updatePassword', { email: app.userEmail, new_password: app.password })
        .then(() => {
          app.$message({
            message: 'Password Reset Successfull',
            type: 'success',
          })
          app.load = false
          this.$router.push({ path: '/login' })
        })
        .catch(error => {
          // console.log(error.response)
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
