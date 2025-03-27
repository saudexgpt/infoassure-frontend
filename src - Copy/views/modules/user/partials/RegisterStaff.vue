<template>
  <div v-loading="loader">
    <b-card class="mb-0">
      <!-- <div align="center">
        <img
          src="/logo.png"
          width="250"
        >
        <h3>Be a Partner</h3>
        <router-link to="/login">
          Go to Portal
        </router-link>
      </div> -->
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
          title="Contact Information"
          :before-change="validationFormContact"
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
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Email"
                  label-for="email"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Email"
                    rules="required|email"
                  >
                    <b-form-input
                      id="email"
                      v-model="form.email"
                      :state="errors.length > 0 ? false : null"
                      type="email"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                    <!-- <small class="text-primary"><strong>On successful registration a notification will be sent to this e-mail</strong></small> -->
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Primay Phone Number"
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
                      :state="errors.length > 0 ? false : null"
                      placeholder="Enter Phone Number"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Staff Role"
                  label-for="roles"
                  rules="required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Staff Role"
                    rules="required"
                  >
                    <el-select
                      v-model="form.role_id"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(role, index) in staff_roles"
                        :key="index"
                        :value="role.id"
                        :label="role.display_name"
                        :disabled="role.name === 'super'"
                      />
                    </el-select>
                    <small class="text-danger">{{ errors[0] }}</small>

                  </validation-provider>
                </b-form-group>
              </b-col>

            </b-row>
          </validation-observer>
        </tab-content>
      </form-wizard>
    </b-card>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  // BAlert,
} from 'bootstrap-vue'
import {
  required, email, confirmed, password,
} from '@validations'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    // BAlert,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      required,
      password,
      email,
      confirmed,

      form: {
        name: '',
        email: '',
        phone: '',
        role_id: '',
      },
      empty_form: {
        name: '',
        email: '',
        phone: '',
        role_id: '',
      },
      // codeIcon,
      genders: ['Male', 'Female'],
      loader: false,
      staff_roles: [],
    }
  },
  created() {
    // this.fetchFormDetails()
    this.fetchRoles()
  },
  methods: {
    fetchRoles() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('acl/roles/index')
      fetchCurriculumSetupResource.list({ option: 'staff' })
        .then(response => {
          app.staff_roles = response.roles
        })
    },
    formSubmitted() {
      const app = this
      const registerStaffResource = new Resource('users/register')
      const { form } = app
      app.loader = true
      registerStaffResource
        .store(form)
        .then(() => {
          app.form = app.empty_form
          app.loader = false

          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Successful Registration',
              icon: 'EditIcon',
              variant: 'success',
            },
          })
          // app.$router.push({ path: 'login' })
          app.$emit('update')
          // send mail
        })
        .catch(error => {
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
    validationFormContact() {
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
