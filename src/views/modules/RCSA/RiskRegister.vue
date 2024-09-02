<template>
  <div v-if="selectedClient !== null">
    <r-c-s-a-risk-assessment :selected-client="selectedClient" />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'

import RCSARiskAssessment from '@/views/modules/RCSA/RCSARiskAssessment.vue'
import Resource from '@/api/resource'

export default {
  components: {
    RCSARiskAssessment,
  },
  // props: {
  //   selectedClient: {
  //     type: Object,
  //     default: () => ({}),
  //   },
  // },
  data() {
    return {
      clients: [],
      impacts: [],
      likelihoods: [],
      loading: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    selectedClient() {
      this.setMatrix()
    },
  },
  created() {
    this.fetchClients()
    // this.setMatrix()
  },
  methods: {
    checkPermission,
    fetchClients() {
      const app = this
      app.$store.dispatch('clients/fetchClients')
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const app = this
      app.loading = true
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list(param)
        .then(response => {
          app.loading = false
          app.impacts = response.impacts
        })
        .catch(error => {
          app.loading = false
          console.log(error.response)
          // app.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const app = this
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource.list(param)
        .then(response => {
          app.likelihoods = response.likelihoods
        })
        .catch(error => {
          console.log(error.response)
          // app.$message.error(error.response.data.error)
        })
    },
  },
}
</script>
