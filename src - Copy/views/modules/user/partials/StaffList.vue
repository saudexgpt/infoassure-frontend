<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            Registered Staff
          </h3>
        </b-col>
      </b-row>
      <hr>
    </div>
    <div>
      <!-- <span class="pull-right">
        <el-button
          v-if="staff.length > 0"
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="document"
          @click="handleDownload('List of Staff', staff)"
        >Export Excel</el-button>
      </span> -->
      <v-client-table
        v-model="staff"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <!-- <div
          slot="action"
          slot-scope="props"
        >
          <b-dropdown
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            class="mx-1"
            right
            text="Action"
          >
            <b-dropdown-item>
              <router-link
                :to="{name: 'staffDetails', params: {id: props.row.id}}"
              >
                <span><feather-icon icon="EyeIcon" /> View Details</span>
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="editStaff(props.row)">
              <span><feather-icon icon="Edit2Icon" /> Edit</span>
            </b-dropdown-item>
            <b-dropdown-item @click="resetPassword(props.row.user)">
              <span><feather-icon icon="UnlockIcon" /> Reset Password</span>
            </b-dropdown-item>
            <b-dropdown-item @click="loginAsUser(props.row.user)">
              <span v-b-tooltip.hover.right="'Login as ' + props.row.user.first_name"><feather-icon icon="KeyIcon" /> Login</span>
            </b-dropdown-item>
            <b-dropdown-item @click="removeStaff(props.row)">
              <span v-b-tooltip.hover.right="'Delete ' + props.row.user.first_name"><feather-icon icon="TrashIcon" /> Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </div> -->
      </v-client-table>
    </div>
    <!-- <div v-else>
      <edit-staff
        :selected-staff="selectedClient"
        @update="reloadTable()"
      />
    </div> -->
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      downloadLoading: false,
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'email',
        'phone',
        // 'action',
        // 'user.password_status',
      ],

      options: {
        headings: {
          action: '',

          // id: 'S/N',
        },
        filterByColumn: true,
        sortable: [
          'name',
          'email',
          'phone',
        ],
        // filterable: false,
        filterable: [
          'name',
          'email',
          'phone',
        ],
      },
      staff: [],
      loading: false,
      selectedClient: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    fetchStaff() {
      const app = this
      app.loading = true
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list()
        .then(response => {
          app.staff = response.staff
          app.loading = false
        })
    },
    async loginAsUser(user) {
      await this.$store.dispatch('user/loginAsUser', { user_id: user.id })
      // this.$router.push('/login').catch(() => {})
      window.location = '/'
    },
    resetPassword(user) {
      const app = this
      const param = {
        user_id: user.id,
      }
      app.$confirm(`This will change the password for ${user.username}. Do you want to continue?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const resetPasswordResource = new Resource('user-setup/admin-reset/password')
        resetPasswordResource.list(param)
          .then(() => {
            app.$alert(`Password for ${user.username} has been reset to: password `, 'Password Reset', {
              confirmButtonText: 'OK',
            })
            app.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    approve(user) {
      const app = this
      app.$confirm(`This will activate ${user.username}'s account. Do you want to continue?`, 'Confirm Activation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const resetPasswordResource = new Resource('user-setup/approve-user')
        resetPasswordResource.update(user.id)
          .then(() => {
            app.$alert('Account activation successful', 'Successful', {
              confirmButtonText: 'OK',
            })
            this.reloadTable()
            app.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    editStaff(value) {
      // console.log(props)
      const app = this
      app.selectedClient = value
    },
    reloadTable() {
      this.selectedClient = null
      this.fetchStaff()
    },
    removeStaff(staff) {
      this.$confirm(`This will delete ${staff.user.username} from the portal. It cannot be undone. Do you want to continue?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const deleteStaffResource = new Resource('user-setup/staff/destroy')
        deleteStaffResource.destroy(staff.id)
          .then(() => {
            this.reloadTable()
            this.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    handleDownload(tableTitle, staffList) {
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
        const list = staffList
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
        if (j === 'last_name') {
          return v.user.last_name
        }
        if (j === 'first_name') {
          return v.user.first_name
        }
        if (j === 'email') {
          return v.user.email
        }
        if (j === 'phone1') {
          return v.user.phone1
        }
        if (j === 'gender') {
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
