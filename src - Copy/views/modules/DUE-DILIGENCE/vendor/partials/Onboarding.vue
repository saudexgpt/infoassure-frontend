<template>
  <el-card v-loading="loading">
    <form-wizard
      v-if="form != null"
      color="#0B173D"
      :title="null"
      :subtitle="null"
      shape="tab"
      step-size="xs"
      class="wizard-vertical mb-3"
      @on-complete="formSubmitted"
    >

      <!-- account datails tab -->
      <tab-content title="General Information">
        <b-row>
          <!-- <b-col
            cols="12"
            class="mb-2"
          >
            <h5 class="mb-0">
              General Information
            </h5>
            <small class="text-muted">
              Enter Your Account Details.
            </small>
          </b-col> -->
          <b-col md="6">
            <b-form-group
              label="Company Name"
              label-for="v-name"
            >
              <b-form-input
                id="v-name"
                v-model="form.name"
                placeholder="Enter Company Name"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Business Type"
              label-for="v-business_type"
            >
              <el-select
                v-model="form.business_type"
                filterable
                style="width: 100%"
                :disabled="isAdmin"
              >
                <el-option
                  v-for="(business_type, index) in business_types"
                  :key="index"
                  :label="business_type"
                  :value="business_type"
                />
              </el-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Company Registration Number"
              label-for="v-reg_no"
            >
              <b-form-input
                id="v-reg_no"
                v-model="form.reg_no"
                placeholder="Enter Company Registration Number"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Country of Incorporation"
              label-for="v-country"
            >
              <el-select
                v-model="form.country_of_incorporation"
                filterable
                style="width: 100%"
                :disabled="isAdmin"
              >
                <el-option
                  v-for="(country, c_index) in countries"
                  :key="c_index"
                  :label="country.country_name"
                  :value="country.country_name"
                />
              </el-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Company Website"
              label-for="v-website"
            >
              <b-form-input
                id="v-website"
                v-model="form.website"
                placeholder="www.example.com"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Number of years in business"
              label-for="v-years_in_business"
            >
              <el-input-number
                v-model="form.years_in_business"
                :min="1"
                placeholder="5"
                :disabled="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Primary Contact Name"
              label-for="v-contact_name"
            >
              <b-form-input
                id="v-contact_name"
                v-model="form.contact_name"
                placeholder="John Doe"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Primary Contact Email"
              label-for="v-email"
            >
              <b-form-input
                id="v-email"
                v-model="form.contact_email"
                type="email"
                placeholder="john.doe@email.com"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Primary Contact Phone"
              label-for="v-phone"
            >
              <b-form-input
                id="v-phone"
                v-model="form.contact_phone"
                placeholder="Enter primary contact phone"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Contact Address"
              label-for="v-address"
            >
              <el-input
                id="v-address"
                v-model="form.contact_address"
                type="textarea"
                placeholder="Enter contact address"
                style="width: 100%"
                :readonly="isAdmin"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </tab-content>

      <!-- personal info tab -->
      <tab-content title="Business Information">
        <b-row>
          <b-col
            cols="12"
            class="mb-2"
          >
            <h5 class="mb-2">
              Does your company process, store, or transmit our organization's or customers' sensitive information?
            </h5>
            <div>
              <el-radio
                v-model="form.stores_information"
                :label="0"
                border
                :disabled="isAdmin"
              >
                No
              </el-radio>
              <el-radio
                v-model="form.stores_information"
                :label="1"
                border
                :disabled="isAdmin"
              >
                Yes
              </el-radio>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="8">
            <!--Lesser Info-->
            <b-row v-if="form.stores_information === 0">
              <b-col md="12">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Example: Payroll services, Transaction processing, Software maintenance, Professional services, Legal services e.t.c"
                  placement="top"
                >
                  <b-form-group
                    label="Describe the products/services your company offers"
                    label-for="v-service_description"
                  >

                    <!-- <el-select
                      v-model="form.service_description"
                      filterable
                      style="width: 100%"
                      :disabled="isAdmin"
                    >
                      <el-option
                        v-for="(service, index) in services"
                        :key="index"
                        :label="service"
                        :value="service"
                      />
                    </el-select> -->

                    <el-input
                      v-model="form.service_description"
                      type="textarea"
                      placeholder="Type Here..."
                      maxlength="500"
                      rows="4"
                      show-word-limit
                      :readonly="isAdmin"
                    />
                  </b-form-group>
                </el-tooltip>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Have you worked with similar organizations before?"
                  label-for="v-work_with_similar_organization"
                >
                  <div>
                    <el-radio
                      v-model="form.work_with_similar_organization"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.work_with_similar_organization"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.work_with_similar_organization === 1">
                    <label for="">Kindly Provide References (Names of the organizations)</label>
                    <el-input

                      v-model="form.references_to_working_with_similar_organizations"
                      type="textarea"
                      placeholder="Type Here..."
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin"
                    />
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Do you have valid business insurance?"
                  label-for="v-have_business_insurance"
                >
                  <div>
                    <el-radio
                      v-model="form.have_business_insurance"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_business_insurance"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_business_insurance === 1">
                    <label for="">Kindly Upload Certificate</label>
                    <input
                      v-if="!isAdmin"
                      class="form-control"
                      type="file"
                      @change="onImageChange($event, 'Business Insurance Certificate')"
                    >
                    <div v-else>
                      Check for uploaded Business Insurance
                    </div>
                  </div>

                </b-form-group>
              </b-col>
              <b-col
                md="12"
              >
                <b-form-group
                  label="Upload your Business License"
                  label-for="v-business_license_link"
                >
                  <input

                    v-if="!isAdmin"
                    class="form-control"
                    type="file"
                    @change="onImageChange($event, 'Business License Certificate')"
                  >
                  <div v-else>
                    Check for uploaded Business License
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Banking Details for Payment Processing"
                  label-for="v-bank_details"
                >

                  <table class="table">
                    <tr>
                      <td>
                        Bank Name
                      </td>
                      <td>
                        <el-input
                          v-model="bank_details.bank_name"
                          :readonly="isAdmin"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Account Name
                      </td>
                      <td>
                        <el-input
                          v-model="bank_details.account_name"
                          :readonly="isAdmin"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Account Number
                      </td>
                      <td>
                        <el-input
                          v-model="bank_details.account_no"
                          type="number"
                          :readonly="isAdmin"
                        />
                      </td>
                    </tr>
                  </table>
                </b-form-group>
              </b-col>
            </b-row>
            <!--Lesser Info-->
            <!--More Info-->
            <b-row v-if="form.stores_information === 1">
              <b-col
                cols="12"
                class="mb-2"
              >
                <h5 class="mb-2">
                  Business & Operational Details
                </h5>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="List any major clients or industry recognitions"
                  label-for="v-service_description"
                >

                  <el-input
                    v-model="form.list_of_clients_or_industry_recognitions"
                    type="textarea"
                    placeholder="Type Here..."
                    maxlength="500"
                    rows="4"
                    show-word-limit
                    :readonly="isAdmin"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Does your company subcontract any services?"
                  label-for="v-work_with_similar_organization"
                >
                  <div>
                    <el-radio
                      v-model="form.does_subcontract_services"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.does_subcontract_services"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.does_subcontract_services === 1">
                    <label for="">Kindly specify the details</label>
                    <el-input

                      v-model="form.list_of_services_subcontracted"
                      type="textarea"
                      placeholder="Type Here..."
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin"
                    />
                  </div>

                </b-form-group>
              </b-col>
              <b-col
                cols="12"
                class="mb-2"
              >
                <h5 class="mb-2">
                  Regulatory & Compliance Information
                </h5>
              </b-col>
              <b-col
                md="12"
              >
                <b-form-group
                  label="Upload Applicable Industry Certifications"
                  label-for="v-industry_certs"
                >

                  <table class="table">
                    <tr>
                      <th>Certifications</th>
                      <th>Upload Proof</th>
                    </tr>
                    <tr
                      v-for="(certs, cert_index) in industry_certifications"
                      :key="cert_index"
                    >
                      <td>
                        {{ certs }}
                      </td>
                      <td>
                        <input
                          v-if="!isAdmin"
                          class="form-control"
                          type="file"
                          @change="onImageChange($event, certs)"
                        >
                        <div v-else>
                          Check for uploaded {{ certs }} certificates
                        </div>
                      </td>
                    </tr>
                  </table>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Does your organization have any past regulatory compliance violations?"
                  label-for="v-past_regulatory_compliance_violations"
                >
                  <div>
                    <el-radio
                      v-model="form.past_regulatory_compliance_violations"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.past_regulatory_compliance_violations"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.past_regulatory_compliance_violations === 1">
                    <label for="">Kindly provide the details</label>
                    <el-input

                      v-model="form.details_of_compliance_violations"
                      type="textarea"
                      placeholder="Type Here..."
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin"
                    />
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Does your organization have an internal compliance team or officer?"
                  label-for="v-past_regulatory_compliance_violations"
                >
                  <div>
                    <el-radio
                      v-model="form.internal_compliance_team_or_officer"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.internal_compliance_team_or_officer"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>

                </b-form-group>
              </b-col>
              <b-col
                cols="12"
                class="mb-2"
              >
                <h5 class="mb-2">
                  Security & Risk Management
                </h5>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Do you have a formal cybersecurity policy?"
                  label-for="v-have_formal_cybersecurity_policy"
                >
                  <div>
                    <el-radio
                      v-model="form.have_formal_cybersecurity_policy"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_formal_cybersecurity_policy"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_formal_cybersecurity_policy === 1">
                    <label for="">Kindly Upload</label>
                    <input
                      v-if="!isAdmin"
                      class="form-control"
                      type="file"
                      @change="onImageChange($event, 'Cybersecurity Policy')"
                    >
                    <div v-else>
                      Check for uploaded Cybersecurity Policy
                    </div>
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Has your company experienced a data breach in the past 3 years?"
                  label-for="v-have_recent_data_breach"
                >
                  <div>
                    <el-radio
                      v-model="form.have_recent_data_breach"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_recent_data_breach"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_recent_data_breach === 1">
                    <label for="">Kindly explain the resolution process</label>
                    <el-input

                      v-model="form.data_breach_resolution_process"
                      type="textarea"
                      placeholder="Explain Here..."
                      maxlength="500"
                      rows="4"
                      show-word-limit
                      :readonly="isAdmin"
                    />
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="How do you ensure data protection and confidentiality?"
                  label-for="v-ensure_data_protection_and_confidentiality"
                >
                  <el-input

                    v-model="form.ensure_data_protection_and_confidentiality"
                    type="textarea"
                    placeholder="Explain Here..."
                    maxlength="500"
                    rows="4"
                    show-word-limit
                    :readonly="isAdmin"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Do you conduct background checks on employees?"
                  label-for="v-have_formal_cybersecurity_policy"
                >
                  <div>
                    <el-radio
                      v-model="form.does_background_checks_on_employees"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.does_background_checks_on_employees"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>

                </b-form-group>
              </b-col>
              <b-col
                cols="12"
                class="mb-2"
              >
                <h5 class="mb-2">
                  Financial & Legal Information
                </h5>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Company Tax Identification Number"
                  label-for="v-company_tax_identification_no"
                >
                  <el-input

                    v-model="form.company_tax_identification_no"
                    placeholder="Type TIN here..."
                    :readonly="isAdmin"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Do you have valid business insurance?"
                  label-for="v-have_business_insurance"
                >
                  <div>
                    <el-radio
                      v-model="form.have_business_insurance"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.have_business_insurance"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.have_business_insurance === 1">
                    <label for="">Kindly Upload Certificate</label>
                    <input
                      v-if="!isAdmin"
                      class="form-control"
                      type="file"
                      @change="onImageChange($event, 'Business Insurance Certificate')"
                    >
                    <div v-else>
                      Check for uploaded {{ certs }} certificates
                    </div>
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Are there any ongoing legal disputes?"
                  label-for="v-ongoing_legal_dispute"
                >
                  <div>
                    <el-radio
                      v-model="form.ongoing_legal_dispute"
                      :label="0"
                      border
                      :disabled="isAdmin"
                    >
                      No
                    </el-radio>
                    <el-radio
                      v-model="form.ongoing_legal_dispute"
                      :label="1"
                      border
                      :disabled="isAdmin"
                    >
                      Yes
                    </el-radio>
                  </div>
                  <div v-if="form.ongoing_legal_dispute === 1">
                    <label for="">Kindly give details of the dispute</label>
                    <el-input

                      v-model="form.legal_dispute_details"
                      type="textarea"
                      placeholder="Explain Here..."
                      maxlength="300"
                      rows="3"
                      show-word-limit
                      :readonly="isAdmin"
                    />
                  </div>

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Banking Details for Payment Processing"
                  label-for="v-bank_details"
                >

                  <table class="table">
                    <tr>
                      <td>
                        Bank Name
                      </td>
                      <td>
                        <el-input v-model="bank_details.bank_name" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Account Name
                      </td>
                      <td>
                        <el-input v-model="bank_details.account_name" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Account Number
                      </td>
                      <td>
                        <el-input
                          v-model="bank_details.account_no"
                          type="number"
                          :readonly="isAdmin"
                        />
                      </td>
                    </tr>
                  </table>
                </b-form-group>
              </b-col>
            </b-row>
            <!--More Info-->
          </b-col>
          <b-col md="4">
            <div
              v-if="form.document_uploads.length > 0"
              v-loading="loadDelete"
              style="height: 550px; overflow: auto; background: #f0f0f0; padding: 10px; border-radius: 8px;"
            >
              <h4>Uploaded Documents</h4>
              <b-list-group>
                <b-list-group-item
                  v-for="(document, document_index) in form.document_uploads"
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

                          <el-dropdown-item v-if="document.link !== null && !isAdmin">
                            <span @click="deleteUploadedDocument(document.id)"><feather-icon icon="TrashIcon" /> Delete</span>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </span>
                  </div>
                </b-list-group-item>
              </b-list-group>
            </div>
          </b-col>
        </b-row>

      </tab-content>

      <!-- address -->
      <tab-content
        v-if="!isAdmin"
        title="Declaration/Acknowledgment"
      >
        <b-row>
          <b-col
            cols="12"
            class="mb-2"
          >
            <h5 class="mb-0">
              <em>By clicking Submit, I confirm that the information provided is accurate and complete</em>
            </h5>
          </b-col>
        </b-row>
      </tab-content>

      <b-button slot="prev">
        Back
      </b-button>
      <b-button slot="next">
        Next
      </b-button>
      <b-button
        slot="finish"
        :disabled="isAdmin"
      >
        Submit
      </b-button>
    </form-wizard>

  </el-card>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BListGroup,
  BListGroupItem,
  BButton,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BListGroup,
    BListGroupItem,
    BButton,
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
    vendorId: {
      type: Number,
      default: () => null,
    },
  },
  data() {
    return {
      vendor: null,
      form: {
        id: null,
        client_id: null,
        admin_user_id: null,
        name: null,
        business_type: null,
        contact_name: null,
        contact_email: null,
        contact_phone: null,
        contact_address: null,
        reg_no: null,
        country_of_incorporation: null,
        website: null,
        years_in_business: 1,
        stores_information: 0,
        service_description: null,
        work_with_similar_organization: 1,
        references_to_working_with_similar_organizations: null,
        have_business_insurance: 1,
        business_insurance_file_link: null,
        business_license_link: null,
        list_of_clients_or_industry_recognitions: null,
        does_subcontract_services: 0,
        list_of_services_subcontracted: null,
        industry_certifications: null,
        past_regulatory_compliance_violations: 0,
        details_of_compliance_violations: null,
        internal_compliance_team_or_officer: 0,
        have_formal_cybersecurity_policy: 0,
        cyber_security_policy_link: null,
        have_recent_data_breach: 0,
        data_breach_resolution_process: null,
        ensure_data_protection_and_confidentiality: null,
        does_background_checks_on_employees: 1,
        company_tax_identification_no: null,
        ongoing_legal_dispute: 0,
        legal_dispute_details: null,
        document_uploads: [],
      },
      business_types: [],
      countries: [],
      uploadableFiles: [],
      industry_certifications: ['ISO 27001', 'SOC 2', 'GDPR', 'PCI-DSS'],
      bank_details: {
        bank_name: '',
        account_no: '',
        account_name: '',
      },
      loadDelete: false,
      loading: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchVendor()
  },
  methods: {
    fetchVendor() {
      const app = this
      app.loading = true
      const fetchVendorResource = new Resource('vdd/show-vendor')
      fetchVendorResource.vGet(app.vendorId)
        .then(response => {
          app.vendor = response.vendor
          app.form = response.vendor
          app.business_types = response.business_types
          app.countries = response.countries
          app.bank_details = (response.vendor.bank_detail) ? response.vendor.bank_detail : {
            bank_name: '',
            account_no: '',
            account_name: '',
          }
          app.loading = false
        })
    },
    onImageChange(e, title) {
      const app = this
      app.uploadableFiles.push({ title, file: e.target.files[0] })
    },
    formSubmitted() {
      const app = this
      const formData = new FormData()
      formData.append('id', app.form.id)
      formData.append('name', app.form.name)
      formData.append('business_type', app.form.business_type)
      formData.append('contact_name', app.form.contact_name)
      formData.append('contact_email', app.form.contact_email)
      formData.append('contact_phone', app.form.contact_phone)
      formData.append('contact_address', app.form.contact_address)
      formData.append('reg_no', app.form.reg_no)
      formData.append('country_of_incorporation', app.form.country_of_incorporation)
      formData.append('website', app.form.website)
      formData.append('years_in_business', app.form.years_in_business)
      formData.append('stores_information', app.form.stores_information)
      formData.append('service_description', app.form.service_description)
      formData.append('work_with_similar_organization', app.form.work_with_similar_organization)
      formData.append('references_to_working_with_similar_organizations', app.form.references_to_working_with_similar_organizations)
      formData.append('have_business_insurance', app.form.have_business_insurance)
      formData.append('bank_name', app.bank_details.bank_name)
      formData.append('account_no', app.bank_details.account_no)
      formData.append('account_name', app.bank_details.account_name)
      formData.append('list_of_clients_or_industry_recognitions', app.form.list_of_clients_or_industry_recognitions)
      formData.append('does_subcontract_services', app.form.does_subcontract_services)
      formData.append('list_of_services_subcontracted', app.form.list_of_services_subcontracted)
      formData.append('industry_certifications', app.form.industry_certifications)
      formData.append('past_regulatory_compliance_violations', app.form.past_regulatory_compliance_violations)
      formData.append('details_of_compliance_violations', app.form.details_of_compliance_violations)
      formData.append('internal_compliance_team_or_officer', app.form.internal_compliance_team_or_officer)
      formData.append('have_formal_cybersecurity_policy', app.form.have_formal_cybersecurity_policy)
      formData.append('have_recent_data_breach', app.form.have_recent_data_breach)
      formData.append('data_breach_resolution_process', app.form.data_breach_resolution_process)
      formData.append('ensure_data_protection_and_confidentiality', app.form.ensure_data_protection_and_confidentiality)
      formData.append('does_background_checks_on_employees', app.form.does_background_checks_on_employees)
      formData.append('company_tax_identification_no', app.form.company_tax_identification_no)
      formData.append('ongoing_legal_dispute', app.form.ongoing_legal_dispute)
      formData.append('legal_dispute_details', app.form.legal_dispute_details)
      app.uploadableFiles.forEach(element => {
        formData.append('uploadable_files[]', element.file)
        formData.append('uploadable_files_titles[]', element.title)
      })

      const updateVendorResource = new Resource('vdd/update-vendor')
      updateVendorResource.vStore(formData)
        .then(() => {
          // console.log(response)
        })
      // console.log(formData)
    },
    deleteUploadedDocument(documentId) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this document? This cannot be recovered')) {
        app.loadDelete = true
        const destroyEvidenceResource = new Resource('vdd/delete-uploaded-document')
        destroyEvidenceResource.vDestroy(documentId)
          .then(() => {
            app.fetchVendor(false)
            app.$message('Document Deleted')
            app.loadDelete = false
          }).catch(e => {
            app.loadDelete = false
            app.$message(e.response.message)
          })
      }
    },
  },
}
</script>
