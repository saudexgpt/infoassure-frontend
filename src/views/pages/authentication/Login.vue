<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login-->
      <b-card
        class="mb-0"
      >

        <b-card-title
          class="mb-1 font-weight-bold"
          title-tag="h2"
          align="center"
        >
          <img
            src="/images/logo/logo.png"
            alt="logo"
            width="300"
            class="mx-auto"
          >
        </b-card-title>
        <div v-if="confirm_otp">
          <confirm-o-t-p
            :user-id="userId"
          />
        </div>
        <div v-else>
          <el-alert
            v-if="password_updated"
            title="Login with your updated password"
            type="secondary"
          />
          <b-form
            v-if="!reset_password"
            v-loading="loading"
            class="auth-login-form mt-2"
            @submit.prevent="login"
          >
            <!-- email -->
            <b-form-group
              label-for="login-email"
            >
              <div
                class="form-label-group"
              >
                <b-form-input
                  id="login-email"
                  v-model="userEmail"
                  name="login-email"
                  placeholder="Email or Phone"
                />
                <label for="login-email">Email or Phone</label>

              </div>
            </b-form-group>

            <!-- forgot password -->
            <b-form-group>
              <b-input-group
                class="form-label-group"
              >
                <b-form-input
                  id="login-password"
                  v-model="password"
                  class="form-control-merge"
                  :type="passwordFieldType"
                  name="login-password"
                  placeholder="Password"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    class="cursor-pointer"
                    :icon="passwordToggleIcon"
                    @click="togglePasswordVisibility"
                  />
                </b-input-group-append>
              </b-input-group>
              <div class="d-flex justify-content-between">
                <b-link :to="{name:'ForgotPassword'}">
                  <small>Forgot Password?</small>
                </b-link>
              </div>
            </b-form-group>
            <b-button
              variant="secondary"
              block
              @click="login"
            >
              Log in
            </b-button>
            <b-card-text class="text-center mt-2">
              <br>
              <span>Don't have an account? </span>
              <b-link :to="{name:'UserRegistration'}">
                <span>&nbsp;Sign Up</span>
              </b-link>
            </b-card-text>
            <!-- <b-card-text class="text-center mt-2">
                <span>Want to be a marketing partner? </span>
                <b-link to="register-partner">
                  <span>&nbsp;Click Here</span>
                </b-link>
              </b-card-text> -->
          </b-form>
          <el-alert
            v-if="reset_password"
            :title="title"
            type="error"
            :closable="false"
          />
          <validation-observer>
            <b-form
              v-if="reset_password"
              v-loading="loading"
              method="POST"
              class="auth-login-form mt-2"
              @submit.prevent="updatePassword"
            >
              <!-- email -->
              <b-form-group
                label-for="login-email"
              >
                <b-form-input
                  id="login-email"
                  v-model="form.email"

                  name="login-email"
                  placeholder="Enter username"
                  disabled
                />
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="Password"
                  rules="required|password|min:9"
                >
                  <b-input-group
                    class="input-group-merge"
                  >
                    <b-form-input
                      v-model="form.new_password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="New Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
                >
                  <b-input-group
                    class="input-group-merge"
                  >
                    <b-form-input
                      v-model="form.confirm_password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="Confirm Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-button
                variant="secondary"
                block
                @click="updatePassword"
              >
                Update Password
              </b-button>
              <br>
              <!-- <a href="/dashboard">
                  I will do that later from my profile
                </a> -->
            </b-form>
          </validation-observer>
        </div>
      </b-card>
      <!-- /Login-->
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BCard, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BCardTitle, BForm, BButton, BLink, VBTooltip, BCardText,
} from 'bootstrap-vue'
  // import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'
// import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import { isUserLoggedIn } from '@/utils/auth' // get token from cookie
import ConfirmOTP from './ConfirmOTP.vue'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BCardText,
    // BFormCheckbox,
    BCardTitle,
    BForm,
    BButton,
    ConfirmOTP,
    // BCardText,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      title: '',
      status: '',
      password: '',
      userEmail: '',
      sideImg: require('@/assets/images/pages/login/landingPage.jpg'),

      // validation rules
      required,
      email,
      loading: false,
      reset_password: false,
      form: {
        email: '',
        new_password: '',
        confirm_password: '',
        message: '',
      },
      password_updated: false,
      confirm_otp: false,
      userId: null,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    isLoggedIn() {
      // If user is already logged in notify
      if (isUserLoggedIn) {
        return true
      }
      return false
    },
    login() {
      // Loading
      this.loading = true

      const userDetails = {

        username: this.userEmail,
        password: this.password,
        // remember_me: this.checkbox_remember_me,

      }
      this.$store
        .dispatch('user/login', userDetails)
        .then(response => {
          this.loading = false
          if (response.message === 'OTP') {
            this.userId = response.user.id
            this.confirm_otp = true
          } else if (response.message === 'change_password') {
            this.reset_password = true
            this.form.email = response.user.email
            this.form.id = response.user.id
            this.title = response.title
          } else if (response.message === 'password_due_for_change') {
            this.reset_password = true
            this.form.email = response.user.email
            this.form.id = response.user.id
            this.title = response.title
            this.form.message = 'password_due_for_change'
          } else {
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
            window.location = '/'
            // this.$router.push({ path: '/dashboard' }).catch(() => {}) // window.location = '/dashboard/ecommerce'
          }
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Error', // .response.statusText,
              icon: 'AlertTriangleIcon',
              variant: 'danger',
              text: error.response.data.message,
            },
          })
          // console.log(error)
        })
    },
    updatePassword() {
      const app = this
      if (app.form.new_password === app.password) {
        app.$alert('New password MUST be different from the old one')
      } else if (app.form.confirm_password === app.form.new_password && app.form.new_password !== '') {
        app.loading = true
        this.$store.dispatch('user/updatePassword', app.form)
          .then(() => {
            app.loading = false
            app.$message('Password Reset Successful')
            app.password_updated = true
            app.reset_password = false
            app.password = ''
          }).catch(error => {
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: 'Error', // .response.statusText,
                icon: 'AlertTriangleIcon',
                variant: 'danger',
                text: error.response.data.message,
              },
            })
            app.loading = false
          })
      } else {
        app.$alert('New Password does not match')
      }
    },
  },
}
</script>

  <style lang="scss">
  @import '@core/scss/vue/pages/page-auth.scss';
  </style>
  <style scoped>
  .no-padding {
    padding: 0 !important;
  }
  .card {
    border-top-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  </style>
