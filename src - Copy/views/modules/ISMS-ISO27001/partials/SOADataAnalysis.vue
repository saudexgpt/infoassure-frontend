<template>
  <b-row class="match-height">
    <b-col :md="12">
      <s-o-a-graphical-summary
        v-if="summary !== null"
        :summary="summary"
      />
    </b-col>
    <b-col :md="12">
      <s-o-a-tabular-summary
        v-if="summary !== null"
        :selected-client="selectedClient"
        :data="summary.tabular_presentations"
      />
    </b-col>
  </b-row>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import SOAGraphicalSummary from '../charts/SOAGraphicalSummary.vue'
import SOATabularSummary from '../charts/SOATabularSummary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    SOAGraphicalSummary,
    SOATabularSummary,
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      loading: false,
      summary: null,
    }
  },
  watch: {
    selectedClient() {
      this.fetchReportSummary()
    },
  },
  created() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      const app = this
      const param = { client_id: app.selectedClient.id }
      const fetchConsultingsResource = new Resource('reports/soa-summary')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.summary = response
        })
    },
  },

}
</script>
