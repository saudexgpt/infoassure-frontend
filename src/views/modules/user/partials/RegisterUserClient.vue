<template>
  <b-row class="auth-inner m-0">

    <!-- Login-->
    <b-col
      v-loading="loader"
      lg="12"
      class="align-items-center auth-bg px-2 p-lg-2"
    >
      <div
        class="mb-1 font-weight-bold"
        title-tag="h2"
      >
        <h4>Kindly fill the form below to register a user</h4>
      </div>
      <form-wizard
        color="#000000"
        :title="null"
        :subtitle="null"
        shape="circle"
        step-size="xs"
        finish-button-text="Submit User"
        back-button-text="Previous"
        class="wizard-vertical mb-3"
        @on-complete="submitClientUser"
      >
        <!-- Admission details tab -->
        <tab-content
          title="User Information"
          :before-change="validationFormAdministrator"
        >
          <validation-observer
            ref="administratorRules"
            tag="form"
          >
            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Select Company"
                  label-for="client_id"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Company"
                    rules="required"
                  >
                    <el-select
                      id="client_id"
                      v-model="clientUserform.client_id"
                      :state="errors.length > 0 ? false:null"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(client, index) in clients"
                        :key="index"
                        :value="client.id"
                        :label="client.name"
                      />
                    </el-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <b-form-group
                  label="First Name"
                  label-for="first_name"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="First Name"
                    rules="required"
                  >
                    <b-form-input
                      id="first_name"
                      v-model="clientUserform.admin_first_name"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Enter First Name"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Last Name"
                  label-for="last_name"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Last Name"
                    rules="required"
                  >
                    <b-form-input
                      id="last_name"
                      v-model="clientUserform.admin_last_name"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Enter Last Name"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Valid Email"
                  label-for="email"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Email"
                    rules="required"
                  >
                    <b-form-input
                      id="email"
                      v-model="clientUserform.email"
                      placeholder="Enter Email Address"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small><br>
                    <small class="text-primary"><strong>On successful registration a notification will be sent to this e-mail</strong></small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Phone Number"
                  label-for="phone"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Phone Number"
                    rules="required|integer:min:11|integer:max:11"
                  >
                    <b-form-input
                      id="phone"
                      v-model="clientUserform.phone"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Enter Phone Number"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Designation"
                  label-for="designation"
                  rules="integer:min:11|integer:max:11"
                >
                  <b-form-input
                    id="phone2"
                    v-model="clientUserform.designation"
                    placeholder="Your designation at work"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </validation-observer>
        </tab-content>
      </form-wizard>
    </b-col>
    <!-- /Login-->
  </b-row>
</template>

<script>
/* eslint-disable global-require */
import { FormWizard, TabContent } from 'vue-form-wizard'
// import vSelect from 'vue-select'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  // BInputGroupAppend,
  // BInputGroup,
  // BAlert,
} from 'bootstrap-vue'
import { required } from '@validations'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    // BInputGroupAppend,
    // BInputGroup,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  mixins: [togglePasswordVisibility],
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      clients: [],
      form: {
        client_id: '',
        user_id: '',
      },
      clientUserform: {
        client_id: '',
        admin_first_name: '',
        admin_last_name: '',
        email: '',
        phone: '',
        designation: '',
        role: 'client',
        login_as: 'client',
        required,
      },
      empty_clientUserform: {
        client_id: '',
        admin_first_name: '',
        admin_last_name: '',
        email: '',
        phone: '',
        designation: '',
        role: 'client',
        login_as: 'client',
        required,
      },
      users: [],
      genders: ['Male', 'Female'],
      loader: false,
      imgUrl: require('@/assets/images/pages/login/lms2.jpg'),
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  created() {
    this.fetchClients()
    this.fetchClientUsers()
  },
  methods: {
    fetchClients() {
      const app = this
      const fetchClientResource = new Resource('clients')
      fetchClientResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    fetchClientUsers() {
      const app = this
      const fetchPartnerResource = new Resource('users/fetch-client-users')
      fetchPartnerResource.list()
        .then(response => {
          app.users = response.users
        })
    },
    attachClientUser() {
      const app = this
      const fetchPartnerResource = new Resource('clients/attach-client-user')
      fetchPartnerResource.update(app.form.client_id, { user_id: app.form.user_id })
        .then(() => {
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'User Attached Successful',
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
        })
    },
    submitClientUser() {
      const app = this
      const registerResource = new Resource('clients/register-client-user')
      const { clientUserform } = app
      app.loader = true
      const { email } = app.clientUserform
      registerResource.store(clientUserform)
        .then(() => {
          app.$alert(`A confirmation link has been sent to ${email}`)
          app.$emit('saved')
          app.clientUserform = app.empty_clientUserform
          app.loader = false
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Client User Registration Successful',
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
        }).catch(error => {
          console.log(error)
          app.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.message,
              icon: 'XOctagonIcon',
              variant: 'danger',
            },
          })

          app.loader = false
        })
    },
    validationFormAdministrator() {
      return new Promise((resolve, reject) => {
        this.$refs.administratorRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
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
