<template>
  <div>
    <div
      v-if="!showEditForm"
      slot="header"
    >
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            Registered Vendors
          </h3>
        </b-col>
      </b-row>
      <hr>
      <!-- <span class="pull-right">
          <el-button
            v-if="vendors.length > 0"
            :loading="downloadLoading"
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="document"
            @click="handleDownload('List of Vendors', vendors)"
          >Export Excel</el-button>
        </span> -->
      <v-client-table
        v-model="vendors"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <!-- <div
          slot="child_row"
          slot-scope="props"
        >
          <strong>Details for {{ props.row.name }}</strong>
          <onboarding-form
            :vendor-id="props.row.id"
            :is-admin="true"
          />
        </div> -->
        <!-- <div
          slot="is_active"
          slot-scope="{row}"
        >
          {{ (row.is_active === 1) ? 'Active' : 'Suspended' }}
        </div> -->
        <div
          slot="action"
          slot-scope="props"
        >
          <b-button
            variant="secondary"
            @click="editVendor(props.row)"
          >
            <span><feather-icon icon="EditIcon" /></span>
          </b-button>
        </div>
      </v-client-table>
      <hr>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchVendors"
        />
      </el-row>
    </div>
    <div v-else>
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            Edit Vendor
          </h3>
        </b-col>
        <b-col cols="3">

          <span class="pull-right">
            <el-button
              style="margin:0 0 20px 20px;"
              type="danger"
              icon="el-icon-back"
              @click="fetchVendors(); showEditForm = false"
            >Back</el-button>
          </span>
        </b-col>
      </b-row>
      <hr>
      <!-- <edit-vendor
        v-if="!editVendorUser"
        :selected-vendor="selectedVendor"
        @update="fetchVendors()"
      />
      <edit-vendor-user
        v-if="editVendorUser"
        :selected-vendor-user="selectedVendorUser"
        @update="fetchVendors()"
      /> -->
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/components/Pagination-main/index.vue'
// import OnboardingForm from '@/views/modules/DUE-DILIGENCE/vendor/partials/Onboarding.vue'
// import EditVendorUser from './EditVendorUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BRow,
    BCol,
    Pagination,
    // OnboardingForm,
    // EditVendor,
    // EditVendorUser,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      downloadLoading: false,
      editVendorUser: false,
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'contact_email',
        'contact_phone',
        'contact_address',
        'rating',
        'action',
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          is_active: 'Status',
          action: '',

          // id: 'S/N',
        },
        filterByColumn: false,
        rowAttributesCallback(row) {
          if (row.is_active === 0) {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          return {}
        },
        sortable: [
          'name',
          'contact_email',
          'contact_phone',
        ],
        // filterable: false,
        filterable: [
          'name',
          'contact_email',
          'contact_phone',
        ],
      },
      showEditForm: false,
      vendors: [],
      loading: false,
      selectedVendor: null,
      selectedVendorUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
    }
  },
  created() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchVendors() {
      const app = this
      const { limit, page } = this.query
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.vendors = response.vendors.data
          app.vendors.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.vendors.total
          app.loading = false
        })
    },
    makeAdmin(vendorId, user) {
      const app = this
      app.$confirm(`Please confirm that ${user.name} is the company's new admin?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const vendorResource = new Resource('vendors/assign-user-as-vendor-admin')
        vendorResource.update(vendorId, { user_id: user.id })
          .then(() => {
            app.$message({
              type: 'success',
              message: 'Action Successfully',
            })
            app.loading = false
            app.fetchVendors()
          }).catch(() => {
            app.loading = false
            this.$message({
              type: 'danger',
              message: 'An error occured. Please try again',
            })
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    toggleVendorSuspension(vendor, value, action) {
      this.$confirm(`Are you sure you want to ${action} ${vendor.name}
        ?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const vendorResource = new Resource('vendors/toggle-vendor-suspension')
        vendorResource.update(vendor.id, { value })
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully',
            })
            this.loading = false
            this.fetchVendors()
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    confirmRegistration(userId, code) {
      const app = this
      const confirmCodeResource = new Resource('auth/confirm-registration')
      app.loading = true
      confirmCodeResource.list({ code, user_id: userId })
        .then(response => {
          this.$message({
            type: 'success',
            message: response,
          })
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    sendLoginCredentials(user) {
      this.$confirm(`Are you sure you want to send login credentials to ${user.email}
        ?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const deleteStaffResource = new Resource('vendors/send-login-credentials')
        deleteStaffResource.update(user.id)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Login Credentials Sent Successfully',
            })
            this.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    deleteVendorUser(vendorId, userId) {
      this.$confirm('Are you sure you want to remove this user from this vendor?', 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const deleteStaffResource = new Resource('vendors/delete-vendor-user')
        deleteStaffResource.update(vendorId, { user_id: userId })
          .then(() => {
            this.fetchVendors()
            this.$message({
              type: 'success',
              message: 'Action Successful',
            })
            this.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    editVendor(value) {
      // console.log(props)
      const app = this
      app.selectedVendor = value
      app.showEditForm = true
    },
    editThisVendorUser(row) {
      const app = this
      app.selectedVendorUser = row
      app.showEditForm = true
      app.editVendorUser = true
    },
    handleDownload(tableTitle, vendorsList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'STAFF ID',
          'SURNAME',
          'OTHER NAMES',
          'EMAIL',
          'PHONE',
          'GENDER',
        ]
        const filterVal = [
          // 'studentship_status',
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone1',
          'user.gender',
        ]
        const list = vendorsList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv',
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'user.username') {
          return v.user.username
        }
        if (j === 'user.last_name') {
          return v.user.last_name
        }
        if (j === 'user.first_name') {
          return v.user.first_name
        }
        if (j === 'user.email') {
          return v.user.email
        }
        if (j === 'user.phone1') {
          return v.user.phone1
        }
        if (j === 'user.gender') {
          return v.user.gender
        }

        return v[j]
      }))
    },
  },
}
</script>
