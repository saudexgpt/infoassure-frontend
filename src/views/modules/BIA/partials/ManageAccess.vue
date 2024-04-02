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
              variant="gradient-success"
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
            v-model="selectedClient"
            value-key="id"
            placeholder="Select Client"
            style="width: 100%;"
            @input="fetchOtherUsers()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client"
              :label="client.name"
            />
          </el-select>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
        >

          <div v-if="selectedClient !== null">
            Access Code: <strong> {{ selectedClient.access_code }} </strong>

            <el-button @click="refreshCode()">
              Refresh Code
            </el-button>
          </div>
        </el-col>
      </el-row>
    </aside>
    <v-client-table
      v-model="users"
      v-loading="loading"
      :columns="['name', 'email']"
      :options="{}"
    >
      <!-- <div
        slot="action"
        slot-scope="$props"
      >
        <el-tooltip
          content="Edit"
          placement="top"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="manageProject(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
        <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div> -->
    </v-client-table>
    <create-other-user
      v-if="isCreateActive"
      v-model="isCreateActive"
      :clients="clients"
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

export default {
  components: {
    CreateOtherUser,
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
      clients: [],
      selectedClient: null,
      isCreateActive: false,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      const fetchClientsResource = new Resource('clients')
      fetchClientsResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    fetchOtherUsers() {
      const app = this
      const fetchOtherClientUsersResource = new Resource('clients/fetch-other-users')
      fetchOtherClientUsersResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.users = response.users
        })
    },
    refreshCode() {
      const app = this
      const fetchOtherClientUsersResource = new Resource('clients/refresh-access-code')
      fetchOtherClientUsersResource.update(app.selectedClient.id)
        .then(response => {
          app.selectedClient = response.client
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
