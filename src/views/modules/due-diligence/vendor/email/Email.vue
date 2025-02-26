<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
      width="250px"
      style="background-color: rgb(238, 241, 246)"
    >
      <b-button
        variant="primary"
        block
        @click="shallShowEmailComposeModal = true"
      >
        Compose
      </b-button>
      <el-menu>
        <el-menu-item @click="fetchMessages('inbox')">
          <i class="el-icon-message" />
          <span slot="title">Inbox</span>
        </el-menu-item>
        <el-menu-item @click="fetchMessages('sent')">
          <i class="el-icon-s-promotion" />
          <span slot="title">Sent</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>

      <el-main v-loading="load">
        <div
          v-if="!showEmailDetails"
          class="email-user-list scroll-area"
        >
          <ul class="email-media-list">
            <b-media
              v-for="(email, index) in emails"
              :key="index"
              tag="li"
              no-body
              :class="{ 'mail-read': email.isRead,} "
              style="cursor: pointer; background: #ffffff; padding: 10px; margin-bottom: 5px; border-radius: 5px"
              @click="updateEmailViewData(email)"
            >

              <template>
                <b-media-aside class="media-left mr-50">
                  <b-avatar variant="info">
                    <feather-icon icon="MailIcon" />
                  </b-avatar>
                </b-media-aside>

                <b-media-body>
                  <div class="mail-details">
                    <div class="mail-items">
                      <div class="mail-meta-item pull-right">
                        <span class="mail-date">{{ formatDateToMonthShort(email.created_at, { hour: 'numeric', minute: 'numeric', }) }}</span>
                      </div>
                      <h5
                        v-if="type === 'inbox'"
                        class="mb-25"
                      >
                        <strong>{{ (email.has_reply === 1) ? `RE: ${email.subject}` : `${email.subject}` }}</strong>
                      </h5>
                      <h5
                        v-else
                        class="mb-25"
                      >
                        <strong>{{ email.subject }}</strong>
                      </h5>
                      <span class="text-truncate"><em><small>from {{ email.sender_name }}</small></em></span>
                    </div>
                  </div>

                  <div class="mail-message">
                    <p class="text-truncate mb-0">
                      {{ filterTags(email.message) }}
                    </p>
                  </div>
                </b-media-body>
                <hr>
              </template>
            </b-media>
          </ul>
          <div
            v-if="emails.length < 1"
            class="no-results"
            :class="{'show': !emails.length}"
          >
            <div style="margin-top: 150px; text-align: center; ">
              <feather-icon
                icon="MailIcon"
                size="70"
              />
              <h1>No Message Found</h1>
            </div>
          </div>
        </div>
        <el-row
          v-if="!showEmailDetails && total > 10"
          :gutter="20"
        >
          <pagination
            v-show="total > 0"
            :total="total"
            layout="total, prev, pager, next"
            :page.sync="query.page"
            :limit.sync="query.limit"
            @pagination="fetchMessages"
          />
        </el-row>
        <email-view
          v-if="emailViewData !== null && showEmailDetails"
          :class="{'show': showEmailDetails}"
          :email-view-data="emailViewData"
          :options="options"
          :recipients="recipients"
          :type="type"
          @close-email-view="showEmailDetails = false; fetchMessages()"
        />
      </el-main>
    </el-container>
    <!-- Compose Email Modal -->
    <email-compose
      v-model="shallShowEmailComposeModal"
      :options="options"
      :recipients="recipients"
    />
  </el-container>
</template>

<script>
// import {
//   ref, onUnmounted, computed, watch,
//   // ref, watch, computed, onUnmounted,
// } from '@vue/composition-api'
import {
  /* BFormInput, BInputGroup, BInputGroupPrepend, BDropdown, BDropdownItem,
  BFormCheckbox, */ BMedia, BMediaAside, BMediaBody, BAvatar, BButton,
} from 'bootstrap-vue'
import { filterTags, formatDateToMonthShort } from '@core/utils/filter'
import Pagination from '@/views/components/Pagination-main/index.vue'
// import { useRouter } from '@core/utils/utils'
// import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app'
// import store from '@/store'
// import EmailLeftSidebar from './EmailLeftSidebar.vue'
import EmailView from './EmailView.vue'
// import emailStoreModule from './emailStoreModule'
// import useEmail from './useEmail'
import EmailCompose from './EmailCompose.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // BFormInput,
    // BInputGroup,
    // BInputGroupPrepend,
    // BDropdown,
    // BDropdownItem,
    // BFormCheckbox,
    BButton,
    BMedia,
    BMediaAside,
    BMediaBody,
    BAvatar,
    Pagination,

    // App SFC
    // EmailLeftSidebar,
    EmailView,
    EmailCompose,
  },
  data() {
    return {
      emails: [],
      options: [],
      recipients: {},
      showEmailDetails: false,
      mqShallShowLeftSidebar: true,
      shallShowEmailComposeModal: false,
      emailsMeta: {},
      emailViewData: null,
      perfectScrollbarSettings: {
        maxScrollbarLength: 800,
      },
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
      load: false,
      type: 'inbox',
    }
  },
  mounted() {
    this.fetchMessages()
  },
  methods: {
    filterTags,
    formatDateToMonthShort,
    fetchMessages(folder) {
      const app = this
      const { limit, page } = this.query
      let query = ''
      app.type = folder
      query = `/${app.type}`
      app.load = true
      app.emails = []
      const fetchEmailResource = new Resource(`vdd/messages${query}`)
      fetchEmailResource.vList()
        .then(response => {
          app.emails = response.emails.data
          app.emails.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.emails.total
          app.type = response.type
          app.load = false
        })
        .catch(() => {
          app.load = false
        })
    },
    updateEmailViewData(email) {
      const app = this
      const emailDetailsResource = new Resource('vdd/messages/details')
      app.load = true
      app.showEmailDetails = false
      app.emailViewData = null
      emailDetailsResource.vGet(email.id)
        .then(response => {
          app.emailViewData = response.message_details
          app.showEmailDetails = true
          // eslint-disable-next-line no-param-reassign
          email.isRead = true
          app.load = false
        })
        .catch(() => {
          app.load = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
@import "~@core/scss/base/pages/app-email.scss";
</style>
