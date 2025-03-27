<template>
  <b-card no-body>
    <b-card-header
      v-if="message.from"
      class="email-detail-head"
    >
      <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
        <b-avatar
          size="25"
          :src="message.from.photo"
          class="mr-75"
        />
        <div class="mail-items">
          <strong class="mb-0">
            {{ message.from.first_name }} {{ message.from.last_name }}
          </strong>
          <b-dropdown
            v-if="message.from && message.to"
            variant="link"
            no-caret
            toggle-class="p-0"
            class="email-info-dropup"
          >
            <template #button-content>
              <span class="font-small-3 text-muted mr-25">{{ message.from.username }}</span>
              <feather-icon
                icon="ChevronDownIcon"
                size="10"
              />
            </template>
            <table
              class="table table-sm table-borderless font-small-3"
            >
              <tbody>
                <tr>
                  <td class="text-right text-muted align-top">
                    From:
                  </td>
                  <td>{{ message.from.username }}</td>
                </tr>
                <tr>
                  <td class="text-right text-muted align-top">
                    To:
                  </td>
                  <td>{{ message.copied_recipients.map(receiver => receiver.username + ' (' +receiver.first_name + ')').join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </b-dropdown>
        </div>
      </div>
      <div class="mail-meta-item d-flex align-items-center">
        <small class="mail-date-time text-muted">{{ formatDate(message.created_at) }}</small>
        <!-- Mail Action DD -->
        <!-- <b-dropdown
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

          <b-dropdown-item @click="handleReply = true">
            <feather-icon icon="CornerUpLeftIcon" />
            <span class="align-middle ml-50">Reply</span>
          </b-dropdown-item>

          <b-dropdown-item @click="handleForward = true">
            <feather-icon icon="CornerUpRightIcon" />
            <span class="align-middle ml-50">Forward</span>
          </b-dropdown-item>

          <b-dropdown-item>
            <feather-icon icon="TrashIcon" />
            <span class="align-middle ml-50">Delete</span>
          </b-dropdown-item>
        </b-dropdown> -->
      </div>
    </b-card-header>

    <b-card-body class="mail-message-wrapper pt-2">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="mail-message"
        v-html="message.message"
      />
    </b-card-body>
    <!-- <b-card-footer v-if="message.attachments && message.attachments.length">
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
          <b-link
            v-for="(attachment, index) in message.attachments"
            :key="index"
            :href="attachment.url"
            target="_blank"
            :class="{'mt-75': index}"
          >
            <b-img
              :src="attachment.thumbnail"
              width="16px"
              class="mr-50"
            />
            <span class="text-muted font-weight-bolder align-text-top">{{ attachment.fileName }}</span>
            <span class="text-muted font-small-2 ml-25">({{ attachment.size }})</span>
          </b-link>
        </div>
      </div>
    </b-card-footer> -->
  </b-card>
</template>

<script>
import {
  BDropdown, BCard, BCardHeader, BCardBody, BAvatar, /* BCardFooter, BLink, BImg, */
} from 'bootstrap-vue'
import { formatDate } from '@core/utils/filter'

export default {
  components: {
    BDropdown, BCard, BCardHeader, BCardBody, BAvatar, /* BCardFooter, BLink, BImg, */
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      formatDate,
    }
  },
}
</script>

<style>

</style>
