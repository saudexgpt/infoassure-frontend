<template>
  <el-card>
    <div
      v-loading="loading"
    >
      <div
        slot="header"
      >
        <b-row>
          <b-col
            cols="6"
          >
            <label>Select Vendor</label>
            <el-select
              v-model="form.vendor_id"
              placeholder="Select Vendor"
              style="width: 100%"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
          </b-col>
        </b-row>
        <hr>
      </div>
      <el-tabs
        v-if="form.vendor_id"
      >
        <el-tab-pane
          lazy
        >
          <span slot="label">Issues & Tickets</span>
          <Tickets
            :vendor-id="form.vendor_id"
          />
        </el-tab-pane>
        <el-tab-pane
          lazy
        >
          <span slot="label">Review Meetings</span>
          <ReviewMeetings
            :vendor-id="form.vendor_id"
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
import checkPermission from '@/utils/permission'
import Tickets from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/partials/Tickets.vue'
import ReviewMeetings from '@/views/modules/DUE-DILIGENCE/VendorRelationshipManagement/partials/ReviewMeetings.vue'

export default {
  components: {
    BRow,
    BCol,
    Tickets,
    ReviewMeetings,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      pageLength: 10,
      dir: false,
      vendors: [],
      form: {
        vendor_id: null,
        client_id: '',
      },
      showInvoiceDetails: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  mounted() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    fetchVendors() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-approved-vendors')
      fetchStaffResource.list({ all: true })
        .then(response => {
          app.vendors = response.vendors
          app.loading = false
        })
    },
  },
}
</script>
