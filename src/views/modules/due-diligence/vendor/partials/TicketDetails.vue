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
    otherUserData() {
      return this.$store.getters.otherUserData
    },
  },
  mounted() {
    this.fetchTicketDetails()
  },
  methods: {
    moment,
    checkPermission,
    sendResponse() {
      const app = this
      const form = app.ticketForm
      form.vendor_id = app.selectedTicket.vendor_id
      form.client_id = app.selectedTicket.client_id
      form.ticket_id = app.selectedTicket.id
      form.response_by = `${app.otherUserData.name} (${app.otherUserData.email})`
      app.loadingResponse = true
      const fetchTicketResource = new Resource('vdd/vendor-tickets/save-response')
      fetchTicketResource.vStore(form)
        .then(() => {
          app.fetchTicketDetails()
          app.loadingResponse = false
          app.dialogFormVisible = false
        })
    },
    fetchTicketDetails() {
      const app = this
      app.loading = true
      const fetchTicketResource = new Resource('vdd/vendor-tickets/show')
      fetchTicketResource.vGet(app.selectedTicket.id)
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
  bottom: 0;
  width: 850px;
  background: #f0f0f0;
  border: #cccccc solid 3px;
  padding: 20px;
  border-radius: 5px;
}
</style>
