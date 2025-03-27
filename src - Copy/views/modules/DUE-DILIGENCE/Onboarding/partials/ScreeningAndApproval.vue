<template>
  <div>
    <div
      slot="header"
    >
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            Vendors Screening/Approval
          </h3>
        </b-col>
        <b-col
          cols="5"
        >
          <el-select
            v-model="selectedVendor"
            v-loading="loading"
            filterable
            style="width: 100%"
            value-key="id"
            placeholder="Select Vendor"
            @input="setVendor"
          >
            <el-option
              v-for="(vendor, index) in vendors"
              :key="index"
              :label="vendor.name"
              :value="vendor"
            />
          </el-select>
        </b-col>
      </b-row>
      <hr>
      <div v-if="showVendorDetails">
        <el-alert
          type="info"
          effect="dark"
          :closable="false"
        >
          <strong>Details for {{ selectedVendor.name }}</strong>
        </el-alert>
        <el-row :gutter="10">
          <el-col :md="16">
            <table class="table table-bordered">
              <tr>
                <td
                  colspan="2"
                  align="center"
                >
                  <h3>GENERAL INFORMATION</h3>
                </td>
              </tr>
              <tr>
                <td><strong>Company Name</strong></td>
                <td>{{ selectedVendor.name }}</td>
              </tr>
              <tr>
                <td><strong>Business Type</strong></td>
                <td>{{ selectedVendor.business_type }}</td>
              </tr>
              <tr>
                <td><strong>Company Registration Number</strong></td>
                <td>{{ selectedVendor.reg_no }}</td>
              </tr>
              <tr>
                <td><strong>Country of Incorporation</strong></td>
                <td>{{ selectedVendor.country_of_incorporation }}</td>
              </tr>
              <tr>
                <td><strong>Company Website</strong></td>
                <td>{{ selectedVendor.website }}</td>
              </tr>
              <tr>
                <td><strong>Number of years in business</strong></td>
                <td>{{ selectedVendor.years_in_business }}</td>
              </tr>
              <tr>
                <td><strong>Primary Contact Name</strong></td>
                <td>{{ selectedVendor.contact_name }}</td>
              </tr>
              <tr>
                <td><strong>Primary Contact Email</strong></td>
                <td>{{ selectedVendor.contact_email }}</td>
              </tr>
              <tr>
                <td><strong>Primary Contact Phone</strong></td>
                <td>{{ selectedVendor.contact_phone }}</td>
              </tr>
              <tr>
                <td><strong>Contact Address</strong></td>
                <td>{{ selectedVendor.contact_address }}</td>
              </tr>
              <!--BUSINESS INFO-->
              <tr>
                <td
                  colspan="2"
                  align="center"
                >
                  <h3>BUSINESS INFORMATION</h3>
                </td>
              </tr>
              <tr>
                <td><strong>Does company process, store, or transmit our organization's or customers' sensitive information?</strong></td>
                <td>{{ (selectedVendor.stores_information === 1) ? 'Yes' : 'No' }}</td>
              </tr>
              <template v-if="selectedVendor.stores_information === 0">
                <tr>
                  <td><strong>Products/Services Offered</strong></td>
                  <td>{{ selectedVendor.service_description }}</td>
                </tr>
                <tr>
                  <td><strong>Has organization worked with similar organizations before</strong></td>
                  <td>
                    {{ (selectedVendor.work_with_similar_organization === 1) ? 'Yes' : 'No' }}
                    <div v-if="selectedVendor.work_with_similar_organization === 1"><br>
                      <em>
                        <small><strong>Provided References:</strong> <br>
                          {{ selectedVendor.references_to_working_with_similar_organizations }}</small>
                      </em>

                    </div>
                  </td>
                </tr>
                <tr>
                  <td><strong>Posesses Business Insurance</strong></td>
                  <td>
                    {{ (selectedVendor.have_business_insurance === 1) ? 'Yes' : 'No' }}<br><br>

                    <em><small v-if="selectedVendor.have_business_insurance === 1">View the list of uploaded documents for the Business Insurance</small></em>
                  </td>
                </tr>
                <tr>
                  <td><strong>Business License</strong></td>
                  <td>
                    <em>View the list of uploaded documents for the Business License</em>
                  </td>
                </tr>
                <tr>
                  <td><strong>Banking Details for Payment Processing</strong></td>
                  <td>
                    <p>
                      <strong>Bank Name: </strong>{{ selectedVendor.bank_detail.bank_name }}
                    </p>
                    <p>
                      <strong>Account Name: </strong>{{ selectedVendor.bank_detail.account_name }}
                    </p>
                    <p>
                      <strong>Account Number: </strong>{{ selectedVendor.bank_detail.account_no }}
                    </p>
                  </td>
                </tr>
              </template>
              <template v-if="selectedVendor.stores_information === 1">
                <tr>
                  <td
                    colspan="2"
                    align="center"
                  >
                    Business & Operational Details
                  </td>
                </tr>
                <tr>
                  <td><strong>List of major clients or industry recognitions</strong></td>
                  <td>{{ selectedVendor.list_of_clients_or_industry_recognitions }}</td>
                </tr>
                <tr>
                  <td><strong>Does Company subcontract any services?</strong></td>
                  <td>
                    {{ (selectedVendor.does_subcontract_services === 1) ? 'Yes' : 'No' }}
                  </td>
                </tr>
                <tr v-if="selectedVendor.does_subcontract_services === 1">
                  <td><strong>Details of services subcontracted</strong></td>
                  <td>
                    {{ selectedVendor.list_of_services_subcontracted }}
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    align="center"
                  >
                    Regulatory & Compliance Information
                  </td>
                </tr>
                <tr>
                  <td><strong>Uplaod of Industry Certifications</strong></td>
                  <td>
                    <em>View the list of uploaded documents for applicable industry certifications</em>
                  </td>
                </tr>
                <tr>
                  <td><strong>Has past regulatory compliance violation?</strong></td>
                  <td>
                    {{ (selectedVendor.past_regulatory_compliance_violations === 1) ? 'Yes' : 'No' }}
                  </td>
                </tr>
                <tr v-if="selectedVendor.past_regulatory_compliance_violations === 1">
                  <td><strong>Details of past regulatory compliance violations</strong></td>
                  <td>
                    {{ selectedVendor.details_of_compliance_violations }}
                  </td>
                </tr>
                <tr>
                  <td><strong>Has an internal compliance team or officer?</strong></td>
                  <td>
                    {{ (selectedVendor.internal_compliance_team_or_officer === 1) ? 'Yes' : 'No' }}
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    align="center"
                  >
                    Security & Risk Management
                  </td>
                </tr>
                <tr>
                  <td><strong>Does organization have a formal cybersecurity policy?</strong></td>
                  <td>
                    {{ (selectedVendor.have_formal_cybersecurity_policy === 1) ? 'Yes' : 'No' }}
                    <div v-if="selectedVendor.have_formal_cybersecurity_policy === 1"><br>
                      <em>Check for uploaded Cybersecurity Policy</em>

                    </div>
                  </td>
                </tr>
                <tr>
                  <td><strong>Has the organization experienced a data breach in the past 3 years?</strong></td>
                  <td>
                    {{ (selectedVendor.have_recent_data_breach === 1) ? 'Yes' : 'No' }}
                    <div v-if="selectedVendor.have_formal_cybersecurity_policy === 1"><br>
                      <em>Check for uploaded Cybersecurity Policy</em>

                    </div>
                  </td>
                </tr>
                <tr v-if="selectedVendor.have_recent_data_breach === 1">
                  <td><strong>Explanation of the resolution process</strong></td>
                  <td>
                    {{ selectedVendor.data_breach_resolution_process }}
                  </td>
                </tr>
                <tr>
                  <td><strong>How organization ensure data protection and confidentiality</strong></td>
                  <td>
                    {{ selectedVendor.ensure_data_protection_and_confidentiality }}
                  </td>
                </tr>
                <tr>
                  <td><strong>Does organization conduct background checks on employees?</strong></td>
                  <td>
                    {{ (selectedVendor.does_background_checks_on_employees === 1) ? 'Yes' : 'No' }}
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    align="center"
                  >
                    Financial & Legal Information
                  </td>
                </tr>
                <tr>
                  <td><strong>Tax Identification Number</strong></td>
                  <td>
                    {{ selectedVendor.company_tax_identification_no }}
                  </td>
                </tr>
                <tr>
                  <td><strong>Posesses Business Insurance</strong></td>
                  <td>
                    {{ (selectedVendor.have_business_insurance === 1) ? 'Yes' : 'No' }}<br><br>

                    <em><small v-if="selectedVendor.have_business_insurance === 1">View the list of uploaded documents for the Business Insurance</small></em>
                  </td>
                </tr>
                <tr>
                  <td><strong>Ongoing legal disputes</strong></td>
                  <td>
                    {{ (selectedVendor.ongoing_legal_dispute === 1) ? 'Yes' : 'No' }}
                  </td>
                </tr>
                <tr v-if="selectedVendor.ongoing_legal_dispute === 1">
                  <td><strong>Details of the dispute</strong></td>
                  <td>
                    {{ selectedVendor.legal_dispute_details }}
                  </td>
                </tr>
                <tr>
                  <td><strong>Banking Details for Payment Processing</strong></td>
                  <td>
                    <p>
                      <strong>Bank Name: </strong>{{ selectedVendor.bank_detail.bank_name }}
                    </p>
                    <p>
                      <strong>Account Name: </strong>{{ selectedVendor.bank_detail.account_name }}
                    </p>
                    <p>
                      <strong>Account Number: </strong>{{ selectedVendor.bank_detail.account_no }}
                    </p>
                  </td>
                </tr>
              </template>
            </table>
          </el-col>
          <el-col :md="8">
            <div
              v-if="selectedVendor.document_uploads.length > 0"
              style="height: 350px; overflow: auto; background: #f0f0f0; padding: 10px;"
            >
              <h4>Uploaded Documents</h4>
              <b-list-group>
                <b-list-group-item
                  v-for="(document, document_index) in selectedVendor.document_uploads"
                  :key="document_index"
                >
                  <div>
                    <small style="font-weight: 900">{{ document.title }}</small>
                    <span
                      class="pull-right"
                    >
                      <el-dropdown>
                        <b-button
                          variant="flat"
                          class="btn-icon rounded-circle"
                        >
                          <i class="el-icon-more" />
                          <!-- <feather-icon
                                    icon="MoreHorizontalIcon"
                                  /> -->
                        </b-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="document.link !== null">
                            <a
                              :href="baseServerUrl+'storage/'+document.link"
                              target="_blank"
                            ><feather-icon icon="DownloadIcon" /> Download
                            </a>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </span>
                  </div>
                </b-list-group-item>
              </b-list-group>
            </div>
          </el-col>
        </el-row>
        <!-- <onboarding-form
          :vendor-id="selectedVendor.id"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BButton, BListGroup, BListGroupItem,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
