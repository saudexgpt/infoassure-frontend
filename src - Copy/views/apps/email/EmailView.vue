<template>
  <div
    v-if="selectedMessage !== null"
    class="email-app-details"
  >

    <!-- Email Header -->
    <div class="email-detail-header">

      <!-- Header: Left -->
      <div class="email-header-left d-flex align-items-center">
        <span class="go-back mr-1">
          <feather-icon
            :icon="$store.state.appConfig.isRTL ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
            size="20"
            class="align-bottom"
            @click="$emit('close-email-view')"
          />
        </span>
        <h4 class="email-subject mb-0">
          {{ selectedMessage.subject }}
        </h4>
      </div>
    </div>

    <!-- Email Details -->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="email-scroll-area scroll-area"
    >

      <br>
      <!-- Label Row -->
      <b-row>
        <b-col cols="12">
          <el-button-group>
            <el-button
              type="primary"
              @click="handleReply = true"
            >
              <feather-icon icon="CornerUpLeftIcon" />
              <span class="align-middle ml-50">Reply</span>
            </el-button>
            <el-button
              type="success"
              @click="handleForward = true"
            >
              <feather-icon icon="CornerUpRightIcon" />
              <span class="align-middle ml-50">Forward</span>
            </el-button>
            <el-button
              type="danger"
              @click="deleteMessage('delete_' + type)"
            >
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </el-button>
          </el-button-group>
        </b-col>
      </b-row>
      <!-- Email Thread -->
      <b-row>
        <b-col cols="12">
          <email-message-card
            :message="selectedMessage"
            :options="options"
            :recipients="recipients"
          />
        </b-col>
      </b-row>
      <!-- Action: Show Earlier Message -->
      <!-- <b-row class="mb-1">
        <b-col cols="12">
          <b-card>
            <div v-html="selectedMessage.message" />
          </b-card>
        </b-col>
      </b-row> -->

      <!-- Earlier Email Messages -->
      <template>
        <b-row
          v-for="threadMail in selectedMessage.replies.slice().reverse()"
          :key="threadMail.id"
        >
          <b-col cols="12">
            <email-message-card :message="threadMail" />
          </b-col>
        </b-row>
      </template>
    </vue-perfect-scrollbar>

    <!-- REPLY MESSAGE DIALOG -->
    <el-dialog
      title="Reply Message"
      :visible.sync="handleReply"
      :modal-append-to-body="false"
    >
      <el-input
        v-model="replied_message"
        type="textarea"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleReply = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="updateMessage('reply')"
        >Reply</el-button>
      </span>
    </el-dialog>
    <!-- REPLY MESSAGE DIALOG -->
    <!-- FORWARD MESSAGE DIALOG -->
    <el-dialog
      title="Forward Message"
      :visible.sync="handleForward"
      :modal-append-to-body="false"
    >
      <el-select
        v-model="selected_option"
        style="width: 100%"
        placeholder="Select Recipients' Category"
        @input="setRecipients()"
      >
        <el-option
          v-for="(option, index) in options"
          :key="index"
          :label="option.toUpperCase()"
          :value="option"
        />
      </el-select>
      <el-select
        v-model="forward_recipients"
        style="width: 100%"
        placeholder="Select Recipients"
        filterable
        multiple
        collapse-tags
      >
        <el-option
          v-for="(recipient, index) in selected_recipients"
          :key="index"
          :label="(recipient.user) ? recipient.user.first_name + ' ' + recipient.user.last_name + ' (' + recipient.user.username +')' : ''"
          :value="recipient.user_id"
        />
      </el-select>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleForward = false">Cancel</el-button>
        <el-button
          type="success"
          @click="updateMessage('forward')"
        >Forward</el-button>
      </span>
    </el-dialog>
    <!-- FORWARD MESSAGE DIALOG -->
  </div>
</template>

<script>
import {
  /* BDropdown, BDropdownItem, BBadge, */ BRow, BCol, /* BCard, BLink, */
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { ref, watch } from '@vue/composition-api'
import useEmail from './useEmail'
import EmailMessageCard from './EmailMessageCard.vue'
import Resource from '@/api/resource'

export default {
  components: {

    // BSV
    // BDropdown,
    // BDropdownItem,
    BRow,
    BCol,
    // BBadge,
    // BCard,
    // BLink,

    // 3rd Party
    VuePerfectScrollbar,

    // SFC
    EmailMessageCard,
  },
  props: {
    emailViewData: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    recipients: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: () => 'inbox',
    },
    // opendedEmailMeta: {
    //   type: Object,
    //   required: true,
    // },
  },
  setup(props) {
    const { resolveLabelColor } = useEmail()

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }

    const showWholeThread = ref(false)

    watch(() => props.emailViewData.id, () => {
      showWholeThread.value = false
    })

    return {

      // UI
      perfectScrollbarSettings,
      showWholeThread,

      // useEmail
      resolveLabelColor,
    }
  },
  data() {
    return {
      handleReply: false,
      handleForward: false,
      replied_message: '',
      forward_recipients: [],
      selected_option: '',
      selected_recipients: [],
      selectedMessage: null,
    }
  },
  created() {
    this.selectedMessage = this.emailViewData
  },
  methods: {
    updateMessage(action) {
      const app = this
      const param = {
        message: app.replied_message,
        action,
        recipients: app.forward_recipients,
      }
      const updateMessageResource = new Resource('messages/update')
      updateMessageResource.update(app.selectedMessage.id, param)
        .then(response => {
          app.selectedMessage = response.message_details
          app.handleReply = false
          app.handleForward = false
        })
        .catch(() => {

        })
    },
    deleteMessage(action) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete conversation?')) {
        const param = {
          message: app.replied_message,
          action,
          recipients: app.forward_recipients,
        }
        const updateMessageResource = new Resource('messages/update')
        updateMessageResource.update(app.selectedMessage.id, param)
          .then(response => {
            app.selectedMessage = response.message_details
            app.$emit('close-email-view')
            app.handleReply = false
            app.handleForward = false
          })
          .catch(() => {

          })
      }
    },
    setRecipients() {
      const app = this
      app.selected_recipients = app.recipients[app.selected_option]
    },
  },
}
</script>

<style>

</style>
