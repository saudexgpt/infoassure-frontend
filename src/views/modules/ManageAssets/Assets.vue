<template>
  <el-card>
    <div>
      <div slot="header">
        <span class="pull-right">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-success"
            @click="createModal = true"
          >
            <feather-icon
              icon="PlusIcon"
              class="mr-50"
            />
            <span class="align-middle">Create New</span>
          </b-button>
        </span>
      </div>
      <v-client-table
        v-model="assets"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <div
          slot="name"
          slot-scope="{row}"
        >
          <input
            v-model="row.name"
            type="text"
            class="form-control"
            @blur="editAsset(row.id, $event)"
          >
        </div>
      </v-client-table>
    </div>
    <b-modal
      v-model="createModal"
      title="Create Asset"
      centered
      size="lg"
      hide-footer
    >
      <create-asset
        :asset-type-id="assetTypeId"
        :client-id="clientId"
        @save="fetchAssets(); createModal = false"
      />
    </b-modal>
  </el-card>
</template>

<script>
import {
  BButton, BModal,
} from 'bootstrap-vue'
  // import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateAsset from './CreateAsset.vue'

export default {
  components: {
    BButton,
    BModal,
    CreateAsset,
  },
  directives: {
    Ripple,
  },
  props: {
    assetTypeId: {
      type: Number,
      default: null,
    },
    clientId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      creating: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        // 'action',
      ],
      options: {
        headings: {},
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      assets: [],
      form: { names: [] },
      createModal: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchAssets()
  },
  methods: {
    fetchAssets() {
      const app = this
      app.display = 'table'
      app.loading = true
      const fetchAssetsResource = new Resource('risk-assessment/fetch-assets')
      fetchAssetsResource.list({ client_id: app.clientId, asset_type_id: app.assetTypeId })
        .then(response => {
          app.assets = response.assets
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    editAsset(id, event) {
      const app = this
      const name = event.target.value
      const fetchAssetResource = new Resource('risk-assessment/update-asset')
      fetchAssetResource.update(id, { name }).then(app.$message('Updated successfully')).catch()
    },
  },
}
</script>
