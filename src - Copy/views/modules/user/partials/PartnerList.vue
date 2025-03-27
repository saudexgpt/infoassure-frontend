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
            Registered Partners
          </h3>
        </b-col>
      </b-row>
      <hr>
      <!-- <span class="pull-right">
        <el-button
          v-if="partners.length > 0"
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="document"
          @click="handleDownload('List of Partners', partners)"
        >Export Excel</el-button>
      </span> -->
      <v-client-table
        v-model="partners"
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
                  @click="editThisPartnerUser(row)"
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
                  @click="deletePartnerUser(props.row.id, row.id)"
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
                :to="{name: 'partnersDetails', params: {id: props.row.id}}"
              >
                <span><feather-icon icon="EyeIcon" /> View Details</span>
              </router-link>
            </b-dropdown-item> -->
            <b-dropdown-item
              v-if="checkPermission(['update-partners'])"
              @click="editPartner(props.row)"
            >
              <span><feather-icon icon="Edit2Icon" /> Edit</span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="checkRole(['super']) && props.row.is_active === 0"
              @click="togglePartnerSuspension(props.row, 1, 'activate')"
            >
              <span><feather-icon icon="UnlockIcon" /> Activate</span>
            </b-dropdown-item>
            <b-dropdown-item
              v-if="checkRole(['super']) && props.row.is_active === 1"
              @click="togglePartnerSuspension(props.row, 0, 'suspend')"
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
          @pagination="fetchPartners"
        />
      </el-row>
    </div>
    <div v-else>
      <b-row>
        <b-col
          cols="7"
        >
          <h3>
            Edit Partner
          </h3>
        </b-col>
        <b-col cols="3">

          <span class="pull-right">
            <el-button
              style="margin:0 0 20px 20px;"
              type="danger"
              icon="el-icon-back"
              @click="fetchPartners(); showEditForm = false"
            >Back</el-button>
          </span>
        </b-col>
      </b-row>
      <hr>
      <edit-partner
        v-if="!editPartnerUser"
        :selected-partner="selectedPartner"
        @update="fetchPartners()"
      />
      <edit-partner-user
        v-if="editPartnerUser"
        :selected-partner-user="selectedPartnerUser"
        @update="fetchPartners()"
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
import Resource from '@/api/resource'
import EditPartner from './EditPartner.vue'
import EditPartnerUser from './EditPartnerUser.vue'

export default {
  components: {
    BDropdown,
    BDropdownItem,
    BRow,
    BCol,
    Pagination,
    EditPartner,
    EditPartnerUser,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      downloadLoading: false,
      editPartnerUser: false,
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
      partners: [],
      loading: false,
      selectedPartner: null,
      selectedPartnerUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
    }
  },
  created() {
    this.fetchPartners()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchPartners() {
      const app = this
      const { limit, page } = this.query
      app.loading = true
      const fetchStaffResource = new Resource('partners')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.partners = response.partners.data
          app.partners.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.partners.total
          app.loading = false
        })
    },
    togglePartnerSuspension(partner, value, action) {
      this.$confirm(`Are you sure you want to ${action} ${partner.name}
      ?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const partnerResource = new Resource('partners/toggle-partner-suspension')
        partnerResource.update(partner.id, { value })
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully',
            })
            this.loading = false
            this.fetchPartners()
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
        const deleteStaffResource = new Resource('partners/send-login-credentials')
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
    deletePartnerUser(partnerId, userId) {
      this.$confirm('Are you sure you want to remove this user from this partner?', 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.loading = true
        const deleteStaffResource = new Resource('partners/delete-partner-user')
        deleteStaffResource.update(partnerId, { user_id: userId })
          .then(() => {
            this.fetchPartners()
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
    editPartner(value) {
      // console.log(props)
      const app = this
      app.selectedPartner = value
      app.showEditForm = true
    },
    editThisPartnerUser(row) {
      const app = this
      app.selectedPartnerUser = row
      app.showEditForm = true
      app.editPartnerUser = true
    },
    handleDownload(tableTitle, partnersList) {
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
        const list = partnersList
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
