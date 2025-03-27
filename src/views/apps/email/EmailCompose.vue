<template>
  <b-modal
    id="compose-mail"
    :visible="shallShowEmailComposeModal"
    title="Compose Email"
    modal-class="modal-sticky"
    footer-class="d-flex justify-content-between"
    body-class="p-0"
    size="lg"
    no-fade
    hide-backdrop
    static
    @change="(val) => $emit('update:shall-show-email-compose-modal', val)"
  >
    <!-- Modal Header -->
    <template #modal-header>
      <h5 class="modal-title">
        Compose Message
      </h5>
      <div class="modal-actions">
        <!-- <feather-icon
          icon="MinusIcon"
          class="cursor-pointer"
          @click="$emit('update:shall-show-email-compose-modal', false)"
        /> -->
        <!-- <feather-icon
          icon="Maximize2Icon"
          class="ml-1 cursor-pointer"
        /> -->
        <feather-icon
          icon="XIcon"
          class="ml-1 cursor-pointer"
          @click="discardEmail"
        />
      </div>
    </template>

    <!-- Modal Footer -->
    <template #modal-footer>
      <!-- Footer: Left Content -->
      <div>
        <el-button
          type="primary"
          split
          right
          @click="sendMessage()"
        >Send
        </el-button>
        <!-- <feather-icon
          icon="PaperclipIcon"
          size="17"
          class="ml-2 cursor-pointer"
        /> -->
      </div>

      <!-- Footer: Right Content -->
      <div>
        <!-- <el-button
          type="primary"
          split
          right
          @click="sendMessage()"
        >Send
        </el-button> -->
      </div>
    </template>

    <!-- Modal: Body -->
    <b-form>

      <!-- Field: To -->
      <div class="compose-mail-form-field">
        <label
          for="email-to"
          class="form-label"
        >To: </label>
        <!-- <el-select
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
        &nbsp;
        <el-switch
          v-if="selected_option !== ''"
          v-model="select_all"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="all"
          inactive-value="none"
          active-text="All"
          inactive-text="None"
          @change="selectAll()"
        />
        <br>&nbsp; -->
        <el-select
          v-model="form.new_recipients"
          style="width: 100%"
          placeholder="Search Recipients"
          remote
          :remote-method="remoteMethod"
          :loading="loading"
          filterable
          multiple
        >
          <el-option
            v-for="(user, index) in selected_recipients"
            :key="index"
            :label="`${user.name} - (${user.email})`"
            :value="user.email"
          />
        </el-select>
      </div>

      <!-- Field: Subject -->
      <div class="compose-mail-form-field">
        <label for="email-subject">Subject: </label>
        <b-form-input
          id="email-subject"
          v-model="form.subject"
        />
      </div>

      <!-- Field: Message - Quill Editor -->
      <div class="message-editor">
        <quill-editor
          id="quil-content"
          v-model="form.message"
          :options="editorOption"
        />
      </div>
    </b-form>

  </b-modal>
</template>

<script>
import {
  /* BDropdown, BDropdownItem, BDropdownDivider */BForm, BFormInput,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ref } from '@vue/composition-api'
import { quillEditor } from 'vue-quill-editor'
// import vSelect from 'vue-select'
import Resource from '@/api/resource'

export default {
  directives: {
    Ripple,
  },
  components: {

    // BSV
    // BDropdown,
    // BDropdownItem,
    BForm,
    BFormInput,
    // BDropdownDivider,

    // 3rd Party
    quillEditor,
  },
  model: {
    prop: 'shallShowEmailComposeModal',
    event: 'update:shall-show-email-compose-modal',
  },
  props: {
    shallShowEmailComposeModal: {
      type: Boolean,
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
  },
  setup(_, { emit }) {
    const composeData = ref({})
    const showCcField = ref(false)
    const showBccField = ref(false)
    const toolbarOptions = [
      [{ font: [] }],
      ['bold', 'italic', 'underline'], // toggled buttons
      // ['blockquote', 'code-block'],
      ['link'/* , 'image', 'video', 'formula' */],

      // [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      // [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      [{ align: [] }],

      // ['clean'], // remove formatting button
    ]
    const editorOption = {
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: 'Type your message here...',
    }

    /* eslint-disable global-require */
    const emailToOptions = [
      { avatar: require('@/assets/images/avatars/1-small.png'), name: 'Jane Foster' },
      { avatar: require('@/assets/images/avatars/3-small.png'), name: 'Donna Frank' },
      { avatar: require('@/assets/images/avatars/5-small.png'), name: 'Gabrielle Robertson' },
      { avatar: require('@/assets/images/avatars/7-small.png'), name: 'Lori Spears' },
      { avatar: require('@/assets/images/avatars/9-small.png'), name: 'Sandy Vega' },
      { avatar: require('@/assets/images/avatars/11-small.png'), name: 'Cheryl May' },
    ]
    /* eslint-enable global-require */

    const sendEmail = () => {
      composeData.value = {}
      emit('update:shall-show-email-compose-modal', false)

      // ? Send your Email
    }

    const discardEmail = () => {
      composeData.value = {}
      emit('update:shall-show-email-compose-modal', false)
    }

    return {
      composeData,
      editorOption,
      emailToOptions,
      showCcField,
      showBccField,

      // Email actions
      sendEmail,
      discardEmail,
    }
  },
  data() {
    return {
      loading: false,
      handleReply: false,
      handleForward: false,
      replied_message: '',
      selected_option: '',
      selected_recipients: [],
      selectedMessage: null,
      select_all: 'all',
      form: {
        subject: '',
        message: '',
        new_recipients: [],
      },
    }
  },
  methods: {
    remoteMethod(query) {
      const app = this
      if (query !== '') {
        this.loading = true
        const fetchEmailsResource = new Resource('search-email-list')
        fetchEmailsResource.list({ email_string: query })
          .then(response => {
            this.loading = false
            app.selected_recipients = response.emails
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.selected_recipients = []
      }
    },
    sendMessage() {
      const app = this
      const param = app.form
      const updateMessageResource = new Resource('messages/send-message')
      updateMessageResource.store(param)
        .then(() => {
          app.$emit('update:shall-show-email-compose-modal', false)
        })
        .catch(() => {

        })
    },
    setRecipients() {
      const app = this
      app.selected_recipients = app.recipients[app.selected_option]
      app.selectAll()
    },
    selectAll() {
      const app = this
      const value = app.select_all
      if (value === 'all') {
        const newRecipients = []
        app.selected_recipients.forEach(recipient => {
          console.log(recipient.user_id)
          newRecipients.push(recipient.user_id)
        })
        app.form.new_recipients = newRecipients
      } else {
        app.form.new_recipients = []
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/quill.scss';
</style>

<style lang="scss" scoped>
form ::v-deep {

  // Mail To vue-select style
  .v-select {
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: none;
    }
    .vs__open-indicator {
      display: none;
    }
  }

  // Quill Editor Style
  .quill-editor {
    .ql-container.ql-snow {
      border-bottom: 0 !important;
    }
  }
}
</style>
