<template>
  <div
    style="min-height: 200px"
  >
    <el-skeleton
      :loading="load"
      :rows="6"
      animated
    />
    <div
      v-if="showChart"
    >
      <highcharts
        :options="chart_report"
      />
    </div>
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
        group_by: 'clause_id',
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
          type: 'column',
          options3d: {
            enabled: false,
          },
        },
        title: {
          text: 'Compliance by Requirement',
          align: 'center',
        },
        subtitle: {
          text: 'Level of Conformity for each part of the NDPA Requirement',
        },
        plotOptions: {
          series: {
            // borderRadius: '1%',
          },
          column: {
            // stacking: 'normal',
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
      group_by: 'clause_id',
      clauses: [],
      clause_id: '',
    }
  },
  watch: {
    selectedProject() {
      this.fetchReportSummary()
    },
    filterBy() {
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
      const fetchConsultingsResource = new Resource('ndpa/reports/clause-report')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.chart_report.series = response.series
          app.chart_report.xAxis.categories = response.categories
          app.chart_report.title.text = response.title
          app.chart_report.subtitle.text = response.subtitle
          app.load = false
          app.showChart = true
        }).catch(app.load = false)
    },
  },

}
</script>
