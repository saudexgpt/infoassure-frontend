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
        <!-- form -->
        <b-card-title
          class="mb-1"
          align="center"
        >
          🔒 Login As
        </b-card-title>

        <b-form
          class="auth-forgot-password-form mt-2"
        >
          <b-form-group
            label="Select Role"
            label-for="forgot-password-email"
          >
            <el-select
              v-model="selectedRole"
              style="width: 100%;"
              placeholder="Select Role"
              @input="setRole()"
            >
              <el-option
                v-for="(role, index) in user.all_roles"
                :key="index"
                :value="role"
                :label="role.toUpperCase()"
              />
            </el-select>
            <b-link @click="loadUser()">
              <small>No role displayed? click to reload</small>
            </b-link>
          </b-form-group>
          <b-form-group
            v-if="partners.length > 0"
            label="Select Partner"
          >
            <el-select
              v-model="selectedPartner"
              style="width: 100%;"
              placeholder="Select Company"
              @input="loginAs()"
            >
              <el-option
                v-for="(partner, index) in partners"
                :key="index"
                :value="partner.id"
                :label="partner.name"
              />
            </el-select>
          </b-form-group>
          <b-form-group
            v-if="clients.length > 0"
            label="Select Client"
          >
            <el-select
              v-model="selectedClient"
              style="width: 100%;"
              placeholder="Select Company"
              @input="loginAs()"
            >
              <el-option
                v-for="(client, index) in clients"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
          </b-form-group>
        </b-form>
      </b-card>
    <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import {
  BCard, BCardTitle, BForm, BFormGroup, BLink,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard, BCardTitle, BForm, BFormGroup, BLink,
  },
  data() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      // avatarText,
      // resolveUserRoleVariant,
      selectedRole: '',
      selectedPartner: null,
      selectedClient: null,
      partners: [],
      clients: [],
      dialogVisible: false,
      load: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    user() {
      return this.$store.getters.userData
    },
  },
  created() {
    this.loadUser()
  },
  methods: {
    loadUser() {
      const app = this
      app.load = true
      app.$store.dispatch('user/getInfo')
      setTimeout(() => {
        app.load = false
      }, 2000)
    },
    setRole() {
      const app = this
      app.clients = []
      app.partners = []
      const { selectedRole } = app
      switch (selectedRole) {
        case 'super':
          app.loginAs()
          break
        case 'admin':
          // app.loginAs('admin')
          app.fetchUserClients()
          break
        case 'partner':
          app.fetchUserPartners()
          break
        case 'client':
          app.fetchUserClients()
          break
        default:
          break
      }
    },
    loginAs() {
      const app = this
      app.load = true
      const userResource = new Resource('auth/login-as')
      userResource
        .store({ partner_id: app.selectedPartner, client_id: app.selectedClient, role: app.selectedRole })
        .then(response => {
          app.$store.dispatch('user/updateUserData', response.data)
          app.$toast({
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
          window.location = '/dashboard'
        })
        .catch(error => {
          console.log(error)
          this.load = false
        })
    },
    fetchUserPartners() {
      const app = this
      app.load = true
      const userPartnerResource = new Resource('partners/fetch-user-partners')
      userPartnerResource
        .list()
        .then(response => {
          app.partners = response.partners
          this.load = false
        })
        .catch(error => {
          console.log(error)
          this.load = false
        })
    },
    fetchUserClients() {
      const app = this
      app.load = true
      const userResource = new Resource('clients/fetch-user-clients')
      userResource
        .list()
        .then(response => {
          app.clients = response.clients
          this.load = false
        })
        .catch(error => {
          console.log(error)
          this.load = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
