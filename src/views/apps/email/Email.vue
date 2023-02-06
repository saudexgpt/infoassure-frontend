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

        <!-- Searchbar -->
        <!-- <div class="d-flex align-content-center justify-content-between w-100">
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon
                icon="SearchIcon"
                class="text-muted"
              />
            </b-input-group-prepend>
            <b-form-input
              :value="searchQuery"
              placeholder="Search email"
              @input="updateRouteQuery"
            />
          </b-input-group>
        </div> -->
      </div>

      <!-- App Action Bar -->
      <!-- <div class="app-action">
        <div class="action-left">
          <b-form-checkbox
            :checked="selectAllEmailCheckbox"
            :indeterminate="isSelectAllEmailCheckboxIndeterminate"
            @change="selectAllCheckboxUpdate"
          >
            Select All
          </b-form-checkbox>
        </div>
        <div
          v-show="selectedEmails.length"
          class="align-items-center"
          :class="{'d-flex': selectedEmails.length}"
        >

          <b-dropdown
            variant="link"
            no-caret
            toggle-class="p-0"
            right
          >
            <template #button-content>
              <feather-icon
                icon="FolderIcon"
                size="17"
                class="align-middle text-body"
              />
            </template>

            <b-dropdown-item @click="moveSelectedEmailsToFolder('draft')">
              <feather-icon icon="Edit2Icon" />
              <span class="align-middle ml-50">Draft</span>
            </b-dropdown-item>

            <b-dropdown-item @click="moveSelectedEmailsToFolder('spam')">
              <feather-icon icon="InfoIcon" />
              <span class="align-middle ml-50">Spam</span>
            </b-dropdown-item>

            <b-dropdown-item
              v-show="$route.params.folder !== 'trash'"
              @click="moveSelectedEmailsToFolder('trash')"
            >
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Trash</span>
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            variant="link"
            no-caret
            toggle-class="p-0"
            class="ml-1"
            right
          >
            <template #button-content>
              <feather-icon
                icon="TagIcon"
                size="17"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item @click="updateSelectedEmailsLabel('personal')">
              <span class="mr-50 bullet bullet-success bullet-sm" />
              <span>Personal</span>
            </b-dropdown-item>
            <b-dropdown-item @click="updateSelectedEmailsLabel('company')">
              <span class="mr-50 bullet bullet-primary bullet-sm" />
              <span>Company</span>
            </b-dropdown-item>
            <b-dropdown-item @click="updateSelectedEmailsLabel('important')">
              <span class="mr-50 bullet bullet-warning bullet-sm" />
              <span>Important</span>
            </b-dropdown-item>
            <b-dropdown-item @click="updateSelectedEmailsLabel('private')">
              <span class="mr-50 bullet bullet-danger bullet-sm" />
              <span>Private</span>
            </b-dropdown-item>
          </b-dropdown>

          <feather-icon
            icon="MailIcon"
            size="17"
            class="cursor-pointer ml-1"
            @click="markSelectedEmailsAsUnread"
          />

          <feather-icon
            v-show="$route.params.folder !== 'trash'"
            icon="TrashIcon"
            size="17"
            class="cursor-pointer ml-1"
            @click="moveSelectedEmailsToFolder('trash')"
          />

        </div>
      </div> -->

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

            <template v-if="email.from !== null">
              <b-media-aside class="media-left mr-50">
                <b-avatar
                  class="avatar"
                  size="40"
                  variant="primary"
                  :src="email.from.photo"
                />
              <!-- <div class="user-action">
                <b-form-checkbox
                  :checked="selectedEmails.includes(email.id)"
                  @change="toggleSelectedMail(email.id)"
                  @click.native.stop
                />
                <div class="email-favorite">
                  <feather-icon
                    icon="StarIcon"
                    size="17"
                    :class="{ 'text-warning fill-current': email.isStarred }"
                    @click.stop="toggleStarred(email)"
                  />
                </div>
              </div> -->
              </b-media-aside>

              <b-media-body>
                <div class="mail-details">
                  <div class="mail-items">
                    <h5 class="mb-25">
                      {{ email.from.first_name + ' ' + email.from.last_name }}
                    </h5>
                    <span class="text-truncate">{{ email.subject }}</span>
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
          <h5>No Items Found</h5>
        </div>
      </vue-perfect-scrollbar>
    </div>

    <!-- Email View/Detail -->
    <email-view
      v-if="emailViewData !== null"
      :class="{'show': showEmailDetails}"
      :email-view-data="emailViewData"
      :options="options"
      :recipients="recipients"
      :type="type"
      @close-email-view="showEmailDetails = false; fetchInbox()"
    />

    <!-- Sidebar -->
    <portal to="content-renderer-sidebar-left">
      <email-left-sidebar
        :shall-show-email-compose-modal.sync="shallShowEmailComposeModal"
        :emails-meta="emailsMeta"
        :class="{'show': mqShallShowLeftSidebar}"
        @close-left-sidebar="mqShallShowLeftSidebar = false;"
        @reload-page="fetchInbox()"
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
      load: false,
      type: 'inbox',
    }
  },
  mounted() {
    this.fetchInbox()
  },
  methods: {
    filterTags,
    formatDateToMonthShort,
    fetchInbox() {
      const app = this
      let query = ''
      const folder = this.$route.params && this.$route.params.folder
      if (folder !== undefined) {
        query = `/${folder}`
      }
      app.load = true
      const fetchEmailResource = new Resource(`messages${query}`)
      fetchEmailResource.list()
        .then(response => {
          app.emails = response.messages
          app.options = response.options
          app.recipients = response.recipients
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
