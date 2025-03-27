<template>
  <el-card>
    <div v-if="showInvoiceDetails">
      <div slot="header">
        <span>
          <el-button
            type="danger"
            @click="fetchInvoices(); showInvoiceDetails = false; $emit('details', false)"
          >
            Back
          </el-button>
        </span>
        <hr>
      </div>
      <invoice-details :selected-invoice="selectedInvoice" />
    </div>
    <div
      v-else
    >
      <el-row
        v-if="loading"
        :gutter="15"
      >
        <el-col
          v-for="(count, count_index) in 4"
          :key="count_index"
          :xs="24"
          :sm="24"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <el-card>
            <el-skeleton
              :loading="loading"
              :rows="3"
              animated
            />
          </el-card>
        </el-col>
      </el-row>
      <span
        v-if="!loading"
      >
        <el-button
          type="primary"
          plain
          @click="initialize()"
        >
          <feather-icon
            icon="RefreshCwIcon"
            class="ml-50"
          /> Refresh
        </el-button>
      </span>
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
                  {{ total_invoices }}
                </h2>
                <span>Total Invoices</span>
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
                  icon="AlertCircleIcon"
                />
              </b-avatar>
              <div class="truncate">
                <h2
                  class="mb-25 font-weight-bolder"
                >
                  {{ pending_invoices }}
                </h2>
                <span>Pending Invoices</span>
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
                  icon="DiscIcon"
                />
              </b-avatar>
              <div class="truncate">
                <h2
                  class="mb-25 font-weight-bolder"
                >
                  {{ overdue_invoices }}
                </h2>
                <span>Overdue Invoices</span>
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
                  {{ paid_invoices }}
                </h2>
                <span>Paid Invoices</span>
              </div>
            </b-card-body>
          </b-card>
        </el-col>
      </el-row>
      <b-row>
        <b-col
          cols="6"
        >
          <h3>
            List of Invoices
          </h3>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <el-button
              v-if="invoices.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              plain
              icon="el-icon-download"
              @click="handleDownload('List of invoices', invoices)"
            >Export Excel</el-button>
          </span>
        </b-col>
      </b-row>
      <el-popover
        placement="right"
        width="400"
        trigger="click"
      >
        <el-row :gutter="10">
          <p>Filter using the fields below</p>
          <div style="margin-bottom: 5px;">
            <el-input
              v-model="query.invoice_no"
              placeholder="Invoice Number"
            />
          </div>
          <div style="margin-bottom: 5px;">
            <el-input
              v-model="query.amount"
              placeholder="Amount"
            >
              <template slot="prepend">
                {{ currency }}
              </template>
            </el-input>
            <br>
          </div>
          <div style="margin-bottom: 5px;">
            <el-date-picker
              v-model="query.due_date"
              type="date"
              placeholder="Due Date"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </div>
          <div style="margin-bottom: 5px;">
            <el-select
              v-model="query.status"
              placeholder="Invoice Status"
              style="width: 100%"
            >
              <el-option
                v-for="(status, status_index) in ['Pending', 'Overdue', 'Paid']"
                :key="status_index"
                :value="status"
                :label="status"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px;">
            <el-select
              v-model="query.invoice_approval"
              placeholder="Invoice Status"
              style="width: 100%"
            >
              <el-option
                v-for="(status, status_index) in [{ label: 'Approved', value: 'Approve'}, { label: 'Rejected', value: 'Reject'}]"
                :key="status_index"
                :value="status.value"
                :label="status.label"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px;">
            <el-button
              type="primary"
              @click="fetchInvoices"
            >
              Submit Query
            </el-button>
            <el-button
              type="default"
              @click="clearFields"
            >
              Clear Fields
            </el-button>
          </div>
        </el-row>
        <el-button slot="reference">
          Filter By
        </el-button>
      </el-popover>
      <hr>
      <v-client-table
        v-model="invoices"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
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
          <el-button
            type="success"
            @click="showSelectedInvoiceDetails(row)"
          >
            Show Details
          </el-button>
        </div>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 10"
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
  BRow, BCol, VBTooltip, BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/components/Pagination-main/index.vue'
import InvoiceDetails from './InvoiceDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    Pagination,
    InvoiceDetails,
    BCard,
    BCardBody,
    BAvatar,
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
      showInvoiceDetails: false,
      selectedInvoice: null,
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
        sortable: [],
        filterable: false,
      },
      showEditForm: false,
      invoices: [],
      loading: false,
      approvalLoading: false,
      total_invoices: 0,
      pending_invoices: 0,
      overdue_invoices: 0,
      paid_invoices: 0,
      query: {
        page: 1,
        limit: 50,
        vendor_id: '',
        status: '',
        amount: '',
        due_date: '',
        invoice_no: '',
        invoice_approval: '',
      },
      total: 0,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    vendorId() {
      this.initialize()
    },
  },
  mounted() {
    this.initialize()
  },
  methods: {
    checkPermission,
    checkRole,
    initialize() {
      this.fetchInvoices()
      this.fetchInvoiceAnalysis()
    },
    showSelectedInvoiceDetails(invoice) {
      const app = this
      app.showInvoiceDetails = true
      app.selectedInvoice = invoice
      app.$emit('details', true)
    },
    clearFields() {
      const app = this

      app.query = {
        page: app.query.page,
        limit: app.query.limit,
        vendor_id: '',
        status: '',
        amount: '',
        due_date: '',
        invoice_no: '',
        invoice_approval: '',
      }
      app.fetchInvoices()
    },
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
        }).catch(() => { app.loading = false })
    },
    fetchInvoiceAnalysis() {
      const app = this
      app.loading = true
      const invoicesResource = new Resource('vdd/reports/vendor-invoices-analysis')
      invoicesResource.list({ client_id: app.selectedClient.id, vendor_id: app.vendorId })
        .then(response => {
          app.total_invoices = response.total_invoices
          app.pending_invoices = response.pending_invoices
          app.overdue_invoices = response.overdue_invoices
          app.paid_invoices = response.paid_invoices
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    handleDownload(tableTitle, invoicesList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'INVOICE NO',
          `SUBTOTAL (${this.currency})`,
          `DISCOUNT (${this.currency})`,
          `TOTAL AMOUNT (${this.currency})`,
          'DUE DATE',
          'STATUS',
          'PAYMENT DATE',
        ]
        const filterVal = [
          'invoice_no',
          'subtotal',
          'discount',
          'amount',
          'due_date',
          'status',
          'payment_date',
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
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
