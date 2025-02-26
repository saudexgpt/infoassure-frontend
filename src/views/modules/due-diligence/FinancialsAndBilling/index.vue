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
      </div>
      <hr>
      <invoices
        :vendor-id="form.vendor_id"
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
  },
}
</script>
    <style lang="scss" >
    @import '@core/scss/vue/libs/vue-good-table.scss';
    </style>
