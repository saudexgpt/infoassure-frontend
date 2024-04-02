<template>
  <aside>
    <highcharts :options="chart_report" />
  </aside>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {
  },
  props: {
    selectedProject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
          },
        },
        title: {
          text: 'Performance/Assessment Summary',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage}%',
          // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          point: {
            valueSuffix: '%',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 50,
            // innerSize: 100, // what makes it donut
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}:</b> {point.y}<br>{point.percentage} %',
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          },
        },
        series: [{
          name: 'Value',
          colorByPoint: true,
          data: [],
        }],
        credits: {
          enabled: false,
        },
      },
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      const app = this
      app.loading = true
      const param = { project_id: app.selectedProject.id, client_id: app.selectedProject.client_id }
      const fetchConsultingsResource = new Resource('reports/summary-report')
      fetchConsultingsResource.list(param)
        .then(response => {
          const { reports } = response
          app.chart_report.series = [
            {
              name: 'Value',
              colorByPoint: true,
              data: [{
                name: 'Conformity',
                y: reports.conformity,
                color: '#00a65a',
                // sliced: true,
                // selected: true,
              }, {
                name: 'Non Conformity',
                y: reports.non_conformity,
                color: '#f00c12',
              }, {
                name: 'Open For Improvement',
                y: reports.open_for_imporvement,
                color: '#FFA500',
              }, {
                name: 'N/A',
                y: reports.not_applicable,
                color: '#cccccc',
              }],
            },
          ]
          app.chart_report.subtitle.text = response.subtitle
          app.chart_report.title.text = response.title
          app.loading = false
        })
    },
  },

}
</script>
