<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Login-->
      <b-col
        v-loading="loader"
        lg="12"
        class="align-items-center auth-bg px-2 p-lg-2"
      >
        <form-wizard
          color="#7367F0"
          :title="null"
          :subtitle="null"
          shape="circle"
          step-size="xs"
          finish-button-text="Submit"
          back-button-text="Previous"
          class="wizard-vertical mb-3"
          @on-complete="formSubmitted"
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
                <b-col md="6">
                  <b-form-group
                    label="Full Name"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Full Name"
                      rules="required"
                    >
                      <b-form-input
                        id="name"
                        v-model="form.name"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Enter Full Name"
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
                        v-model="form.email"
                        placeholder="Enter Email Address"
                        :state="errors.length > 0 ? false:null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
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
                        v-model="form.phone"
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
                      v-model="form.designation"
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
  props: {
    selectedVendorUser: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      form: {
        id: '',
        name: '',
        email: '',
        phone: '',
        designation: '',
        required,
      },
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
    this.setFormProperties(this.selectedVendorUser)
  },
  methods: {
    setFormProperties(selectedVendor) {
      const app = this
      app.form = selectedVendor
    },
    formSubmitted() {
      const app = this
      const registerResource = new Resource('vdd/update-vendor-user')
      const { form } = app
      app.loader = true
      // const email = form.admin_email
      registerResource.update(form.id, form)
        .then(() => {
          app.loader = false
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Data updated',
              icon: 'CheckIcon',
              variant: 'success',
            },
          })

          // app.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          // app.$alert(`<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`, 'Confirmation Link Sent', {
          //   dangerouslyUseHTMLString: true,
          // })
          // this.$router.push({ path: '/login' })
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
</style>
