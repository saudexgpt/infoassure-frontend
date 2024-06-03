<template>
  <div>
    <h3>Risks & Threats Setup</h3>
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
    <el-tabs
      v-if="selectedClient !== null"
      type="border-card"
    >
      <el-tab-pane label="Risk Register">
        <risk-register
          :selected-client="selectedClient"
        />
      </el-tab-pane>
      <el-tab-pane label="Impact Areas">
        <risk-impact-areas
          :selected-client="selectedClient"
        />
      </el-tab-pane>
      <el-tab-pane
        label="Risk Matrix"
        :lazy="true"
      >
        <risk-matrix :selected-client="selectedClient" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RiskMatrix from './RiskMatrix.vue'
import RiskRegister from './RiskRegister.vue'
import RiskImpactAreas from './RiskImpactAreas.vue'
import Resource from '@/api/resource'

export default {
  components: {
    RiskRegister,
    RiskMatrix,
    RiskImpactAreas,
  },
  data() {
    return {
      clients: [],
      selectedClient: null,
      loading: false,
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
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
