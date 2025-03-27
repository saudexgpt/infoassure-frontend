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
      <configure-sla :selected-contract="selectedContract" />
      <!-- <el-tabs v-model="activeName">
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
      </el-tabs> -->
    </div>
    <div v-else>
      <div
        slot="header"
      >
        <b-row>
          <b-col
            cols="12"
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
            size="small"
            type="success"
            @click="manageSla(row)"
          >
            Manage SLA
          </el-button>
          <el-button
            size="small"
            type="info"
            @click="editEntry(row)"
          >
            Edit
          </el-button>
        </div>
      </v-client-table>
      <el-dialog
        v-if="dialogFormVisible"
        v-model="dialogFormVisible"
        title="Create New Contract Document"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="contractForm">
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
              format="yyyy-MM-dd"
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
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
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
import ConfigureSla from '@/views/modules/DUE-DILIGENCE/vendor/partials/ConfigureSLA.vue'
// import SlaPerformanceScore from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SLAPerformanceScore.vue'
// import SetupPerformanceMetrics from '@/views/modules/DUE-DILIGENCE/ContractAndSLA/partials/SetupPerformanceMetrics.vue'

export default {
  components: {
    ConfigureSla,
    // SlaPerformanceScore,
    // SetupPerformanceMetrics,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    vendorId: {
      type: Number,
      required: true,
    },
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
      contracts: [],
      columns: [
        'action',
        'contract_no',
        'title',
        'file_link',
        'start_date',
        'expiry_date',
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
        id: '',
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
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  mounted() {
    this.fetchContracts()
  },
  methods: {
    checkPermission,
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
      // attempt extracting file content
      // app.convertPdfToText(e.target.files[0])
      // eslint-disable-next-line prefer-destructuring
      app.contractForm.uploadableFile = e.target.files[0]
      return true
    },
    convertPdfToText(file) {
      const app = this
      app.loading = true
      const formData = new FormData()
      formData.append('file_uploaded', file)
      const uploadEvidenceResource = new Resource('vdd/pdf-to-text')
      uploadEvidenceResource.vStore(formData)
        .then(response => {
          console.log(response)
        }).catch(() => { app.loading = false })
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
      //   if (app.contractForm.uploadableFile === null) {
      //     app.$alert('Please upload a Contract Document with .pdf file format')
      //     return false
      //   }
      app.loading = true
      const formData = new FormData()
      // formData.append('client_id', app.vendor.client_id)
      formData.append('vendor_id', app.vendorId)
      formData.append('id', app.contractForm.id)
      formData.append('title', app.contractForm.title)
      formData.append('start_date', app.contractForm.start_date)
      formData.append('expiry_date', app.contractForm.expiry_date)
      formData.append('file_uploaded', app.contractForm.uploadableFile)
      const uploadEvidenceResource = new Resource('vdd/vendor-contracts/upload-contract')
      uploadEvidenceResource.vStore(formData)
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
    fetchContracts() {
      const app = this
      app.loading = true
      const { form } = app
      // form.client_id = app.vendor.client_id
      form.vendor_id = app.vendorId
      const fetchContractsResource = new Resource('vdd/vendor-contracts/fetch')
      fetchContractsResource.vList(form)
        .then(response => {
          app.contracts = response.contracts
          app.loading = false
        })
    },
  },
}
</script>
