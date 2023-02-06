<template>
  <div>
    <div class="auth-wrapper auth-v1 px-1">
      <div class="auth-inner py-1">

        <!-- Login v1 -->
        <b-card
          v-loading="load"
          class="mb-0"
        >
          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
            align="center"
          >
            <h1>{{ message }}</h1>
          </b-card-title>
          <b-card-text
            v-if="message !== ''"
            class="text-center mt-2"
          >
            <b-link :to="{name:'page-login'}">
              <span>Click here to sign in</span>
            </b-link>
          </b-card-text>
        </b-card>
      <!-- /Login v1 -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import {
  BCard, BCardTitle, BCardText, BLink, VBTooltip,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BCardTitle,
    BCardText,
    BLink,
  },
  data() {
    return {
      message: '',
      load: false,
    }
  },
  created() {
    this.confirmRegistration()
  },
  methods: {
    confirmRegistration() {
      const app = this
      const { code } = app.$route.params
      const confirmCodeResource = new Resource('auth/confirm-registration')
      app.load = true
      confirmCodeResource.get(code)
        .then(response => {
          app.message = response
          app.load = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.load = false
        })
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
</style>
