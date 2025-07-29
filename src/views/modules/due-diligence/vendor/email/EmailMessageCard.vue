<template>
  <el-card no-body>
    <el-card-header v-if="message.sender" class="email-detail-head">
      <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
        <el-avatar variant="info" size="25">
          <feather-icon icon="UserIcon" />
        </el-avatar>
        <div class="mail-items">
          <strong class="ml-1 mb-0">
            {{ message.sender_name }}
          </strong>
          <el-dropdown variant="link" no-caret toggle-class="p-0" class="email-info-dropup">
            <template #button-content>
              <span class="font-small-3 text-muted mr-25">{{ message.sender }}</span>
              <feather-icon icon="ChevronDownIcon" size="10" />
            </template>
            <table
              v-if="message.recipients !== null"
              class="table table-sm table-borderless font-small-3"
            >
              <tbody>
                <tr>
                  <td class="text-right text-muted align-top"> From: </td>
                  <td>{{ message.sender_name }}-({{ message.sender }})</td>
                </tr>
                <tr>
                  <td class="text-right text-muted align-top"> To: </td>
                  <td>{{ message.recipients.join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </el-dropdown>
        </div>
      </div>
      <div class="mail-meta-item d-flex align-items-center">
        <small class="mail-date-time text-muted">{{
          moment(message.created_a).format('lll')
        }}</small>
        <!-- Mail Action DD -->
        <!-- <el-dropdown
          variant="link"
          no-caret
          toggle-class="p-0"
          right
        >
          <template #button-content>
            <feather-icon
              icon="MoreVerticalIcon"
              size="17"
              class="ml-50 text-body"
            />
          </template>

          <el-dropdown-item @click="handleReply = true">
            <feather-icon icon="CornerUpLeftIcon" />
            <span class="align-middle ml-50">Reply</span>
          </el-dropdown-item>

          <el-dropdown-item @click="handleForward = true">
            <feather-icon icon="CornerUpRightIcon" />
            <span class="align-middle ml-50">Forward</span>
          </el-dropdown-item>

          <el-dropdown-item>
            <feather-icon icon="TrashIcon" />
            <span class="align-middle ml-50">Delete</span>
          </el-dropdown-item>
        </el-dropdown> -->
      </div>
    </el-card-header>

    <el-card-body class="mail-message-wrapper pt-2">
      <!-- eslint-disable vue/no-v-html -->
      <div class="mail-message" v-html="message.message"></div>
    </el-card-body>
    <!-- <el-card-footer v-if="message.attachments && message.attachments.length">
      <div class="mail-attachments">
        <div class="d-flex align-items-center mb-1">
          <feather-icon
            icon="PaperclipIcon"
            size="16"
          />
          <h5 class="font-weight-bolder text-body mb-0 ml-50">
            {{ message.attachments.length }} Attachment{{ message.attachments.length > 1 ? 's' : '' }}
          </h5>
        </div>

        <div class="d-flex flex-column">
          <el-link
            v-for="(attachment, index) in message.attachments"
            :key="index"
            :href="attachment.url"
            target="_blank"
            :class="{'mt-75': index}"
          >
            <el-img
              :src="attachment.thumbnail"
              width="16px"
              class="mr-50"
            />
            <span class="text-muted font-weight-bolder align-text-top">{{ attachment.fileName }}</span>
            <span class="text-muted font-small-2 ml-25">({{ attachment.size }})</span>
          </el-link>
        </div>
      </div>
    </el-card-footer> -->
  </el-card>
</template>

<script>
import moment from 'moment'

export default {
  components: {},
  props: {
    message: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: () => 'inbox'
    }
  },
  setup() {
    return {
      formatDate,
      formatDateToMonthShort
    }
  },
  methods: {
    moment
  }
}
</script>

<style></style>
