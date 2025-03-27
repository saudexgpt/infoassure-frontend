<template>
  <el-card>
    <div v-if="showTicketDetails">
      <div slot="header">
        <span>
          <el-button
            type="danger"
            @click="fetchTickets(); showTicketDetails = false; $emit('details', false)"
          >
            Back
          </el-button>
        </span>
        <hr>
      </div>
      <TicketDetails :selected-ticket="selectedTicket" />
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
      <el-row v-if="!loading">
        <el-col :xs="24">
          <span
            class="pull-right"
          >
            <el-button
              size="size"
              type="dark"
              plain
              @click="initialize()"
            >
              <feather-icon
                icon="RefreshCwIcon"
                class="ml-50"
              /> Refresh
            </el-button>
          </span>
        </el-col>
      </el-row>
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
                  {{ total_tickets }}
                </h2>
                <span>Total Tickets</span>
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
                  {{ open_tickets }}
                </h2>
                <span>Open Tickets</span>
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
                  {{ in_progress_tickets }}
                </h2>
                <span>In Progress</span>
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
                  {{ resolved_tickets }}
                </h2>
                <span>Resolved</span>
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
            Tickets
          </h3>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <el-button
              size="size"
              type="primary"
              @click="dialogFormVisible = true"
            >
              <feather-icon
                icon="PlusIcon"
                class="ml-50"
              /> Create Ticket
            </el-button>
            <!-- <el-button
              v-if="tickets.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              plain
              icon="el-icon-download"
              @click="handleDownload('List of tickets', tickets)"
            >Export Excel</el-button> -->
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
              v-model="query.ticket_no"
              placeholder="Ticket Number"
            />
          </div>
          <div style="margin-bottom: 5px;">
            <el-select
              v-model="query.category"
              placeholder="Select Category"
              style="width: 100%"
            >
              <el-option
                v-for="(category, index) in categories"
                :key="index"
                :value="category"
                :label="category"
              />
            </el-select>
            <br>
          </div>
          <div style="margin-bottom: 5px;">
            <el-date-picker
              v-model="query.date"
              type="date"
              placeholder="Date"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </div>
          <div style="margin-bottom: 5px;">
            <el-select
              v-model="query.status"
              placeholder="Ticket Status"
              style="width: 100%"
            >
              <el-option
                v-for="(status, status_index) in statuses"
                :key="status_index"
                :value="status"
                :label="status"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px;">
            <el-select
              v-model="query.priority"
              placeholder="Ticket Priority"
              style="width: 100%"
            >
              <el-option
                v-for="(priority, status_index) in ticket_priorities"
                :key="status_index"
                :value="priority"
                :label="priority"
              />
            </el-select>
          </div>
          <div style="margin-bottom: 5px;">
            <el-button
              type="primary"
              @click="fetchTickets"
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
        v-model="tickets"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="action"
          slot-scope="{row}"
        >
          <el-button
            @click="showSelectedTicketDetails(row)"
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
          @pagination="fetchTickets"
        />
      </el-row>
    </div>
    <el-dialog
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      title="Create New Contract Document"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        v-loading="loading"
        :model="ticketForm"
      >
        <el-form-item
          label="Issue Category"
        >
          <el-select
            v-model="ticketForm.category"
            placeholder="Select Category"
            style="width: 100%"
          >
            <el-option
              v-for="(priority, index) in categories"
              :key="index"
              :value="priority"
              :label="priority"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Subject"
        >
          <el-input
            v-model="ticketForm.subject"
            placeholder="State the subject of issue"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="Message"
        >
          <ckeditor
            id="mesage"
            v-model="ticketForm.message"
            placeholder="Give details of the stated issue..."
            :editor="editor"
            :config="editorConfig"
          />
        </el-form-item>
        <el-form-item
          label="Resolution Priority"
        >
          <el-select
            v-model="ticketForm.priority"
            placeholder="Set Priority"
            style="width: 100%"
          >
            <el-option
              v-for="(priority, index) in ticket_priorities"
              :key="index"
              :value="priority"
              :label="priority"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="saveTicket()"
        >Submit</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/components/Pagination-main/index.vue'
