<template>
  <div
    style="min-height: 200px"
  >
    <el-skeleton
      :loading="load"
      :rows="3"
      animated
    />
    <highcharts
      v-if="showChart"
      :options="chart_report"
    />
  </div>
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
    filterBy: {
      type: Object,
      default: () => ({
        group_by: '',
        clause_id: '',
        assignee_id: '',
        date: '',
      }),
    },
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0,
          },
        },
        title: {
          text: 'Overall Status',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%',
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
              enabled: false,
              format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            showInLegend: true,
          },
        },
        series: [{
          name: 'Value Count',
          colorByPoint: true,
          data: [],
        }],
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
      const param = {
        project_id: app.selectedProject.id, client_id: app.selectedClient.id, group_by: app.filterBy.group_by, clause_id: app.filterBy.clause_id, assignee_id: app.filterBy.assignee_id, date: app.filterBy.date,
      }
      const fetchConsultingsResource = new Resource('ndpa/reports/summary-report')
      fetchConsultingsResource.list(param)
        .then(response => {
          const { reports } = response
          app.chart_report.series = [
            {
              name: 'No. of Occurence',
              colorByPoint: true,
              data: [{
                name: 'Conformity',
                y: reports.conformity,
                color: '#00a65a',
                sliced: true,
                selected: true,
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
          app.load = false
          app.showChart = true
        }).catch(app.load = false)
    },
  },

}
</script>
