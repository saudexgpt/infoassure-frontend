<template>
  <el-card>
    <div v-if="manageContractSLA">
      <div slot="header">
        <span>
          <el-button
            type="danger"
            @click="initialize(); manageContractSLA = false;"
          >
            Back
          </el-button>
        </span>
        <hr>
      </div>
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane
          label="Performance Metrics Setup"
          name="first"
          lazy
        >
          <setup-performance-metrics :selected-contract="selectedContract" />
        </el-tab-pane>
        <el-tab-pane
          label="SLA Configuration"
          name="first"
          lazy
        >
          <configure-sla :selected-contract="selectedContract" />
        </el-tab-pane> -->
        <el-tab-pane
          label="SLA Performance Score Card"
          name="first"
          lazy
        >
          <sla-performance-score :selected-contract="selectedContract" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else>
      <div
        slot="header"
      >
        <b-row>
          <b-col
            cols="6"
          >
            <label>Select Vendor</label>
            <el-select
              v-model="selectedVendor"
              placeholder="Select Vendor"
              value-key="id"
              style="width: 100%"
              @input="initialize()"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client"
                :label="client.name"
              />
            </el-select>
          </b-col>
          <b-col
            v-if="form.vendor_id !== ''"
            cols="6"
          >
            <span class="pull-right">
              <el-button
                type="primary"
                @click="createContract()"
              >Create</el-button>
            </span>
          </b-col>
        </b-row>
      </div>
      <div
        v-if="form.vendor_id !== ''"
      >
        <el-row
          v-if="!loading"
          :gutter="6"
        >
          <el-col
            :xs="24"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <b-card>
              <b-card-body class="d-flex justify-content-between align-items-center">
                <b-avatar
                  variant="light-dark"
                  size="50"
                >
                  <feather-icon
                    size="35"
                    icon="FileTextIcon"
                  />
                </b-avatar>
                <div class="truncate">
                  <h2
                    class="mb-25 font-weight-bolder"
                  >
                    {{ total_contracts }}
                  </h2>
                  <span>Total Contracts</span>
                </div>
              </b-card-body>
            </b-card>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <b-card>
              <b-card-body class="d-flex justify-content-between align-items-center">
                <b-avatar
                  variant="light-success"
                  size="50"
                >
                  <feather-icon
                    size="35"
                    icon="CheckCircleIcon"
                  />
                </b-avatar>
                <div class="truncate">
                  <h2
                    class="mb-25 font-weight-bolder"
                  >
                    {{ active_contracts }}
                  </h2>
                  <span>Active Contracts</span>
                </div>
              </b-card-body>
            </b-card>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <b-card>
              <b-card-body class="d-flex justify-content-between align-items-center">
                <b-avatar
                  variant="light-warning"
                  size="50"
                >
                  <feather-icon
                    size="35"
                    icon="DiscIcon"
                  />
                </b-avatar>
                <div class="truncate">
                  <h2
                    class="mb-25 font-weight-bolder"
                  >
                    {{ renewed_contracts }}
                  </h2>
                  <span>Renewed Contracts</span>
                </div>
              </b-card-body>
            </b-card>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <b-card>
              <b-card-body class="d-flex justify-content-between align-items-center">
                <b-avatar
                  variant="light-danger"
                  size="50"
                >
                  <feather-icon
                    size="35"
                    icon="AlertCircleIcon"
                  />
                </b-avatar>
                <div class="truncate">
                  <h2
                    class="mb-25 font-weight-bolder"
                  >
                    {{ expired_contracts }}
                  </h2>
                  <span>Expired Contracts</span>
                </div>
              </b-card-body>
            </b-card>
          </el-col>
        </el-row>
        <v-client-table
          v-model="contracts"
          v-loading="loading"
          :columns="columns"
          :options="options"
        >
          <div
            slot="file_link"
            slot-scope="{row}"
          >
            <span @click="viewDocument(baseServerUrl+'storage/'+row.file_link)">
              <img
                src="images/pdf.png"
                alt="Image"
                width="20"
              >
              <small style="font-weight: 900; padding: 10px">Click to view</small>

            </span>
          </div>
          <div
            slot="sla"
            slot-scope="{row}"
          >
            <el-button
              v-if="row.sla !== null"
              type="success"
              icon="el-icon-document"
              @click="manageSla(row)"
            >View</el-button>
          </div>
          <div
            slot="action"
            slot-scope="{row}"
          >
            <el-button-group>
              <el-tooltip content="Edit Contract">
                <el-button
                  type="default"
                  icon="el-icon-edit"
                  plain
                  @click="editEntry(row)"
                />
              </el-tooltip>
              <el-tooltip content="Renew Contract">
                <el-popover
                  placement="left"
                  width="550"
                  trigger="click"
                >
                  <div style="background: #bbe0b2; color: #000000; padding: 10px; text-align: left; border-radius: 5px;">
                    <strong>Kindly provide a brief note about this renewal action.</strong>
                    <el-input
                      v-model="renewalForm.renewal_details.notes"
                      placeholder="Type here..."
                      type="textarea"
                    />
                    <br><br>
                    <el-button
                      :loading="loadButton"
                      size="mini"
                      type="primary"
                      plain
                      :disabled="renewalForm.renewal_details.notes === ''"
                      @click="renewContract(row, 'Renewed')"
                    >
                      Submit
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    type="default"
                    plain
                    icon="el-icon-refresh"
                  />
                </el-popover>
              </el-tooltip>
              <el-tooltip content="Terminate Contract">
                <el-popover
                  placement="left"
                  width="550"
                  trigger="click"
                >
                  <div style="background: #e0b5b2; color: #000000; padding: 10px; text-align: left; border-radius: 5px;">
                    <strong>Kindly provide a brief note about this termination action.</strong>
                    <el-input
                      v-model="renewalForm.renewal_details.notes"
                      placeholder="Type here..."
                      type="textarea"
                    />
                    <br><br>
                    <el-button
                      :loading="loadButton"
                      size="mini"
                      type="primary"
                      plain
                      :disabled="renewalForm.renewal_details.notes === ''"
                      @click="renewContract(row, 'Terminated')"
                    >
                      Submit
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    type="default"
                    plain
                    icon="el-icon-close"
                  />
                </el-popover>
              </el-tooltip>
              <!-- <el-tooltip content="View SLA">
                <el-button
                  :disabled="row.sla === null"
                  size="small"
                  type="default"
                  plain
                  icon="el-icon-document"
                  @click="manageSla(row)"
                />
              </el-tooltip> -->
            </el-button-group>
          </div>
        </v-client-table>
      </div>
      <el-dialog
        v-if="dialogFormVisible"
        v-model="dialogFormVisible"
        :title="`Create New Contract Document for ${selectedVendor.name}`"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="contractForm">
          <el-form-item
            label="Unique Title of the Contract Document"
          >
            <el-input
              v-model="contractForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="Start Date"
          >
            <el-date-picker
              v-model="contractForm.start_date"
              type="date"
              placeholder="Set Start Date"
              style="width: 100%;"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="Expiry Date"
          >
            <el-date-picker
              v-model="contractForm.expiry_date"
              type="date"
              placeholder="Set Expiry Date"
              style="width: 100%;"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="Upload Contract Document"
          >
            <input
              class="form-control"
              type="file"
              @change="onImageChange"
            >
            <small>Acceptable file formats is PDF</small>
          </el-form-item>

        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="saveContract()"
          >Submit</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-if="showDocumentModal"
        v-model="showDocumentModal"
        :visible.sync="showDocumentModal"
        title="Contract Document"
      >

        <iframe
          class="doc"
          :src="selectedDocument"
          width="650"
          height="500"
        />

      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import {
  BRow, BCol, BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
  // import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
// import ConfigureSla from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/ConfigureSLA.vue'
import SlaPerformanceScore from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SLAPerformanceScore.vue'
// import SetupPerformanceMetrics from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SetupPerformanceMetrics.vue'

export default {
  components: {
    // ConfigureSla,
    SlaPerformanceScore,
    // SetupPerformanceMetrics,
    BCard,
    BCardBody,
    BAvatar,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      activeName: 'first',
      pickerOptions: {
        disabledDate(date) {
          const d = new Date() // today
          d.setDate(d.getDate())
          return date > d
        },
      },
      dialogFormVisible: false,
      showDocumentModal: false,
      selectedDocument: '',
      loading: false,
      loadButton: false,
      pageLength: 10,
      dir: false,
      total_contracts: 0,
      active_contracts: 0,
      renewed_contracts: 0,
      expired_contracts: 0,
      vendors: [],
      selectedVendor: null,
      contracts: [],
      columns: [
        'contract_no',
        'title',
        'file_link',
        'start_date',
        'expiry_date',
        'status',
        'sla',
        'action',
      ],

      options: {
        headings: {
          file_link: 'File',
          action: '',
          // id: 'S/N',
        },
        filterByColumn: false,
        sortable: [],
        filterable: false,
      },
      contractForm: {
        id: '',
        title: '',
        start_date: '',
        expiry_date: '',
        uploadableFile: null,
      },
      renewalForm: {
        renewal_details: { status: '', notes: '' },
      },
      form: {
        vendor_id: '',
        client_id: '',
      },
      selectedContract: null,
      manageContractSLA: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  mounted() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    initialize() {
      this.fetchContracts()
      this.fetchContractsAnalysis()
    },
    editEntry(row) {
      const app = this
      app.contractForm = row
      app.contractForm.uploadableFile = null
      app.dialogFormVisible = true
    },
    onImageChange(e) {
      const app = this
      // console.log(e.target.files[0].type)
      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf') {
        app.$alert('Only .pdf file format is accepted')
        return false
      }
      // eslint-disable-next-line prefer-destructuring
      app.contractForm.uploadableFile = e.target.files[0]
      return true
    },
    manageSla(contract) {
      const app = this
      app.selectedContract = contract
      app.manageContractSLA = true
    },
    viewDocument(doc) {
      const app = this
      app.showDocumentModal = true
      app.selectedDocument = doc
    },
    saveContract() {
      const app = this
      if (app.contractForm.title === '') {
        app.$alert('Please provide a title for this document')
        return false
      }
      // if (app.contractForm.uploadableFile === null) {
      //   app.$alert('Please upload a Contract Document with .pdf file format')
      //   return false
      // }
      app.loading = true
      const formData = new FormData()
      formData.append('client_id', app.selectedClient.id)
      formData.append('vendor_id', app.selectedVendor.id)
      formData.append('id', app.contractForm.id)
      formData.append('title', app.contractForm.title)
      formData.append('start_date', app.contractForm.start_date)
      formData.append('expiry_date', app.contractForm.expiry_date)
      formData.append('file_uploaded', app.contractForm.uploadableFile)
      const uploadEvidenceResource = new Resource('vdd/client-contracts/upload-contract')
      uploadEvidenceResource.store(formData)
        .then(() => {
          app.fetchContracts()
          app.$message({
            type: 'success',
            message: 'Contract uploaded successfully',
          })
          app.contractForm = {
            title: '',
            start_date: '',
            expiry_date: '',
            uploadableFile: null,
          }
          app.dialogFormVisible = false
          app.loading = false
        }).catch(() => { app.loading = false })

      return true
    },
    showDetails(value) {
      const app = this
      app.showInvoiceDetails = value
    },
    createContract() {
      const app = this
      app.dialogFormVisible = true
    },
    fetchVendors() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-approved-vendors')
      fetchStaffResource.list({ all: true })
        .then(response => {
          app.vendors = response.vendors
          app.loading = false
        })
    },
    renewContract(contract, status) {
      const app = this
      app.loadButton = true
      const { renewalForm } = app
      renewalForm.status = status
      renewalForm.renewal_details.status = status
      const fetchContractsResource = new Resource('vdd/client-contracts/renewal')
      fetchContractsResource.update(contract.id, renewalForm)
        .then(() => {
          app.loadButton = false
          app.fetchContracts()
        })
    },
    fetchContracts() {
      const app = this
      app.loading = true
      const { form } = app
      form.client_id = app.selectedClient.id
      form.vendor_id = app.selectedVendor.id
      const fetchContractsResource = new Resource('vdd/client-contracts/fetch')
      fetchContractsResource.list(form)
        .then(response => {
          app.contracts = response.contracts
          app.loading = false
        })
    },
    fetchContractsAnalysis() {
      const app = this
      app.loading = true
      const invoicesResource = new Resource('vdd/reports/vendor-contracts-analysis')
      invoicesResource.list({ client_id: app.selectedClient.id, vendor_id: app.selectedVendor.id })
        .then(response => {
          app.total_contracts = response.total_contracts
          app.active_contracts = response.active_contracts
          app.renewed_contracts = response.renewed_contracts
          app.expired_contracts = response.expired_contracts
          app.loading = false
        }).catch(() => { app.loading = false })
    },
  },
}
</script>
