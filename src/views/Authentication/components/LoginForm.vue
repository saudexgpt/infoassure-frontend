<template>
  <div>
    <div class="mt-100px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <!-- form -->
      <div v-if="!reset_password">
        <div class="text-center mb-4">
          <h2 class="text-3xl font-bold"><icon icon="tabler:lock-password" size="35" /> Sign In</h2>
        </div>
        <el-alert
          v-if="password_updated"
          title="Login with your updated password"
          type="success"
          :closable="false"
        />
        <br />
        <v-text-field
          v-model="userEmail"
          type="email"
          label="Email or Phone"
          variant="outlined"
          required
        />

        <v-text-field
          v-model="password"
          :type="show1 ? 'text' : 'password'"
          variant="outlined"
          label="Password"
        >
          <template v-slot:append-inner>
            <icon
              @click="show1 = !show1"
              :icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
              class="cursor-pointer"
            />
          </template>
        </v-text-field>
        <RouterLink class="el-link el-link--primary mb-15px" to="/forgot-password">
          Forgot Password?
        </RouterLink>

        <!-- <el-Button type="primary" class="w-[100%]" size="large" :loading="loading" @click="login">
          Log In
        </el-Button> -->
        <v-btn
          :disabled="loading"
          color="black"
          text="Login"
          block
          :loading="loading"
          @click="login"
        />
        <br />

        <p class="text-center mt-5">
          Don't have an account?
          <RouterLink class="el-link el-link--primary" to="/register">Sign Up</RouterLink>
        </p>
      </div>
      <div v-if="reset_password">
        <h2 class="text-2xl font-bold text-left w-[100%] mb-15px">Password Change Required</h2>
        <el-alert :title="title" type="error" :closable="false" />
        <br />
        <!-- <v-text-field v-model="userEmail" label="Email" variant="outlined" disabled /> -->

        <v-text-field
          v-model="form.new_password"
          :type="show1 ? 'text' : 'password'"
          variant="outlined"
          label="New Password"
          :error-messages="v$.form.new_password.$errors.map((e) => e.$message)"
          @blur="v$.form.new_password.$touch"
        >
          <template v-slot:append-inner>
            <icon
              @click="show1 = !show1"
              :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              class="cursor-pointer"
            />
          </template>
        </v-text-field>
        <br />
        <v-text-field
          v-model="form.confirm_password"
          :type="show1 ? 'text' : 'password'"
          variant="outlined"
          label="Confirm Password"
          :error-messages="v$.form.confirm_password.$errors.map((e) => e.$message)"
          @blur="v$.form.confirm_password.$touch"
        >
          <template v-slot:append-inner>
            <icon
              @click="show1 = !show1"
              :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              class="cursor-pointer"
            />
          </template>
        </v-text-field>
        <br />

        <el-Button
          type="success"
          class="w-[100%]"
          size="large"
          :loading="loading"
          @click="updatePassword"
        >
          Update Password
        </el-Button>
      </div>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs } from '@validations'
// import { usePermissionStore } from '@/store/modules/permission'
// import { RouterLink, useRouter } from 'vue-router'
// const permissionStore = usePermissionStore()
// const { currentRoute, addRoute, push } = useRouter()
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      title: '',
      status: '',
      password: '',
      userEmail: '',
      loading: false,
      reset_password: false,
      form: {
        email: '',
        new_password: '',
        confirm_password: '',
        message: ''
      },
      password_updated: false,
      confirm_otp: false,
      userId: null,
      show1: false
    }
  },
  validations() {
    return {
      form: {
        new_password: { required, minLength: minLength(8) },
        confirm_password: { required, sameAsPassword: sameAs(this.form.new_password) }
      }
    }
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
        password: this.password
        // remember_me: this.checkbox_remember_me,
      }
      this.$store
        .dispatch('user/login', userDetails)
        .then((response) => {
          this.loading = false
          if (response.message === 'OTP') {
            this.userId = response.user.id
            this.$emit('to-otp')
            this.$emit('loggedInUserId', response.user.id)
          } else if (response.message === 'change_password') {
            this.reset_password = true
            this.form.email = response.user.email
            this.form.id = response.user.id
            this.title = 'Change your password from the default one'
          } else if (response.message === 'password_due_for_change') {
            this.reset_password = true
            this.form.email = response.user.email
            this.form.id = response.user.id
            this.title = 'Your password is due for a change'
            this.form.message = 'password_due_for_change'
          } else {
            // if (appStore.getDynamicRouter) {
            //   getRole()
            // } else {
            //   permissionStore.generateRoutes('static').catch(() => {})
            //   permissionStore.getAddRouters.forEach((route) => {
            //     addRoute(route)
            //   })
            //   permissionStore.setIsAddRouters(true)
            //   push({ path: redirect.value || permissionStore.addRouters[0].path })
            // }
            this.$message({
              title: 'Login Success',
              icon: 'BellIcon',
              type: 'success',
              message: 'Welcome'
            })
            // we load the browser this once
            window.location = '/'
            // this.$router.push({ path: '/dashboard/analysis' }).catch(() => {}) // window.location = '/dashboard/ecommerce'
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            title: 'Error', // .response.statusText,
            icon: 'AlertTriangleIcon',
            type: 'error',
            message: error.response.data.message
          })
          // console.log(error)
        })
    },
    updatePassword() {
      if (this.form.new_password === this.password) {
        this.$alert('New password MUST be different from the old one')
        return false
      }

      if (this.form.confirm_password !== this.form.new_password && this.form.new_password !== '') {
        this.$alert('New Password does not match')
        return false
      }
      this.loading = true
      this.$store
        .dispatch('user/updatePassword', this.form)
        .then(() => {
          this.loading = false
          this.$message('Password Reset Successful')
          this.password_updated = true
          this.reset_password = false
          this.password = ''
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loading = false
        })
    }
  }
}
</script>