// import OnboardingForm from '@/views/modules/DUE-DILIGENCE/vendor/partials/Onboarding.vue'
// import EditVendorUser from './EditVendorUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    // OnboardingForm,
    BButton,
    BListGroup,
    BListGroupItem,
    // EditVendor,
    // EditVendorUser,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      downloadLoading: false,
      showVendorDetails: false,
      vendors: [],
      loading: false,
      selectedVendor: null,
      selectedVendorUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
        all: true,
      },
      total: 0,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchVendors() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.vendors = response.vendors
          app.loading = false
        })
    },
    setVendor() {
      // console.log(props)
      const app = this
      app.showVendorDetails = false
      setTimeout(() => {
        app.showVendorDetails = true
      }, 100)
    },
    editThisVendorUser(row) {
      const app = this
      app.selectedVendorUser = row
      app.showEditForm = true
      app.editVendorUser = true
    },
    handleDownload(tableTitle, vendorsList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'STAFF ID',
          'SURNAME',
          'OTHER NAMES',
          'EMAIL',
          'PHONE',
          'GENDER',
        ]
        const filterVal = [
          // 'studentship_status',
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone1',
          'user.gender',
        ]
        const list = vendorsList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv',
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'user.username') {
          return v.user.username
        }
        if (j === 'user.last_name') {
          return v.user.last_name
        }
        if (j === 'user.first_name') {
          return v.user.first_name
        }
        if (j === 'user.email') {
          return v.user.email
        }
        if (j === 'user.phone1') {
          return v.user.phone1
        }
        if (j === 'user.gender') {
          return v.user.gender
        }

        return v[j]
      }))
    },
  },
}
</script>
