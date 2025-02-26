<template>
  <el-card>
    <div v-if="uploadBulk">
      <b-button
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="gradient-danger"
        @click="uploadBulk = false"
      >
        <feather-icon
          icon="ArrowBackIcon"
          class="mr-50"
        />
        <span class="align-middle">Back</span>
      </b-button>
      <create-bulk-question
        @save="updateTable"
      />
    </div>
    <div
      v-else
      v-loading="loading"
    >
      <div slot="header">
        <b-row>
          <b-col
            cols="6"
          >
            <el-select
              v-model="form.vendor_id"
              placeholder="Select Vendor"
              style="width: 90%"
              @input="fetchVendorResponses()"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
            <span
              v-if="form.vendor_id !== null"
              style="cursor:pointer"
              @click="fetchVendorResponses()"
            >

              <el-tooltip content="Refresh">
                <feather-icon
                  icon="RefreshCwIcon"
                  class="ml-50"
                  size="30"
                />
              </el-tooltip>
            </span>
          </b-col>
          <b-col
            cols="6"
          >
            <span class="pull-right">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-secondary"
                @click="showQuestionSetupModal = true"
              >
                <feather-icon
                  icon="SettingsIcon"
                  class="mr-50"
                />
                <span class="align-middle">Setup Vendor Questions</span>
              </b-button>
            </span>
          </b-col>
          <!-- <b-col
            cols="12"
          >
            <el-select
              v-model="form.vendor_id"
              placeholder="Select Vendor"
              style="width: 50%"
              @input="fetchVendorResponses()"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
          </b-col> -->
        </b-row>
      </div>
      <hr>
      <el-tabs
        type="border-card"
        tab-position="left"
      >
        <el-tab-pane
          v-for="(questions, index) in answers"
          :key="index"
          lazy
        >
          <span slot="label"><feather-icon icon="CornerUpRightIcon" /> {{ index }}</span>
          <vendor-responses
            :questions="questions"
            :vendor-id="form.vendor_id"
            :is-admin="true"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="form.vendor_id !== null"
          lazy
        >
          <span slot="label"><feather-icon icon="PieChartIcon" /> Report</span>
          <report :vendor-id="form.vendor_id" />
        </el-tab-pane>
      </el-tabs>
      <create-question
        v-if="isCreateQuestionSidebarActive"
        v-model="isCreateQuestionSidebarActive"
        @save="updateTable"
      />
      <edit-question
        v-if="isEditQuestionSidebarActive"
        v-model="isEditQuestionSidebarActive"
        :selected-question="editable_row"
        @update="updateEditedTableRow"
      />
      <el-drawer
        title="Setup Vendor Questionaire"
        :visible.sync="showQuestionSetupModal"
        direction="ttb"
        size="100%"
        :destroy-on-close="true"
        :before-close="updateTable"
      >
        <!-- <template slot="title">
            <h2>Subscribe from the list of packages</h2>
          </template> -->

        <setup-vendor-questions :vendors="vendors" />
      </el-drawer>
    </div>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
  // import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import VendorResponses from './partials/VendorResponses.vue'
import Report from '../Report.vue'
import SetupVendorQuestions from './partials/SetupVendorQuestions.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    VendorResponses,
    BButton,
    SetupVendorQuestions,
    Report,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      showQuestionSetupModal: false,
      pageLength: 10,
      dir: false,
      answers: [],
      categorized_questions: [],
      savedCategories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      vendors: [],
      query: {
        page: 1,
        limit: 10,
        client_id: '',
      },
      form: {
        vendor_id: null,
        client_id: '',
      },
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  created() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    fetchVendors() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list({ all: true })
        .then(response => {
          app.vendors = response.vendors
          app.loading = false
        })
    },
    fetchVendorResponses() {
      const app = this
      app.showQuestionSetupModal = false
      // const { limit, page } = app.query
      const { form } = app
      form.client_id = app.selectedClient.id
      app.loading = true
      const fetchQuestionsResource = new Resource('vdd/responses/fetch')
      fetchQuestionsResource.list(form)
        .then(response => {
          app.answers = response.answers
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchVendorResponses()
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditQuestionSidebarActive = true
    },
    handleEdit(index, row) {
      const app = this
      // const editableRow = selected_row;
      app.editable_row = row
      app.isEditQuestionSidebarActive = true
      // console.log(index, row)
    },
    handleDelete(index, row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loading = true
        const destroyQuestionsResource = new Resource('vdd/questions/destroy')
        destroyQuestionsResource.destroy(row.id)
          .then(() => {
            app.fetchVendorResponses()
            app.loading = false
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchVendorResponses()
    },
  },
}
</script>
  <style lang="scss" >
  @import '@core/scss/vue/libs/vue-good-table.scss';
  </style>
