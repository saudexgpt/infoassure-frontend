<template>
  <div>
    <div>
      <el-row>
        <el-col :md="21">
          <h3> Registered Users </h3>
        </el-col>
        <el-col :md="3">
          <el-button type="primary" @click="registerDialog = true">New Registration</el-button>
        </el-col>
      </el-row>
      <hr />
      <!-- <span class="pull-right">
          <el-button
            v-if="users.length > 0"
            :loading="downloadLoading"
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="document"
            @click="handleDownload('List of Clients', users)"
          >Export Excel</el-button>
        </span> -->
      <v-client-table :data="users" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:is_active="{ row }">
          <div>
            {{ row.is_active === 1 ? 'Active' : 'Suspended' }}
          </div>
        </template>
        <template v-slot:action="{ row }">
          <div>
            <el-tooltip
              v-if="row.email_verified_at === null"
              content="Activate Account"
              placement="top"
            >
              <el-button
                circle
                type="success"
                @click="confirmRegistration(row.id, 'admin_confirmation')"
              >
                <icon icon="tabler:check" />
              </el-button>
            </el-tooltip>
            <el-tooltip :content="`Edit ${row.name}'s info`" placement="top">
              <el-button circle type="primary" @click="editThisClientUser(row)">
                <icon icon="tabler:edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-if="row.is_client_admin === 0"
              content="Send login credentials"
              placement="top"
            >
              <el-button circle type="info" @click="sendLoginCredentials(row)">
                <icon icon="tabler:key" />
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="row.is_client_admin === 0" content="Delete User" placement="top">
              <el-button circle type="danger" @click="deleteClientUser(props.row.id, row.id)">
                <icon icon="tabler:trash" />
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </v-client-table>
      <!-- <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchClientUsers"
        />
      </el-row> -->
    </div>
    <!-- <el-row>
      <el-col cols="7">
        <h3> Edit Client </h3>
      </el-col>
      <el-col cols="3">
        <span class="pull-right">
          <el-button
            style="margin: 0 0 20px 20px"
            type="danger"
            icon="el-icon-back"
            @click="(fetchClientUsers(), (showEditForm = false))"
            >Back</el-button
          >
        </span>
      </el-col>
    </el-row> -->

    <el-dialog v-model="registerDialog" title="Register New User">
      <RegisterUserClient @saved="fetchClientUsers" />
    </el-dialog>
    <el-dialog v-model="editClientUser" title="Edit User">
      <edit-client-user
        v-if="editClientUser"
        :selected-client-user="selectedClientUser"
        @update="fetchClientUsers()"
      />
    </el-dialog>
    <!-- <el-dialog v-model="editClient" title="Edit">
      <EditClient
        v-if="!editClientUser"
        :selected-client="selectedClient"
        @update="fetchClientUsers()"
      />
    </el-dialog> -->
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
// import Pagination from '@/views/components/Pagination-main/index.vue'
import RegisterUserClient from './RegisterUserClient.vue'
// import EditClient from './EditClient.vue'
import EditClientUser from './EditClientUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // EditClient,
    EditClientUser,
    RegisterUserClient
  },
  data() {
    return {
      registerDialog: false,
      downloadLoading: false,
      editClientUser: false,
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'email',
        'phone',
        'designation',
        'action'
        // 'user.password_status',
      ],

      options: {
        headings: {
          action: ''

          // id: 'S/N',
        },
        filterByColumn: false,
        rowAttributesCallback(row) {
          if (row.email_verified_at === null) {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          return {}
        },
        sortable: ['name', 'email', 'phone'],
        // filterable: false,
        filterable: ['name', 'email', 'phone']
      },
      showEditForm: false,
      users: [],
      loading: false,
      selectedClient: null,
      selectedClientUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50
      },
      total: 0
    }
  },
  created() {
    this.fetchClientUsers()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchClientUsers() {
      // const { limit, page } = this.query
      this.registerDialog = false
      this.editClientUser = false
      this.loading = true
      const fetchStaffResource = new Resource('clients/users')
      fetchStaffResource.list(this.query).then((response) => {
        this.users = response.users
        //   this.users = response.users.data
        //   this.users.forEach((element, index) => {
        //     // eslint-disable-next-line no-param-reassign, dot-notation
        //     element['index'] = (page - 1) * limit + index + 1
        //   })
        //   this.total = response.users.total
        this.loading = false
      })
    },
    toggleClientSuspension(client, value, action) {
      this.$confirm(
        `Are you sure you want to ${action} ${client.name}
        ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const clientResource = new Resource('clients/toggle-client-suspension')
          clientResource.update(client.id, { value }).then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully'
            })
            this.loading = false
            this.fetchClientUsers()
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    confirmRegistration(userId, code) {
      const confirmCodeResource = new Resource('auth/confirm-registration')
      this.loading = true
      confirmCodeResource
        .list({ code, user_id: userId })
        .then((response) => {
          this.fetchClientUsers()
          this.$message({
            type: 'success',
            message: response
          })
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    sendLoginCredentials(user) {
      this.$confirm(
        `Are you sure you want to send login credentials to ${user.email}
        ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('clients/send-login-credentials')
          deleteStaffResource.update(user.id).then(() => {
            this.$message({
              type: 'success',
              message: 'Login Credentials Sent Successfully'
            })
            this.loading = false
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    deleteClientUser(clientId, userId) {
      this.$confirm(
        'Are you sure you want to remove this user from this client?',
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('clients/delete-client-user')
          deleteStaffResource.update(clientId, { user_id: userId }).then(() => {
            this.fetchClientUsers()
            this.$message({
              type: 'success',
              message: 'Action Successful'
            })
            this.loading = false
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    editClient(value) {
      // console.log(props)

      this.selectedClient = value
      this.showEditForm = true
    },
    editThisClientUser(row) {
      this.selectedClientUser = row
      this.showEditForm = true
      this.editClientUser = true
    },
    handleDownload(tableTitle, usersList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'STAFF ID',
          'SURNAME',
          'OTHER NAMES',
          'EMAIL',
          'PHONE',
          'GENDER'
        ]
        const filterVal = [
          // 'studentship_status',
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone1',
          'user.gender'
        ]
        const list = usersList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
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
        })
      )
    }
  }
}
</script>
