<template>
  <el-card>
    <div
      v-loading="loading"
    >
      <div
        v-if="!showInvoiceDetails"
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
      <invoices
        v-if="form.vendor_id !== null"
        :vendor-id="form.vendor_id"
        @details="showDetails"
      />
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
import Invoices from './Invoices.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    Invoices,
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
    showDetails(value) {
      const app = this
      app.showInvoiceDetails = value
    },
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
    <style lang="scss" >
    @import '@core/scss/vue/libs/vue-good-table.scss';
    </style>
