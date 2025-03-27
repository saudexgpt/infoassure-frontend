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
        <div
          slot="child_row"
          slot-scope="props"
          style="max-height: 500px; overflow: auto;"
        >

          <el-row :gutter="20">
            <el-col :md="12">
              <el-alert
                type="error"
                :closable="false"
              >
                Privileged users for {{ props.row.name }}
              </el-alert>
              <v-client-table
                v-model="props.row.users"
                :columns="['name','action']"
                :options="{ filterable: false }"
              >
                <div
                  slot="name"
                  slot-scope="{row}"
                >
                  <strong>{{ row.name }}</strong>
                  <br>
                  {{ row.email }} <br>
                  {{ row.phone }}
                </div>
                <div
                  slot="action"
                  slot-scope="{row}"
                >
                  <el-tooltip
                    :content="`Edit ${row.name}'s info`"
                    placement="top"
                  >
                    <el-button
                      circle
                      type="primary"
                      @click="editThisVendorUser(row)"
                    >
                      <feather-icon icon="EditIcon" />
                    </el-button>
                  </el-tooltip>
                  <!-- <el-tooltip
                content="Activate Account"
                placement="top"
              >
                <el-button
                  circle
                  type="success"
                  @click="confirmRegistration(row.id, 'admin_confirmation')"
                >
                  <feather-icon icon="CheckIcon" />
                </el-button>
              </el-tooltip> -->
                  <el-tooltip
                    content="Send login credentials"
                    placement="top"
                  >
                    <el-button
                      circle
                      type="info"
                      @click="sendLoginCredentials(row)"
                    >
                      <feather-icon icon="KeyIcon" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    content="Delete User"
                    placement="top"
                  >
                    <el-button
                      circle
                      type="danger"
                      @click="deleteClientUser(props.row.id, row.id)"
                    >
                      <feather-icon icon="TrashIcon" />
                    </el-button>
                  </el-tooltip>
                </div>
              </v-client-table>
            </el-col>
            <el-col :md="12">
              <aside>
                <h4>Assign Staff to {{ props.row.name }}</h4>
                <el-select
                  v-model="props.row.client_users"
                  placeholder="Select User"
                  multiple
                  filterable
                  value-key="id"
                  collapse-tags
                  style="width: 100%"
                  @input="setVendorUsers(props.row, $event)"
                >
                  <el-option
                    v-for="(user, index) in client_users"
                    :key="index"
                    :value="user"
                    :label="user.name"
                  />
                </el-select>
                <v-client-table
                  v-if="props.row.client_users !== null"
                  v-model="props.row.client_users"
                  :columns="['name','email']"
                  :options="{ filterable: false }"
                />
                <v-client-table
                  v-else
                  v-model="empty"
                  :columns="['name','email']"
                  :options="{ filterable: false }"
                />
              </aside>
            </el-col>
          </el-row>
        </div>
        <div
          slot="second_approval"
          slot-scope="{row}"
        >
          <strong>{{ (row.second_approval !== null) ? ((row.second_approval.action === 'Approve') ? 'Approved' : 'Rejected') : 'Pending' }}</strong>
        </div>
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
          v-show="total > 10"
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
      <edit-vendor
        v-if="!editVendorUser"
        :selected-vendor="selectedVendor"
        @update="fetchVendors()"
      />
      <edit-vendor-user
        v-if="editVendorUser"
        :selected-vendor-user="selectedVendorUser"
        @update="fetchVendors()"
      />
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
import EditVendor from './EditVendor.vue'
import EditVendorUser from './EditVendorUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BRow,
    BCol,
    Pagination,
    // OnboardingForm,
    EditVendor,
    EditVendorUser,
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
        // 'rating',
        // 'second_approval',
        // 'action',
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          second_approval: 'Status',
          action: '',

          // id: 'S/N',
        },
        filterByColumn: false,
        // rowAttributesCallback(row) {
        //   if (row.second_approval === null) {
        //     return { style: 'background: #fcf1c0; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Approve') {
        //     return { style: 'background: #eaf8e5; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Reject') {
        //     return { style: 'background: #f5dbd3; color: #000000' }
        //   }
        //   return {}
        // },
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
      empty: [],
      client_users: [],
      selectedClientUsers: [],
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  mounted() {
    this.fetchVendors()
    this.fetchClientUsers()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchClientUsers() {
      const app = this
      const clientUsersResource = new Resource('vdd/fetch-client-users')
      clientUsersResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.client_users = response.client_users
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    setVendorUsers(vendor, selectedClientUsers) {
      const app = this
      const confirmCodeResource = new Resource('vdd/assign-users-as-vendor-admin')
      confirmCodeResource.update(vendor.id, { client_users: selectedClientUsers })
        .then(() => {
          app.fetchVendors(false)
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    fetchVendors(load = true) {
      const app = this
      const { limit, page } = this.query
      app.loading = load
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
      const confirmCodeResource = new Resource('vdd/confirm-registration')
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
        const deleteStaffResource = new Resource('vdd/send-login-credentials')
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
