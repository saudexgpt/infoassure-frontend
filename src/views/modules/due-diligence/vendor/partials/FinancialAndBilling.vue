<template>
  <el-card>
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
        <b-col
          cols="3"
        >
          <span class="pull-right">
            <el-dropdown @command="handleCreationCommand">
              <el-button type="primary">
                New Invoice <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="generate">Generate</el-dropdown-item>
                <el-dropdown-item command="upload">Upload Invoice</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button
              type="primary"
              icon="document"
              @click="showCreateModal = true"
            >Create New Invoice</el-button> -->
          </span>
        </b-col>
      </b-row>
      <hr>
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
        style="cursor:pointer"
        @click="initialize()"
      >

        <el-tooltip content="Refresh">
          <feather-icon
            icon="RefreshCwIcon"
            class="ml-50"
            size="30"
          />
        </el-tooltip>
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
      <v-client-table
        v-model="invoices"
        v-loading="loading"
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
                width="550"
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
                width="550"
                height="500"
              />
            </el-col>
          </el-row>
          <v-client-table
            v-if="props.row.invoice_items.length > 0"
            v-model="props.row.invoice_items"
            :columns="['description', 'quantity', 'amount', 'action']"
            :options="{ filterable: false }"
          >
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
              <span v-if="props.row.invoice_items.length > 1">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Delete Invoice item"
                  placement="top-start"
                >
                  <el-button
                    v-if="props.row.status === 'Pending'"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="destroyInvoiceItem(props.row, row.id)"
                  />
                </el-tooltip>
              </span>
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
          slot="invoice_approval"
          slot-scope="{row}"
        >
          <div>
            {{ (row.invoice_approval !== null && row.invoice_approval.action === 'Approve') ? 'Approved' : (row.invoice_approval !== null && row.invoice_approval.action === 'Reject') ? 'Rejected' : 'Pending' }} <br>
            <small v-if="row.invoice_approval !== null"><em>{{ row.invoice_approval.details }}</em></small>
          </div>
        </div>
        <div
          slot="action"
          slot-scope="props"
        >
          <span>
            <el-tooltip
              class="item"
              effect="dark"
              content="Edit Invoice"
              placement="top-start"
            >
              <el-button
                v-if="props.row.status === 'Pending' && props.row.invoice_link === null"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editRow(props.row)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Confirm Payment"
              placement="top-start"
            >
              <el-button
                v-if="props.row.status === 'Paid' && props.row.is_confirmed === 0"
                size="mini"
                type="warning"
                icon="el-icon-check"
                @click="confirmPayment(props.row)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Delete Invoice"
              placement="top-start"
            >
              <el-button
                v-if="props.row.status === 'Pending'"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="destroyInvoice(props.row)"
              />
            </el-tooltip>
            <el-tag
              v-if="props.row.is_confirmed === 1"
              type="success"
            >Payment Confirmed</el-tag>
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
    <b-modal
      v-if="showUploadModal"
      v-model="showUploadModal"
      title="Upload Existing Invoice File"
      centered
      size="xl"
      hide-footer
    >

      <upload-invoice-file
        :vendor-id="vendorId"
        @saved="fetchInvoices(); showUploadModal = false"
      />

    </b-modal>
    <b-modal
      v-if="showEditModal"
      v-model="showEditModal"
      title="Edit Invoice"
      centered
      size="xl"
      hide-footer
    >

      <edit-invoice
        :invoice="selectedInvoice"
        @updated="fetchInvoices"
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
import CreateInvoice from './CreateInvoice.vue'
import UploadInvoiceFile from './UploadInvoiceFile.vue'
import EditInvoice from './EditInvoice.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BAvatar,
    Pagination,
    CreateInvoice,
    EditInvoice,
    UploadInvoiceFile,
  },
  directives: {
    'b-tooltip': VBTooltip,
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
      downloadLoading: false,
      showCreateModal: false,
      showEditModal: false,
      showUploadModal: false,
      pageLength: 10,
      dir: false,
      currency: '₦',
      columns: [
        'action',
        'invoice_no',
        'subtotal',
        'discount',
        'amount',
        'due_date',
        'invoice_approval',
        'status',
        'payment_date',
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          invoice_approval: 'Approval',
          status: 'Status',
          action: 'Action',

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
        // filterable: [
        //   'name',
        //   'contact_email',
        //   'contact_phone',
        // ],
      },
      total_invoices: 0,
      pending_invoices: 0,
      overdue_invoices: 0,
      paid_invoices: 0,
      showEditForm: false,
      invoices: [],
      loading: false,
      selectedInvoice: null,
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
  },
  created() {
    this.fetchInvoices()
    this.fetchInvoiceAnalysis()
  },
  methods: {
    checkPermission,
    checkRole,
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
    handleCreationCommand(command) {
      const app = this
      if (command === 'generate') {
        app.showCreateModal = true
      }
      if (command === 'upload') {
        app.showUploadModal = true
      }
    },
    fetchInvoices() {
      const app = this
      const { limit, page } = this.query
      const form = app.query
      form.vendor_id = app.vendorId
      app.loading = true
      const fetchStaffResource = new Resource('vdd/invoices')
      fetchStaffResource.vList(form)
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
    fetchInvoiceAnalysis() {
      const app = this
      app.loading = true
      const invoicesResource = new Resource('vdd/vendor-reports/vendor-invoices-analysis')
      invoicesResource.vList({ vendor_id: app.vendorId })
        .then(response => {
          app.total_invoices = response.total_invoices
          app.pending_invoices = response.pending_invoices
          app.overdue_invoices = response.overdue_invoices
          app.paid_invoices = response.paid_invoices
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    editRow(invoice) {
      const app = this
      app.selectedInvoice = invoice
      app.showEditModal = true
    },
    confirmPayment(invoice) {
      const app = this
      app.$confirm(`This will confirm the payment of invoice ${invoice.invoice_no}. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        const fetchStaffResource = new Resource('vdd/invoices/confirm-payment')
        fetchStaffResource.vUpdate(invoice.id)
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
    destroyInvoice(invoice) {
      const app = this
      app.$confirm(`This will delete invoice ${invoice.invoice_no} and it cannot be undone. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        const fetchStaffResource = new Resource('vdd/invoices/destroy')
        fetchStaffResource.vDestroy(invoice.id)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Invoice Deleted',
            })
            app.fetchInvoices()
            app.loading = false
          }).catch(app.loading = false)
      }).catch()
    },
    destroyInvoiceItem(invoice, itemId) {
      const app = this
      app.$confirm(`This will delete this item from invoice ${invoice.invoice_no} and it cannot be undone. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        const fetchStaffResource = new Resource('vdd/invoices/destroy-invoice-item')
        fetchStaffResource.vDestroy(itemId)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Invoice Item Deleted',
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
