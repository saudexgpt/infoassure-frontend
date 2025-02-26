<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
  <div
    v-loading="load"
    style="height: 530px"
  >
    <div
      class="body-content-overlay"
      :class="{'show': mqShallShowLeftSidebar}"
      @click="mqShallShowLeftSidebar = false"
    />

    <!-- Email List -->
    <div class="email-app-list">

      <!-- App Searchbar Header -->
      <div class="app-fixed-search d-flex align-items-center">

        <!-- Toggler -->
        <div class="sidebar-toggle d-block d-lg-none ml-1">
          <feather-icon
            icon="MenuIcon"
            size="21"
            class="cursor-pointer"
            @click="mqShallShowLeftSidebar = true"
          />
        </div>
      </div>
      <!-- Emails List -->
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="email-user-list scroll-area"
      >
        <ul class="email-media-list">
          <b-media
            v-for="(email, index) in emails"
            :key="index"
            tag="li"
            no-body
            :class="{ 'mail-read': email.isRead }"
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
                  <div class="mail-meta-item">
                    <!-- <feather-icon
                    v-if="email.attachments.length"
                    icon="PaperclipIcon"
                  />
                  <span
                    v-for="label in email.labels"
                    :key="label"
                    class="mx-50 bullet bullet-sm"
                    :class="`bullet-${resolveLabelColor(label)}`"
                  /> -->
                    <span class="mail-date">{{ formatDateToMonthShort(email.created_at, { hour: 'numeric', minute: 'numeric', }) }}</span>
                  </div>
                </div>

                <div class="mail-message">
                  <p class="text-truncate mb-0">
                    {{ filterTags(email.message) }}
                  </p>
                </div>
              </b-media-body>
            </template>
          </b-media>
        </ul>
        <div
          class="no-results"
          :class="{'show': !emails.length}"
        >
          <div style="margin-top: 150px;">
            <feather-icon
              icon="MailIcon"
              size="70"
            />
            <h1>No Message Found</h1>
          </div>
        </div>
      </vue-perfect-scrollbar>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          layout="total, prev, pager, next"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchMessages"
        />
      </el-row>
    </div>

    <!-- Email View/Detail -->
    <email-view
      v-if="emailViewData !== null"
      :class="{'show': showEmailDetails}"
      :email-view-data="emailViewData"
      :options="options"
      :recipients="recipients"
      :type="type"
      @close-email-view="showEmailDetails = false; fetchMessages()"
    />

    <!-- Sidebar -->
    <portal to="content-renderer-sidebar-left">
      <email-left-sidebar
        :shall-show-email-compose-modal.sync="shallShowEmailComposeModal"
        :emails-meta="emailsMeta"
        :class="{'show': mqShallShowLeftSidebar}"
        @close-left-sidebar="mqShallShowLeftSidebar = false;"
        @reload-page="fetchMessages()"
      />
    </portal>

    <!-- Compose Email Modal -->
    <email-compose
      v-model="shallShowEmailComposeModal"
      :options="options"
      :recipients="recipients"
    />
  </div>
</template>

<script>
// import {
//   ref, onUnmounted, computed, watch,
//   // ref, watch, computed, onUnmounted,
// } from '@vue/composition-api'
import {
  /* BFormInput, BInputGroup, BInputGroupPrepend, BDropdown, BDropdownItem,
  BFormCheckbox, */ BMedia, BMediaAside, BMediaBody, BAvatar,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { filterTags, formatDateToMonthShort } from '@core/utils/filter'
import Pagination from '@/views/components/Pagination-main/index.vue'
// import { useRouter } from '@core/utils/utils'
// import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app'
// import store from '@/store'
import EmailLeftSidebar from './EmailLeftSidebar.vue'
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
    BMedia,
    BMediaAside,
    BMediaBody,
    BAvatar,
    Pagination,

    // 3rd Party
    VuePerfectScrollbar,

    // App SFC
    EmailLeftSidebar,
    EmailView,
    EmailCompose,
  },
  data() {
    return {
      emails: [],
      options: [],
      recipients: {},
      showEmailDetails: false,
      mqShallShowLeftSidebar: false,
      shallShowEmailComposeModal: false,
      emailsMeta: {},
      emailViewData: null,
      perfectScrollbarSettings: {
        maxScrollbarLength: 400,
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
    fetchMessages() {
      const app = this
      const { limit, page } = this.query
      let query = ''
      const folder = this.$route.params && this.$route.params.folder
      if (folder !== undefined) {
        query = `/${folder}`
      }
      app.load = true
      const fetchEmailResource = new Resource(`messages${query}`)
      fetchEmailResource.list()
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
      const emailDetailsResource = new Resource('messages/details')
      app.load = true
      app.showEmailDetails = false
      app.emailViewData = null
      emailDetailsResource.get(email.id)
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