import TicketDetails from './TicketDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    Pagination,
    TicketDetails,
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
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      showTicketDetails: false,
      selectedTicket: null,
      downloadLoading: false,
      dialogFormVisible: false,
      pageLength: 10,
      dir: false,
      currency: '₦',
      columns: [
        'ticket_no',
        'category',
        'subject',
        'priority',
        'status',
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
          if (row.status === 'In Progress') {
            return { style: 'background: #f5f1d3; color: #000000' }
          }
          if (row.status === 'Open') {
            return { style: 'background: #f5dbd3; color: #000000' }
          }
          //   if (row.status === 'Resolved') {
          //     return { style: 'background: #eaf8e5; color: #000000' }
          //   }
          return {}
        },
        sortable: [],
        filterable: false,
      },
      showEditForm: false,
      tickets: [],
      ticketForm: {
        category: '',
        subject: '',
        message: '',
        priority: 'Low',
      },
      categories: ['Onboarding issues', 'Risk & Compliance issues', 'Contract & SLAs issues', 'Financials & Billing issues', 'Technical issues', 'Others'],
      ticket_priorities: ['Low', 'Medium', 'High'],
      statuses: ['Open', 'In Progress', 'Resolved'],
      loading: false,
      approvalLoading: false,
      total_tickets: 0,
      open_tickets: 0,
      in_progress_tickets: 0,
      resolved_tickets: 0,
      query: {
        page: 1,
        limit: 50,
        vendor_id: '',
        status: '',
        category: '',
        date: '',
        ticket_no: '',
        priority: '',
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
    otherUserData() {
      return this.$store.getters.otherUserData
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
      this.fetchTickets()
      this.fetchTicketAnalysis()
    },
    showSelectedTicketDetails(ticket) {
      const app = this
      app.showTicketDetails = true
      app.selectedTicket = ticket
      app.$emit('details', true)
    },
    clearFields() {
      const app = this

      app.query = {
        page: app.query.page,
        limit: app.query.limit,
        vendor_id: '',
        status: '',
        ticket_no: '',
        category: '',
        date: '',
        priority: '',
      }
      app.fetchTickets()
    },
    saveTicket() {
      const app = this
      app.loading = true
      const form = app.ticketForm
      form.vendor_id = app.vendorId
      form.created_by = `${app.otherUserData.name} (${app.otherUserData.email})`
      const saveTicketsResource = new Resource('vdd/vendor-tickets/store')
      saveTicketsResource.vStore(form)
        .then(() => {
          app.dialogFormVisible = false
          app.ticketForm = {
            subject: '',
            message: '',
            priority: '',
          }
          app.initialize()
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchTickets() {
      const app = this
      const { limit, page } = this.query
      const form = app.query
      form.vendor_id = app.vendorId
      app.loading = true
      const fetchTicketResource = new Resource('vdd/vendor-tickets')
      fetchTicketResource.vList(form)
        .then(response => {
          app.tickets = response.tickets.data
          app.tickets.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.tickets.total
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchTicketAnalysis() {
      const app = this
      app.loading = true
      const ticketsResource = new Resource('vdd/vendor-reports/vendor-tickets-analysis')
      ticketsResource.vList({ vendor_id: app.vendorId })
        .then(response => {
          app.total_tickets = response.total_tickets
          app.open_tickets = response.open_tickets
          app.in_progress_tickets = response.in_progress_tickets
          app.resolved_tickets = response.resolved_tickets
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    handleDownload(tableTitle, ticketsList) {
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
          'ticket_no',
          'subtotal',
          'discount',
          'amount',
          'due_date',
          'status',
          'payment_date',
        ]
        const list = ticketsList
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
