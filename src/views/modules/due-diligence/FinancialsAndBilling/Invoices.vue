<template>
  <el-card
    v-loading="loading"
  >
    <div
      slot="header"
    >
      <b-row>
        <b-col
          cols="9"
        >
          <h3>
            List of Invoices
          </h3>
        </b-col>
      </b-row>
      <hr>
      <!-- <span class="pull-right">
            <el-button
              v-if="invoices.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of invoices', invoices)"
            >Export Excel</el-button>
          </span> -->
      <v-client-table
        v-model="invoices"
        :columns="columns"
        :options="options"
      >
        <div
          slot="child_row"
          slot-scope="props"
        >
          <el-alert
            type="error"
            :closable="false"
          >
            Invoice Details for {{ props.row.invoice_no }}
          </el-alert>
          <el-row :gutter="10">
            <el-col
              v-if="props.row.invoice_link !== null"
              :md="12"
            >
              <h3>Uploaded Invoice</h3>
              <iframe
                class="pdf"
                :src="baseServerUrl+'storage/'+props.row.invoice_link"
                width="600"
                height="500"
              />
            </el-col>
            <el-col
              v-if="props.row.payment_evidence !== null"
              :md="12"
            >
              <h3>Uploaded payment evidence</h3>
              <iframe

                class="pdf"
                :src="baseServerUrl+'storage/'+props.row.payment_evidence"
                width="600"
                height="500"
              />
            </el-col>
          </el-row>

          <v-client-table
            v-if="props.row.invoice_items.length > 0"
            v-model="props.row.invoice_items"
            :columns="['description', 'quantity', 'amount']"
            :options="{ filterable: false }"
          >
            <div
              slot="amount"
              slot-scope="{row}"
            >
              {{ currency }}{{ Number(row.amount).toLocaleString() }}
            </div>
          </v-client-table>
        </div>
        <div
          slot="subtotal"
          slot-scope="{row}"
        >
          {{ currency }}{{ Number(row.subtotal).toLocaleString() }}
        </div>
        <div
          slot="discount"
          slot-scope="{row}"
        >
          {{ currency }}{{ Number(row.discount).toLocaleString() }}
        </div>
        <div
          slot="amount"
          slot-scope="{row}"
        >
          {{ currency }}{{ Number(row.amount).toLocaleString() }}
        </div>
        <div
          slot="action"
          slot-scope="{row}"
        >
          <span>
            <el-tooltip
              class="item"
              effect="dark"
              content="Mark Invoice as Paid"
              placement="top-start"
            >
              <el-button
                v-if="row.status !== 'Paid'"
                size="small"
                type="success"
                icon="el-icon-check"
                @click="makePayment(row, row.id)"
              />
            </el-tooltip>

            <div v-if="row.status === 'Paid'">
              <el-tag
                v-if="row.is_confirmed === 0"
                type="info"
              >Awaiting Confirmation</el-tag>
              <el-tag
                v-if="row.is_confirmed === 1"
                type="success"
              >Payment Confirmed</el-tag>
            </div>

            <el-popover
              placement="left"
              title="Upload payment evidence"
              width="400"
              trigger="hover"
            >
              <small>Acceptable file formats are .pdf, .jpg & .png</small>
              <input
                class="form-control"
                type="file"
                @change="onImageChange($event, row.id)"
              >
              <el-button
                v-if="row.payment_evidence === null"
                slot="reference"
                size="small"
                type="info"
                icon="el-icon-upload2"
                style="margin-left: 3px"
              />
            </el-popover>
          </span>
        </div>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchInvoices"
        />
      </el-row>
    </div>
    <b-modal
      v-if="showCreateModal"
      v-model="showCreateModal"
      title="Create New Invoice"
      centered
      size="xl"
      hide-footer
    >

      <create-invoice
        :vendor-id="vendorId"
        @saved="fetchInvoices"
      />

    </b-modal>
  </el-card>
</template>

<script>
import {
  BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/components/Pagination-main/index.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    Pagination,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    vendorId: {
      type: Number,
      default: () => (null),
    },
  },
  data() {
    return {
      downloadLoading: false,
      showCreateModal: false,
      pageLength: 10,
      dir: false,
      currency: '₦',
      columns: [
        'invoice_no',
        'subtotal',
        'discount',
        'amount',
        'due_date',
        'status',
        'payment_date',
        'action',
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          is_active: 'Status',
          action: '',

          // id: 'S/N',
        },
        filterByColumn: false,
        rowAttributesCallback(row) {
          if (row.status === 'Pending') {
            return { style: 'background: #f5f1d3; color: #000000' }
          }
          if (row.status === 'Overdue') {
            return { style: 'background: #f5dbd3; color: #000000' }
          }
          //   if (row.status === 'Paid') {
          //     return { style: 'background: #eaf8e5; color: #000000' }
          //   }
          return {}
        },
        sortable: [
          'name',
          'contact_email',
          'contact_phone',
        ],
        // filterable: false,
        filterable: [
          'name',
          'contact_email',
          'contact_phone',
        ],
      },
      showEditForm: false,
      invoices: [],
      loading: false,
      selectedClient: null,
      selectedClientUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
        vendor_id: '',
      },
      total: 0,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  watch: {
    vendorId() {
      this.fetchInvoices()
    },
  },
  created() {
    this.fetchInvoices()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchInvoices() {
      const app = this
      const { limit, page } = this.query
      const form = app.query
      form.vendor_id = app.vendorId
      app.loading = true
      const fetchStaffResource = new Resource('vdd/vendor-invoices')
      fetchStaffResource.list(form)
        .then(response => {
          app.invoices = response.invoices.data
          app.invoices.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.invoices.total
          app.loading = false
        }).catch(app.loading = false)
    },
    onImageChange(e, invoiceId) {
      const app = this
      console.log(e.target.files[0].type)
      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf' && fileType !== 'image/jpeg' && fileType !== 'image/png') {
        app.$alert('Acceptable file formats are .pdf, .jpg & .png')
        return false
      }
      app.loading = true
      const formData = new FormData()
      formData.append('invoice_id', invoiceId)
      formData.append('file_uploaded', e.target.files[0])
      const uploadEvidenceResource = new Resource('vdd/invoices/upload-payment-evidence')
      uploadEvidenceResource.store(formData)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Evidence uploaded successfully',
          })
          app.fetchInvoices()
          app.loading = false
        }).catch(app.loading = false)
      return true
    },
    makePayment(invoice) {
      const app = this
      app.$confirm(`This will attest that you have actually made payment for invoice ${invoice.invoice_no}. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        const fetchStaffResource = new Resource('vdd/invoices/make-payment')
        fetchStaffResource.update(invoice.id)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Payment Confirmed Successfully',
            })
            app.fetchInvoices()
            app.loading = false
          }).catch(app.loading = false)
      }).catch()
    },
    handleDownload(tableTitle, invoicesList) {
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
        const list = invoicesList
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
    <style lang="scss" >
    @import '@core/scss/vue/libs/vue-good-table.scss';
    </style>
