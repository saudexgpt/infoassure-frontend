<template>
  <div class="auth-wrapper auth-v2">
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
          <h4>Kindly fill the form below to register a Vendor</h4>
        </div>

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
          <!-- personal details tab -->
          <tab-content
            title="Company Information"
            :before-change="validationFormInfo"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="6">
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
                        placeholder="Example Company Ltd."
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    label="Contact Email"
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
                        placeholder="example@domain.com"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    label="Contact Phone Number"
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
                <b-col md="6">
                  <b-form-group
                    label="Contact Address"
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
          <tab-content
            title="User Information"
          >
            <validation-observer
              ref="administratorRules"
              tag="form"
            >
              <!-- <b-row>
                <b-col md="12">
                  <b-form-group
                    label="Select Company"
                    label-for="vendor_id"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Company"
                      rules="required"
                    >
                      <el-select
                        id="vendor_id"
                        v-model="form.vendor_id"
                        :state="errors.length > 0 ? false:null"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="(client, index) in vendors"
                          :key="index"
                          :value="client.id"
                          :label="client.name"
                        />
                      </el-select>
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row> -->
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
                        v-model="form.admin_first_name"
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
                        v-model="form.admin_last_name"
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
                        v-model="form.admin_email"
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
                        v-model="form.admin_phone"
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
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      vendors: [],
      form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        role: 'vendor',
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
        admin_phone: '',
        designation: '',
        role: 'vendor',
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
  mounted() {},
  methods: {
    formSubmitted() {
      const app = this
      const registerResource = new Resource('vdd/register-vendor')
      const { form } = app
      app.loader = true
      // const email = form.admin_email
      registerResource.store(form)
        .then(response => {
          app.vendors.push(response.vendor)
          app.loader = false
          app.$alert(`Vendor created successfully and notification is sent to ${form.admin_email}`)
          app.form = app.empty_form
          // app.$toast({
          //   component: ToastificationContent,
          //   props: {
          //     title: 'Vendor mounted Successfully',
          //     icon: 'CheckIcon',
          //     variant: 'success',
          //   },
          // })

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
