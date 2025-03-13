<template>
  <el-card>
    <div v-if="manageContractSLA">
      <div slot="header">
        <span>
          <el-button
            type="danger"
            @click="fetchContracts(); manageContractSLA = false;"
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
        </el-tab-pane> -->
        <el-tab-pane
          label="SLA Configuration"
          name="first"
          lazy
        >
          <configure-sla :selected-contract="selectedContract" />
        </el-tab-pane>
        <el-tab-pane
          v-if="selectedContract.sla !== null"
          label="Performance Scorecard"
          name="second"
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
              @input="fetchContracts()"
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
      <v-client-table
        v-if="form.vendor_id !== ''"
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
          slot="action"
          slot-scope="{row}"
        >
          <el-button
            type="success"
            @click="manageSla(row)"
          >
            Manage SLA
          </el-button>
        </div>
      </v-client-table>
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
              v-model="form.start_date"
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
              v-model="form.expiry_date"
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
  BRow, BCol,
} from 'bootstrap-vue'
  // import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import ConfigureSla from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/ConfigureSLA.vue'
import SlaPerformanceScore from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SLAPerformanceScore.vue'
// import SetupPerformanceMetrics from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SetupPerformanceMetrics.vue'

export default {
  components: {
    ConfigureSla,
    SlaPerformanceScore,
    // SetupPerformanceMetrics,
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
      pageLength: 10,
      dir: false,
      vendors: [],
      selectedVendor: null,
      contracts: [],
      columns: [
        'title',
        'file_link',
        'start_date',
        'expiry_date',
        'action',
        // 'user.password_status',
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
        title: '',
        start_date: '',
        expiry_date: '',
        uploadableFile: null,
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
      app.loading = true
      const formData = new FormData()
      formData.append('client_id', app.selectedClient.id)
      formData.append('vendor_id', app.selectedVendor.id)
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
          app.dialogFormVisible = false
          app.loading = false
        }).catch(() => { app.loading = false })
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
  },
}
</script>
