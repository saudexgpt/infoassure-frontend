<template>
  <el-card>
    <div
      v-loading="loading"
    >
      <div slot="header">
        <b-row>
          <b-col
            cols="6"
          >
            <h3>Vendor Assessment</h3>
          </b-col>
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
            :vendor-id="vendorId"
            @submitted="fetchVendorResponses"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import VendorResponses from '@/views/modules/DUE-DILIGENCE/RiskAssessment/partials/VendorResponses.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    VendorResponses,
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
  props: {
    vendorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      pageLength: 10,
      dir: false,
      answers: [],
      categorized_questions: [],
      savedCategories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      vendors: [],
      form: {
        vendor_id: '',
      },
    }
  },
  created() {
    this.fetchVendorResponses()
  },
  methods: {
    checkPermission,
    fetchVendorResponses() {
      const app = this
      app.showQuestionSetupModal = false
      // const { limit, page } = app.query
      const { form } = app
      form.vendor_id = app.vendorId
      app.loading = true
      const fetchQuestionsResource = new Resource('vdd/answers/fetch')
      fetchQuestionsResource.vList(form)
        .then(response => {
          app.answers = response.answers
          app.loading = false
        })
    },
  },
}
</script>
    <style lang="scss" >
    @import '@core/scss/vue/libs/vue-good-table.scss';
    </style>
