<template>
  <aside
    style="min-height: 200px"
  >
    <highcharts
      v-if="showChart"
      :options="chart_report"
    />
  </aside>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => (null),
    },
    selectedProject: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false,
          },
        },
        title: {
          text: 'Compliance by Management Clause',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        plotOptions: {
          series: {
            // borderRadius: '1%',
          },
          column: {
            stacking: 'normal',
          },
        },
        xAxis: {
          categories: [],
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Scale',
          },
          stackLabels: {
            enabled: true,
          },
        },
        series: [],
        credits: {
          enabled: false,
        },
      },
      projectId: null,
      load: false,
      showChart: false,
    }
  },
  watch: {
    selectedProject() {
      this.fetchReportSummary()
    },
  },
  mounted() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      const app = this
      app.load = true
      app.showChart = false
      const param = { project_id: app.selectedProject.id, client_id: app.selectedClient.id }
      const fetchConsultingsResource = new Resource('reports/clause-report')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.chart_report.series = response.series
          app.chart_report.xAxis.categories = response.categories
          app.chart_report.subtitle.text = response.subtitle
          app.load = false
          app.showChart = true
        }).catch(app.load = false)
    },
  },

}
</script>
