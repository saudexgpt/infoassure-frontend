<template>
  <el-row
    v-loading="loading"
    :gutter="20"
  >
    <el-col :md="18">
      <el-card>
        <div slot="header">
          <span class="pull-right">
            <strong>Ticket No.: </strong>{{ selectedTicket.ticket_no }}
          </span>
          <strong>Subject: </strong>{{ selectedTicket.subject }}<br>
          <small>By {{ selectedTicket.created_by }}</small>
        </div>
        <div style="margin: 20px">
          <!-- eslint-disable-next-line vue/no-v-html-->
          <span v-html="selectedTicket.message" />
        </div>
      </el-card>
      <div
        style="height: 450px; overflow:auto;"
      >

        <div v-if="ticket.responses.length > 0">
          <el-timeline>
            <el-timeline-item
              v-for="(response, index) in ticket.responses"
              :key="index"
              :timestamp="`${moment(response.created_at).fromNow()} by ${response.response_by}`"
              placement="top"
              color="#0bbd87"
            >
              <el-card>
                <!-- eslint-disable-next-line vue/no-v-html-->
                <span v-html="response.message" />
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else>
          <el-empty
            description="No response is given yet"
          >
            <b-button
              block
              variant="primary"
              @click="dialogFormVisible = true"
            >Reply</b-button>
          </el-empty>
        </div>
      </div>
      <div class="fixed">
        <el-form
          v-loading="loadingResponse"
          :model="ticketForm"
        >
          <el-form-item
            label="Give Response"
          >
            <ckeditor
              id="mesage"
              v-model="ticketForm.message"
              placeholder="Give response here..."
              :editor="editor"
              :config="editorConfig"
            />
          </el-form-item>
          <div>
            <el-button
              class="pull-right"
              type="primary"
              plain
              @click="sendResponse()"
            >Send</el-button>
          </div>
        </el-form>
      </div>
    </el-col>
    <el-col :md="6">
      <span>
        <b-button
          v-if="ticket.status !== 'Resolved'"
          variant="success"
          plain
          @click="resolveTicket()"
        > Mark as Resolved
        </b-button>&nbsp;
        <b-button
          type="dark"
          plain
          @click="fetchTicketDetails()"
        > Refresh
        </b-button><hr>
        <el-tag>Priority: {{ ticket.priority }}</el-tag>&nbsp;
        <el-tag>Status: {{ ticket.status }}</el-tag>
      </span>
    </el-col>
  </el-row>
</template>
<script>
import { BButton } from 'bootstrap-vue'
import moment from 'moment'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: { BButton },
  props: {
    selectedTicket: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      uploadBulk: false,
      loading: false,
      loadingResponse: false,
      pageLength: 10,
      dir: false,
      vendors: [],
      ticket: {
        responses: [],
      },
      ticketForm: {
        message: '',
      },
      dialogFormVisible: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    userData() {
      return this.$store.getters.userData
    },
  },
  mounted() {
    this.fetchTicketDetails()
  },
  methods: {
    moment,
    checkPermission,
    resolveTicket() {
      const app = this
      app.loading = true
      const resolveTicketResource = new Resource('vdd/client-tickets/update')
      resolveTicketResource.update(app.selectedTicket.id, { value: 'Resolved', field: 'status' })
        .then(() => {
          app.fetchTicketDetails()
          app.$alert('The issue is flagged as Resolved. Any response to it will change the status to: In Progress')
          app.loading = false
          app.dialogFormVisible = false
        })
    },
    sendResponse() {
      const app = this
      const form = app.ticketForm
      form.vendor_id = app.selectedTicket.vendor_id
      form.client_id = app.selectedTicket.client_id
      form.ticket_id = app.selectedTicket.id
      form.response_by = `${app.userData.name} (${app.userData.email})`
      app.loadingResponse = true
      const fetchTicketResource = new Resource('vdd/client-tickets/save-response')
      fetchTicketResource.store(form)
        .then(() => {
          app.fetchTicketDetails()
          app.loadingResponse = false
          app.dialogFormVisible = false
        })
    },
    fetchTicketDetails() {
      const app = this
      app.loading = true
      const fetchTicketResource = new Resource('vdd/client-tickets/show')
      fetchTicketResource.get(app.selectedTicket.id)
        .then(response => {
          app.ticket = response.ticket
          app.loading = false
        })
    },
  },
}
</script>
<style scoped>
div.fixed {
  position: fixed;
  bottom: 45px;
  width: 850px;
  background: #f0f0f0;
  border: #cccccc solid 3px;
  padding: 20px;
  border-radius: 5px;
}
</style>
