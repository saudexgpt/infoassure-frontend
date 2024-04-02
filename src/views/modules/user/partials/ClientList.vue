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
            Registered Clients
          </h3>
        </b-col>
      </b-row>
      <hr>
      <!-- <span class="pull-right">
        <el-button
          v-if="clients.length > 0"
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="document"
          @click="handleDownload('List of Clients', clients)"
        >Export Excel</el-button>
      </span> -->
      <v-client-table
        v-model="clients"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="child_row"
          slot-scope="props"
        >
          <el-alert
            type="success"
            :closable="false"
          >
            Privileged users for {{ props.row.name }}
          </el-alert>
          <v-client-table
            v-model="props.row.users"
            :columns="['name', 'action']"
            :options="{ filterable: false }"
          >
            <div
              slot="name"
              slot-scope="{row}"
            >
              <strong>{{ row.name }}</strong> <br>
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
                  @click="editThisClientUser(row)"
                >
                  <feather-icon icon="EditIcon" />
                </el-button>
              </el-tooltip>
              <el-tooltip
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
              </el-tooltip>
              <el-tooltip
                content="Send login credentials"
                placement="top"
              >
                <el-button
                  circle
                  type="warning"
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
        </div>
        <div
          slot="is_active"
          slot-scope="{row}"
        >
          {{ (row.is_active === 1) ? 'Active' : 'Suspended' }}
        </div>
        <div
          slot="action"
          slot-scope="props"
        >
          <b-dropdown
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            class="mx-1"
            right
            text="Action"
          >
            <!-- <b-dropdown-item>
              <router-link
                :to="{name: 'clientsDetails', params: {id: props.row.id}}"
              >
                <span><feather-icon icon="EyeIcon" /> View Details</span>
              </router-link>
            </b-dropdown-item> -->
            <b-dropdown-item
              v-if="checkPermission(['update-clients'])"
              @click="editClient(props.row)"
            >
              <span><feather-icon icon="Edit2Icon" /> Edit</span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="checkRole(['super']) && props.row.is_active === 0"
              @click="toggleClientSuspension(props.row, 1, 'activate')"
            >
              <span><feather-icon icon="UnlockIcon" /> Activate</span>
            </b-dropdown-item>
            <b-dropdown-item
              v-if="checkRole(['super']) && props.row.is_active === 1"
              @click="toggleClientSuspension(props.row, 0, 'suspend')"
            >
              <span><feather-icon icon="LockIcon" /> Suspend</span>
            </b-dropdown-item>
            <!-- <b-dropdown-item @click="resetPassword(props.row.user)">
              <span><feather-icon icon="UnlockIcon" /> Reset Password</span>
            </b-dropdown-item>
            <b-dropdown-item @click="loginAsUser(props.row.user)">
              <span v-b-tooltip.hover.right="'Login as ' + props.row.user.first_name"><feather-icon icon="KeyIcon" /> Login</span>
            </b-dropdown-item>
            <b-dropdown-item @click="removeStaff(props.row)">
              <span v-b-tooltip.hover.right="'Delete ' + props.row.user.first_name"><feather-icon icon="TrashIcon" /> Delete</span>
            </b-dropdown-item> -->
          </b-dropdown>
        </div>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchClients"
        />
      </el-row>
    </div>
    <div v-else>
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            Edit Client
          </h3>
        </b-col>
        <b-col cols="3">

          <span class="pull-right">
            <el-button
              style="margin:0 0 20px 20px;"
              type="danger"
              icon="el-icon-back"
              @click="fetchClients(); showEditForm = false"
            >Back</el-button>
          </span>
        </b-col>
      </b-row>
      <hr>
      <edit-client
        v-if="!editClientUser"
        :selected-client="selectedClient"
        @update="fetchClients()"
      />
      <edit-client-user
        v-if="editClientUser"
        :selected-client-user="selectedClientUser"
        @update="fetchClients()"
      />
    </div>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/components/Pagination-main/index.vue'
import EditClient from './EditClient.vue'
import EditClientUser from './EditClientUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BDropdown,
    BDropdownItem,
    BRow,
    BCol,
    Pagination,
    EditClient,
    EditClientUser,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      downloadLoading: false,
      editClientUser: false,
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'contact_email',
        'contact_phone',
        'contact_address',
        'is_active',
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
      clients: [],
      loading: false,
      selectedClient: null,
      selectedClientUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchClients() {
      const app = this
      const { limit, page } = this.query
      app.loading = true
      const fetchStaffResource = new Resource('clients')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.clients = response.clients.data
          app.clients.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.clients.total
          app.loading = false
        })
    },
    toggleClientSuspension(client, value, action) {
      this.$confirm(`Are you sure you want to ${action} ${client.name}
      ?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const clientResource = new Resource('clients/toggle-client-suspension')
        clientResource.update(client.id, { value })
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully',
            })
            this.loading = false
            this.fetchClients()
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
        const deleteStaffResource = new Resource('clients/send-login-credentials')
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
    deleteClientUser(clientId, userId) {
      this.$confirm('Are you sure you want to remove this user from this client?', 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const deleteStaffResource = new Resource('clients/delete-client-user')
        deleteStaffResource.update(clientId, { user_id: userId })
          .then(() => {
            this.fetchClients()
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
    editClient(value) {
      // console.log(props)
      const app = this
      app.selectedClient = value
      app.showEditForm = true
    },
    editThisClientUser(row) {
      const app = this
      app.selectedClientUser = row
      app.showEditForm = true
      app.editClientUser = true
    },
    handleDownload(tableTitle, clientsList) {
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
        const list = clientsList
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
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
