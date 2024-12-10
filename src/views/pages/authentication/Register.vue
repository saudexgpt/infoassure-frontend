<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login-->
      <b-card
        v-loading="loader"
        class="mb-0"
      >
        <form-wizard
          color="#bb9002"
          title="SIGN UP FORM"
          subtitle="Kindly provide the information below"
          shape="circle"
          step-size="xs"
          finish-button-text="Submit"
          back-button-text="Previous"
          next-button-text="Continue"
          class="wizard-vertical mb-3"
          @on-complete="formSubmitted"
        >
          <!-- personal details tab -->
          <tab-content
            title="Company Information"
            icon="feather icon-home"
            :before-change="validationFormInfo"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="12">
                  <b-form-group
                    label="Name of Organization"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Name of Organization"
                      rules="required"
                    >
                      <b-form-input
                        id="name"
                        v-model="form.organization_name"
                        :state="errors.length > 0 ? false:null"
                        placeholder="ABC Company Ltd."
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Company Email"
                    label-for="email"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Contact Email"
                      rules="required|email"
                    >
                      <b-form-input
                        id="email"
                        v-model="form.contact_email"
                        :state="errors.length > 0 ? false:null"
                        placeholder="example@companydomain.com"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Official Phone Number"
                    label-for="phone"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Contact Phone Number"
                      rules="required|integer:min:11|integer:max:11"
                    >
                      <b-form-input
                        id="phone"
                        v-model="form.contact_phone"
                        :state="errors.length > 0 ? false:null"
                        placeholder="08012345678"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Company Address"
                    label-for="website"
                  >
                    <b-form-input
                      id="website"
                      v-model="form.contact_address"
                      placeholder="123 Tom Dick and Harry Close, Lagos, Nigeria"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
          <!-- Admission details tab -->
          <tab-content
            title="Personal Information"
            icon="feather icon-user"
            :before-change="validationFormAdministrator"
          >
            <validation-observer
              ref="administratorRules"
              tag="form"
            >
              <b-row>
                <b-col md="12">
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
                        v-model="form.admin_first_name"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Enter First Name"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
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
                        v-model="form.admin_last_name"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Enter Last Name"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Valid Email"
                    label-for="email"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Email"
                      rules="required|email"
                    >
                      <b-form-input
                        id="email"
                        v-model="form.admin_email"
                        placeholder="Enter Email Address"
                        :state="errors.length > 0 ? false:null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                      <small class="text-primary"><strong>On successful registration a notification will be sent to this e-mail</strong></small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Mobile Number"
                    label-for="phone"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Phone Number"
                      rules="required|integer:min:11|integer:max:11"
                    >
                      <b-form-input
                        id="phone"
                        v-model="form.admin_phone"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Enter Phone Number"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Designation"
                    label-for="designation"
                    rules="integer:min:11|integer:max:11"
                  >
                    <b-form-input
                      id="phone2"
                      v-model="form.designation"
                      placeholder="Your designation at work"
                    />
                  </b-form-group>
                </b-col>
                <!-- <b-col md="12">
                  <b-form-group
                    label="Create Password"
                    label-for="password"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Password"
                      vid="Password"
                      rules="required|password"
                    >
                      <b-input-group
                        class="input-group-merge"
                      >
                        <b-form-input
                          id="login-password"
                          v-model="form.password"
                          class="form-control-merge"
                          :type="passwordFieldType"
                          name="login-password"
                          placeholder="Create Password"
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
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Confirm Password"
                    label-for="cpassword"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Confirm Password"
                      rules="required|confirmed:Password"
                    >
                      <b-input-group
                        class="input-group-merge"
                      >
                        <b-form-input
                          id="login-password"
                          v-model="form.cpassword"
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
                </b-col> -->
              </b-row>
            </validation-observer>
          </tab-content>
        </form-wizard>
        <b-card-text class="text-center mt-2">
          <br>
          <span>Already with us? </span>
          <b-link to="/login">
            <span>&nbsp;Sign In</span>
          </b-link>
        </b-card-text>
      </b-card>
    <!-- /Login-->
    </div>
  </div>
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
  BCardText,
  BFormInput,
  BCard,
  BLink,
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
    BCardText,
    BFormGroup,
    BFormInput,
    BCard,
    BLink,
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
      form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        password: '',
        cpassword: '',
        admin_phone: '',
        designation: '',
        role: 'admin',
        required,
      },
      empty_form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        password: '',
        cpassword: '',
        admin_phone: '',
        designation: '',
        role: 'admin',
        required,
      },
      genders: ['Male', 'Female'],
      loader: false,
      imgUrl: require('@/assets/images/pages/login/lms2.jpg'),
      passwordFieldType: 'password',
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  created() {
  },
  methods: {
    formSubmitted() {
      const app = this
      const registerResource = new Resource('auth/register-client')
      const { form } = app
      app.loader = true
      const email = form.admin_email
      registerResource.store(form)
        .then(() => {
          app.form = app.empty_form
          app.loader = false
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Registration Successful',
              icon: 'CheckIcon',
              variant: 'success',
            },
          })

          // app.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          app.$alert(`<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`, 'Confirmation Link Sent', {
            dangerouslyUseHTMLString: true,
          })
          this.$router.push({ path: '/login' })
          // send mail
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
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then(success => {
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
.card {
  border-top-left-radius: 30px;
  border-bottom-right-radius: 30px;
}
</style>
