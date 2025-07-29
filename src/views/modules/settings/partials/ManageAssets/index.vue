<template>
  <div>
    <el-row v-if="loading" :gutter="20">
      <el-col :md="4">
        <el-skeleton :rows="5" />
      </el-col>
      <el-col :md="20">
        <el-skeleton :rows="5" />
      </el-col>
    </el-row>
    <el-tabs v-else v-model="activeName" tab-position="left" type="border-card">
      <el-tab-pane
        v-for="(asset_type, index) in asset_types"
        :key="index"
        :label="asset_type.name"
        :name="`asset-${index}`"
        lazy
      >
        <Assets
          :can-change-status="true"
          :asset-type="asset_type"
          :client-id="asset_type.client_id"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import Assets from './Assets.vue'

export default {
  components: {
    Assets
  },
  data() {
    return {
      selectedAssetType: '',
      activeName: 'asset-0',
      form: { client_id: '', names: [] },
      asset_types: [],
      loading: false,
      showCreate: false,
      columns: ['name', 'action'],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: []
      }
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    storedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    storedClient() {
      this.form.client_id = this.storedClient.id
      this.fetchAssetTypes()
    }
  },
  mounted() {
    this.fetchClients()
    this.form.client_id = this.storedClient.id
    this.fetchAssetTypes()
  },
  methods: {
    showTabDetails(tab, event) {
      //
      console.log(event.target.id)
      console.log(tab)
      // let hashString = event.target.id
      // hashString = hashString.replace('tab-', '')
      // // this.activeName = value
      // this.$router.push({ hash: `${hashString}` })
      // this.keyValue += 1
    },
    fetchClients() {
      this.$store.dispatch('clients/fetchClients')
    },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('assets/fetch-asset-types')
      this.loading = true
      fetchEntryResource
        .list({ client_id: this.form.client_id })
        .then((response) => {
          this.asset_types = response.asset_types
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    editAssetType(id, event) {
      const name = event.target.value
      const fetchMatriceResource = new Resource('assets/update-asset-type')
      fetchMatriceResource.update(id, { name }).then().catch()
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('assets/delete-asset-type')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchAssetTypes()
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            this.$message.error(error.response.data.error)
            this.loading = false
          })
      }
    }
  }
}
</script>
