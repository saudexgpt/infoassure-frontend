<template>
  <el-card>
    <div slot="header">
      <span
        v-if="form.client_id !== ''"
        class="pull-right"
      >
        <el-button
          v-if="!showCreate"
          type="primary"
          size="mini"
          @click="showCreate = true"
        >Create</el-button>
        <el-button
          v-if="showCreate"
          type="danger"
          size="mini"
          @click="showCreate = false"
        >Hide Create Form</el-button>
      </span>
      <h3>Asset Types</h3>
    </div>
    <div v-if="form.client_id !== ''">
      <create-asset-type
        v-if="showCreate"
        :client-id="form.client_id"
        @save="fetchAssetTypes"
      />
      <p>click on the <code>+</code> sign to manage assets under each asset type</p>
      <v-client-table
        v-model="asset_types"
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
            Assets under {{ props.row.name }}
          </el-alert>
          <assets
            :can-change-status="true"
            :asset-type-id="props.row.id"
            :client-id="props.row.client_id"
          />
        </div>
        <div
          slot="name"
          slot-scope="{row}"
        >
          <input
            v-model="row.name"
            type="text"
            class="form-control"
            @blur="editAssetType(row.id, $event)"
          >
        </div>

        <div
          slot="action"
          slot-scope="{row}"
        >
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteEntry(row)"
          />
        </div>
      </v-client-table>
    </div>
  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import Assets from './Assets.vue'
import CreateAssetType from './CreateAssetType.vue'

export default {
  components: {
    Assets,
    CreateAssetType,
  },
  data() {
    return {
      form: { client_id: '', names: [] },
      asset_types: [],
      loading: false,
      showCreate: false,
      columns: [
        'name',
        'action',
      ],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: [],
      },
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
      this.form.client_id = this.storedClient.id
      this.fetchAssetTypes()
    },
  },
  created() {
    this.fetchClients()
    this.form.client_id = this.storedClient.id
    this.fetchAssetTypes()
  },
  methods: {
    fetchClients() {
      const app = this
      app.$store.dispatch('clients/fetchClients')
    },
    fetchAssetTypes() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
      app.loading = true
      fetchEntryResource.list({ client_id: app.form.client_id })
        .then(response => {
          app.asset_types = response.asset_types
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    editAssetType(id, event) {
      const name = event.target.value
      const fetchMatriceResource = new Resource('risk-assessment/update-asset-type')
      fetchMatriceResource.update(id, { name }).then().catch()
    },
    deleteEntry(row) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-asset-type')
        app.loading = true
        saveEntryResource.destroy(row.id)
          .then(() => {
            app.fetchAssetTypes()
            app.loading = false
          })
          .catch(error => {
            // console.log(error.response)
            app.$message.error(error.response.data.error)
            app.loading = false
          })
      }
    },
  },
}
</script>
