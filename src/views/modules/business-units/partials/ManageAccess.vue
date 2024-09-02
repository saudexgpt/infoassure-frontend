<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col cols="6">
          <h4>Manage User Access</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateActive = true"
            >
              <feather-icon
                icon="PlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>

    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="selectedBusinessUnit"
            value-key="id"
            placeholder="Select Business Unit"
            style="width: 100%;"
            @input="fetchOtherUsers()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >

          <div v-if="selectedBusinessUnit !== null">
            Access Code: <code v-loading="loadCode"> {{ selectedBusinessUnit.access_code }} </code>

            <el-button
              size="mini"
              type="warning"
              @click="refreshCode()"
            >
              New Code
            </el-button>
          </div>
        </el-col>
      </el-row>
    </aside>
    <v-client-table
      v-model="users"
      v-loading="loading"
      :columns="['name', 'email', 'action']"
      :options="{}"
    >
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          content="Edit"
          placement="top"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="editRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
        <!-- <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button> -->
      </div>
    </v-client-table>
    <create-other-user
      v-if="isCreateActive"
      v-model="isCreateActive"
      :selected-client="selectedClient"
      :business-units="business_units"
      @save="fetchOtherUsers"
    />
    <edit-other-user
      v-if="isEditActive"
      v-model="isEditActive"
      :business-units="business_units"
      :selected-user="selectedUser"
      @update="fetchOtherUsers"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateOtherUser from './CreateOtherUser.vue'
import EditOtherUser from './EditOtherUser.vue'

export default {
  components: {
    CreateOtherUser,
    EditOtherUser,
    BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      pageLength: 10,
      dir: false,
      users: [],
      business_units: [],
      business_unit_id: '',
      selectedBusinessUnit: null,
      selectedClient: null,
      selectedUser: null,
      isCreateActive: false,
      isEditActive: false,
      loadCode: false,
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    storedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    storedClient() {
      this.selectedClient = this.storedClient
      this.fetchBusinessUnits()
    },
  },
  created() {
    this.fetchClients()
    this.selectedClient = this.storedClient
    this.fetchBusinessUnits()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      app.$store.dispatch('clients/fetchClients')
    },
    fetchBusinessUnits() {
      const app = this
      app.selectedBusinessUnit = null
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchOtherUsers() {
      const app = this
      app.loading = true
      const fetchOtherClientUsersResource = new Resource('business-units/fetch-other-users')
      fetchOtherClientUsersResource.list({ business_unit_id: app.selectedBusinessUnit.id })
        .then(response => {
          app.loading = false
          app.users = response.users
        }).catch(() => { app.loading = false })
    },
    refreshCode() {
      const app = this
      app.loadCode = true
      const fetchOtherClientUsersResource = new Resource('business-units/refresh-access-code')
      fetchOtherClientUsersResource.update(app.selectedBusinessUnit.id)
        .then(response => {
          app.loadCode = false
          app.selectedBusinessUnit = response.business_unit
        }).catch(() => { app.loadCode = false })
    },
    editRow(row) {
      const app = this
      app.selectedUser = row
      app.isEditActive = true
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
