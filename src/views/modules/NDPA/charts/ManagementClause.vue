<template>
  <div style="min-height: 200px">
    <el-skeleton :loading="load" :rows="6" animated />
    <div v-if="showChart">
      <highcharts :options="chart_report" />
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    },
    selectedProject: {
      type: Object,
      default: () => null
    },
    filterBy: {
      type: Object,
      default: () => ({
        group_by: 'clause_id',
        clause_id: '',
        assignee_id: '',
        date: ''
      })
    }
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false
          }
        },
        title: {
          text: 'Compliance by Requirement',
          align: 'center'
        },
        subtitle: {
          text: 'Level of Conformity for each part of the NDPA Requirement'
        },
        plotOptions: {
          series: {
            // borderRadius: '1%',
          },
          column: {
            // stacking: 'normal',
          }
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Scale'
          },
          stackLabels: {
            enabled: true
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      },
      projectId: null,
      load: false,
      showChart: false,
      group_by: 'clause_id',
      clauses: [],
      clause_id: ''
    }
  },
  watch: {
    selectedProject() {
      this.fetchReportSummary()
    },
    filterBy() {
      this.fetchReportSummary()
    }
  },
  mounted() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      this.load = true
      this.showChart = false
      const param = {
        project_id: this.selectedProject.id,
        client_id: this.selectedClient.id,
        group_by: this.filterBy.group_by,
        clause_id: this.filterBy.clause_id,
        assignee_id: this.filterBy.assignee_id,
        date: this.filterBy.date
      }
      const fetchConsultingsResource = new Resource('ndpa/reports/clause-report')
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          this.chart_report.series = response.series
          this.chart_report.xAxis.categories = response.categories
          this.chart_report.title.text = response.title
          this.chart_report.subtitle.text = response.subtitle
          this.load = false
          this.showChart = true
        })
        .catch((this.load = false))
    }
  }
}
</script>
