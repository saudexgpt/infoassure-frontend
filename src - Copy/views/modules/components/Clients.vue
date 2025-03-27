<template>
  <div>
    <div v-if="clients.length > 1">
      <el-select
        v-if="userData.login_as === 'super'"
        v-model="selectedClient"
        placeholder="Select Client"
        style="width: 100%;"
        value-key="id"
        filterable
        @input="setSelectedClient()"
      >
        <el-option-group
          v-for="partner in partnerWithClients"
          :key="partner.id"
          :label="partner.name"
        >
          <el-option
            v-for="(client, index) in partner.clients"
            :key="index"
            :value="client"
            :label="client.name"
          />
        </el-option-group>
      </el-select>
      <el-select
        v-else
        v-model="selectedClient"
        placeholder="Select Client"
        style="width: 100%;"
        value-key="id"
        filterable
        @input="setSelectedClient()"
      >
        <el-option
          v-for="(client, index) in clients"
          :key="index"
          :value="client"
          :label="client.name"
        />
      </el-select>
    </div>
    <h4
      v-else
      class="outline"
    >
      {{ storedClient.name }}
    </h4>
  </div>
</template>
<script>

export default {
  data() {
    return {
      selectedClient: {},
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    },
    clients() {
      return this.$store.getters.clients
    },
    storedClient() {
      return this.$store.getters.selectedClient
    },
    partnerWithClients() {
      return this.$store.getters.partnerWithClients
    },
  },
  watch: {
    storedClient() {
      this.selectedClient = this.storedClient
    },
  },
  created() {
    this.selectedClient = this.storedClient
  },
  methods: {
    fetchClients() {
      const app = this
      app.$store.dispatch('clients/fetchClients')
    },
    setSelectedClient() {
      const app = this
      app.$store.dispatch('clients/setSelectedClient', app.selectedClient)
      app.$store.dispatch('navItems/fetchActivatedModules', app.selectedClient).then(() => {
        app.$store.dispatch('navItems/setNavItems')
      })
      // app.$store.dispatch('clients/fetchActivatedModules', app.selectedClient)
    },
  },
}
</script>
<style scoped>
.outline {
    color: #fff;
    font-weight: 600;
    text-shadow: #000 0px 0px 1px;
    -webkit-font-smoothing: antialiased;
}
</style>
