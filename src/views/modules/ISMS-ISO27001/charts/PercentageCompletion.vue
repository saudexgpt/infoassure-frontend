<template>
  <aside
    style="min-height: 200px"
  >
    <el-row
      v-if="showChart"
      :gutter="10"
    >
      <el-col :md="16">
        <highcharts
          :options="chart_report"
        />
      </el-col>
      <el-col :md="8">
        <div style="margin-top: 70px; text-align: center">
          <h3>Assessment Completion</h3>
          <el-progress
            type="dashboard"
            :percentage="parseInt(total_progress)"
            :stroke-width="20"
            :width="200"
            :color="customColorMethod"
          />
          <div style="margin-top: -70px; margin-bottom: 70px">
            <strong>Complete</strong>
          </div>
        </div>
      </el-col>
    </el-row>

  </aside>
</template>
<script>
import Resource from '@/api/resource'

export default {
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
          type: 'areaspline',
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25,
          },
        },
        title: {
          text: 'Percentage Completion by Clause',
        },
        subtitle: {
          text: '',
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Scale (%)',
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat: 'Completion: <b>{point.y:.1f} %</b>',
        },
        series: [{
          name: 'Completion',
          colorByPoint: true,
          data: [],
          dataLabels: {
            enabled: true,
            // rotation: -90,
            // color: '#FFFFFF',
            // align: 'right',
            // format: '{point.y:.1f}', // one decimal
            // y: 10, // 10 pixels down from the top
            // style: {
            //   fontSize: '13px',
            //   fontFamily: 'Verdana, sans-serif',
            // },
          },
        }],
        credits: {
          enabled: false,
        },
      },
      projectId: null,
      load: false,
      showChart: false,
      total_progress: 0,
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
      const fetchConsultingsResource = new Resource('reports/completion-report')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.chart_report.series[0].data = response.data
          app.chart_report.subtitle.text = response.subtitle
          app.total_progress = response.total_progress
          app.load = false
          app.showChart = true
        }).catch(app.load = false)
    },
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    },
  },

}
</script>
