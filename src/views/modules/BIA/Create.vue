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
          <!-- personal details tab -->
          <tab-content
            title="Process"
            :before-change="validationFormProcess"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="12">
                  <b-form-group
                    label="Business Unit"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Select Business Unit"
                      rules="required"
                    >
                      <el-select
                        v-model="form.business_unit_id"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Select Business Unit"
                      >
                        <el-option
                          v-for="(unit, index) in business_units"
                          :key="index"
                          :value="unit.id"
                          :label="unit.unit_name"
                        />
                      </el-select>
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    label="Business Process Name"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Select Business Process Name"
                      rules="required"
                    >
                      <el-select
                        v-model="form.business_process_id"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Select Business Process Name"
                      >
                        <el-option
                          v-for="(process, index) in business_processes"
                          :key="index"
                          :value="process.id"
                          :label="process.name"
                        />
                      </el-select>
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
          <tab-content
            title="Activity Details"
            :before-change="validationFormActivity"
          >
            <validation-observer
              ref="activityRules"
              tag="form"
            >
              <b-row>
                <b-col md="6">
                  <b-form-group
                    label="Product or Services Delivered"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Product or Services Delivered"
                      rules="required"
                    >
                      <b-form-input
                        id="name"
                        v-model="form.product_or_service_delivered"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Product or Services Delivered"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
          <tab-content
            title="Compliance Requirement"
            :before-change="validationFormCompliance"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="6">
                  <b-form-group
                    label="Legal, Regulatory and Contractual Obligations"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Legal, Regulatory and Contractual Obligations"
                      rules="required"
                    >
                      <b-form-input
                        id="name"
                        v-model="form.legal_obligation"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Legal, Regulatory and Contractual Obligations"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
          <tab-content
            title="Impact of Disruption to Processes"
            :before-change="validationFormImpact"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="12">
                  <table>
                    <thead>
                      <tr>
                        <th>Disaster</th>
                        <th>Less Than 1 Hour ( 60 mins)</th>
                        <th>Three Hours (180 mins)</th>
                        <th>1 Day (540 mins)</th>
                        <th>3 Days (1620 mins)</th>
                        <th>1 Week (2700 mins)</th>
                        <th>2 Weeks (5400 mins)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(imapct, impact_index) in disruption_impacts"
                        :key="impact_index"
                      >
                        <td>
                          <span>
                            <el-button
                              v-if="disruption_impacts.length > 1"
                              type="danger"
                              icon="el-icon-delete"
                              circle
                              @click="removeDetail(index)"
                            />
                            <el-button
                              v-if="index + 1 === disruption_impacts.length"
                              type="primary"
                              icon="el-icon-plus"
                              circle
                              @click="addDetail(index)"
                            />
                          </span>
                        </td>
                        <td>
                          <el-select
                            v-model="impact.disaster"
                            placeholder="Enter Task"
                            type="text"
                          >
                            <el-option
                              v-for="(disaster, disaster_index) in disasters"
                              :key="disaster_index"
                              :value="disaster.name"
                              :label="disaster.name"
                            />
                          </el-select>
                        </td>
                        <td>
                          <el-select
                            v-model="impact.one_hr"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="(imp, imp_index) in impacts_list"
                              :key="imp_index"
                              :value="imp.value"
                              :label="imp.label"
                            />
                          </el-select>
                        </td>
                        <td>
                          <el-select
                            v-model="impact.three_hrs"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="(imp, imp_index) in impacts_list"
                              :key="imp_index"
                              :value="imp.value"
                              :label="imp.label"
                            />
                          </el-select>
                        </td>
                        <td>
                          <el-select
                            v-model="impact.one_day"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="(imp, imp_index) in impacts_list"
                              :key="imp_index"
                              :value="imp.value"
                              :label="imp.label"
                            />
                          </el-select>
                        </td>
                        <td>
                          <el-select
                            v-model="impact.one_week"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="(imp, imp_index) in impacts_list"
                              :key="imp_index"
                              :value="imp.value"
                              :label="imp.label"
                            />
                          </el-select>
                        </td>
                        <td>
                          <el-select
                            v-model="impact.two_weeks"
                            placeholder="Select"
                          >
                            <el-option
                              v-for="(imp, imp_index) in impacts_list"
                              :key="imp_index"
                              :value="imp.value"
                              :label="imp.label"
                            />
                          </el-select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
          <tab-content
            title="Applications"
            :before-change="validationFormInfo"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="6">
                  <b-form-group
                    label="Application used by process"
                    label-for="name"
                  >
                    <validation-provider
                      name="Application used by process"
                    >
                      <b-form-input
                        v-model="form.application_used_by_process"
                        placeholder="Application used by process"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </validation-observer>
          </tab-content>
          <tab-content
            title="Dependencies, Contraints and Workarounds"
            :before-change="validationFormInfo"
          >
            <validation-observer
              ref="infoRules"
              tag="form"
            >
              <b-row>
                <b-col md="6">
                  <b-form-group
                    label="Business unit Depends on"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Business unit Depends on"
                      rules="required"
                    >
                      <b-form-input
                        id="name"
                        v-model="form.business_units_depended_on"
                        placeholder="Business unit Depends on"
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
                        v-model="form.business_processes_depended_on"
                        :state="errors.length > 0 ? false:null"
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
            title="Others"
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
    return {
      business_units: [],
      business_processes: [],
      disruption_impacts: [],
      impacts_list: [{ value: 1, label: '1-Low' }, { value: 2, label: '2-Medium' }, { value: 3, label: '3-High' }],
      form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        required,
      },
      empty_form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
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
    this.fetchBusnessUnits()
    this.fetchBusinessProcesses()
  },
  methods: {
    isRowEmpty() {
      const checkEmptyLines = this.entries.filter(
        detail => detail.disaster === ''
        // || detail.ra_id === ''
          || detail.one_hr === null
          || detail.three_hrs === null
          || detail.one_day === null
          || detail.three_days === null
          || detail.one_week === null
          || detail.two_weeks === null,
      )
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addDetail() {
      this.fill_fields_error = false

      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        // if (this.invoice_items.length > 0)
        //     this.invoice_items[index].grade = '';
        this.entries.push({
          // ra_id: '',
          disaster: '',
          one_hr: null,
          three_hrs: null,
          one_day: null,
          three_days: null,
          one_week: null,
          two_weeks: null,
        })
      }
    },
    removeDetail(detailId) {
      this.fill_fields_error = false
      if (!this.BlockRemoval) {
        this.entries.splice(detailId, 1)
      }
    },
    fetchBusnessUnits() {
      const app = this
      const fetchBusinessUnitResource = new Resource('bia/fetch-business-units')
      fetchBusinessUnitResource.list({ client_id: 1 })
        .then(response => {
          app.business_units = response.business_units
        })
    },
    fetchBusinessProcesses() {
      const app = this
      const fetchBusinessProcessResource = new Resource('bia/fetch-business-processes')
      fetchBusinessProcessResource.list({ client_id: 1 })
        .then(response => {
          app.business_processes = response.business_processes
        })
    },
    formSubmitted() {
      const app = this
      const registerResource = new Resource('clients/register')
      const { form } = app
      app.loader = true
      // const email = form.admin_email
      registerResource.store(form)
        .then(response => {
          app.clients.push(response.client)
          app.form = app.empty_form
          app.loader = false
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Client Registration Successful',
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
    validationFormProcess() {
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
    validationFormActivity() {
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
    validationFormCompliance() {
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
    validationFormImpact() {
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
