<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-form-group
          label="Business Unit"
          label-for="name"
        >
          <el-select
            v-model="selectedUnit"
            value-key="id"
            style="width: 100%"
            placeholder="Select Business Unit"
            @input="setBusinessProcesses()"
          >
            <el-option
              v-for="(unit, index) in business_units"
              :key="index"
              :value="unit"
              :label="unit.unit_name"
            />
          </el-select>
        </b-form-group>
      </b-col>
      <b-col
        v-if="selectedUnit !== null"
        md="6"
      >
        <b-form-group
          label="Business Process Name"
          label-for="name"
        >
          <el-select
            v-model="form.business_process_id"
            style="width: 100%"
            placeholder="Select Business Process Name"
          >
            <el-option
              v-for="(process, index) in business_processes"
              :key="index"
              :value="process.id"
              :label="process.name"
            />
          </el-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-if="form.business_process_id !== ''">
      <b-col md="12">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th />
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
              v-for="(impact, index) in disruption_impacts"
              :key="index"
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
                    :value="disaster"
                    :label="disaster"
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
                  v-model="impact.three_days"
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
            <tr
              v-if="!isRowEmpty()"
            >
              <td colspan="7" />
              <td>
                <el-button
                  type="success"
                  @click="submitForm()"
                >
                  Submit
                </el-button></td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import vSelect from 'vue-select'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BRow,
  BCol,
  BFormGroup,
  // BInputGroupAppend,
  // BInputGroup,
  // BAlert,
} from 'bootstrap-vue'
import { required } from '@validations'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    // BInputGroupAppend,
    // BInputGroup,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      business_units: [],
      selectedUnit: null,
      business_processes: [],
      disruption_impacts: [],
      disasters: ['Financial Loss',
        'Negative Publicity',
        'Customer Dissatisfaction',
        'Risk to Health/Safety of staff and visitors',
        'Interruption of other processes',
        'Regulatory/Legal/Contractual Violation',
      ],
      impacts_list: [{ value: 1, label: '1-Low' }, { value: 2, label: '2-Medium' }, { value: 3, label: '3-High' }],
      form: {
        client_id: 1,
        business_unit_id: '',
        business_process_id: '',
        process_disruption_impacts: [],
        required,
      },
      empty_form: {
        client_id: 1,
        business_unit_id: '',
        business_process_id: '',
        process_disruption_impacts: [],
        required,
      },
      genders: ['Male', 'Female'],
      loader: false,
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  created() {
    this.fetchBusnessUnits()
    // this.fetchBusinessProcesses()
    this.addDetail()
  },
  methods: {
    setBusinessProcesses() {
      const app = this
      app.form.business_unit_id = app.selectedUnit.id
      app.business_processes = app.selectedUnit.business_processes
    },
    isRowEmpty() {
      const checkEmptyLines = this.disruption_impacts.filter(
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
        this.disruption_impacts.push({
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
        this.disruption_impacts.splice(detailId, 1)
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
    submitForm() {
      const app = this
      const registerResource = new Resource('bia/store')
      const { form } = app
      form.process_disruption_impacts = app.disruption_impacts
      app.loader = true
      // const email = form.admin_email
      registerResource.store(form)
        .then(() => {
          app.form = app.empty_form
          app.loader = false
          app.$toast({
            component: ToastificationContent,
            props: {
              title: 'Data Saved Successfully',
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
        this.$refs.processRules.validate().then(success => {
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
        this.$refs.activityRules.validate().then(success => {
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
        this.$refs.complianceRules.validate().then(success => {
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
        this.$refs.impactRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormApplication() {
      return new Promise((resolve, reject) => {
        this.$refs.applicationRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormDCW() {
      return new Promise((resolve, reject) => {
        this.$refs.DWCRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormOthers() {
      return new Promise((resolve, reject) => {
        this.$refs.othersRules.validate().then(success => {
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
