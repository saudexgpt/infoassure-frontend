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
            <h3>Vendor Relationship Management</h3>
          </b-col>
        </b-row>
      </div>
      <hr>
      <el-tabs>
        <el-tab-pane
          lazy
        >
          <span slot="label">Issues & Tickets</span>
          <Tickets
            :vendor-id="vendorId"
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
import Tickets from './Tickets.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    Tickets,
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
