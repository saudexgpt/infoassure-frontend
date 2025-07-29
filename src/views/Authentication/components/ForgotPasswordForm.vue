<template>
  <div>
    <div class="mt-100px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <!-- form -->
      <h2 class="text-2xl font-bold text-left w-[100%] mb-15px"> 🔒 Forgot Password? </h2>
      <div class="font-normal text-14px italic mb-15px">
        Don't worry! We all do sometimes. Enter your email and we'll guide you on how to reset your
        password
      </div>

      <el-form-group label="Email" label-for="forgot-password-email">
        <v-text-field
          v-model="userEmail"
          type="email"
          label="Enter Email"
          variant="outlined"
          placeholder="john@example.com"
          required
        />
        <!-- <el-input
          id="forgot-password-email"
          v-model="userEmail"
          type="email"
          size="large"
          name="forgot-password-email"
          placeholder="john@example.com"
        /> -->
      </el-form-group>
      <el-form-group>
        <Recaptcha ref="recaptcha" @verify="validate" />
      </el-form-group>
      <br />
      <ElButton
        type="primary"
        class="w-[100%]"
        size="large"
        :loading="load"
        :disabled="userEmail === ''"
        @click="executeRecaptcha"
      >
        Send reset link
      </ElButton>

      <p class="text-center mt-5">
        <RouterLink class="el-link el-link--primary" to="/login">Back to login</RouterLink>
      </p>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import Recaptcha from '@/views/Components/Recaptcha.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Recaptcha
  },
  data() {
    return {
      userEmail: '',
      g_recaptcha_response: '',
      load: false
    }
  },
  mounted() {
    // console.log(this.$router)
  },
  methods: {
    validate(response) {
      this.g_recaptcha_response = response
      // console.log(response)
      this.submit()
    },
    // execute the recaptcha widget
    executeRecaptcha() {
      this.$refs.recaptcha.execute()
    },
    submit() {
      const confirmEmailResource = new Resource('auth/recover-password')
      this.load = true
      confirmEmailResource
        .store({ email: this.userEmail, recaptcha: this.g_recaptcha_response })
        .then((response) => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.userEmail = ''
          this.$refs.recaptcha.reset()
          this.load = false
          this.$emit('to-login')
        })
        .catch((error) => {
          this.$refs.recaptcha.reset()
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
