<template>
  <el-card>
    <h4>Manage Risk & Control Matrix</h4>
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
          filterable
        >
          <el-option
            v-for="(client, index) in clients"
            :key="index"
            :value="client"
            :label="client.name"
          />
        </el-select>
      </el-col>
    </el-row>
    <p />
    <div v-if="selectedClient !== null">
      <view-risk-control-matrix
        :client-id="selectedClient.id"
        assessment-module="rcsa"
      />
    </div>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import ViewRiskControlMatrix from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
import Resource from '@/api/resource'

export default {
  components: {
    ViewRiskControlMatrix,
  },
  data() {
    return {
      clients: [],
      business_impact_analyses: [],
      selectedClient: null,
      loading: false,
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
          if (app.clients.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            app.selectedClient = app.clients[0]
          }
        })
    },
  },
}
</script>
