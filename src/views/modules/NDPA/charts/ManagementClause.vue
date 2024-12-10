<template>
  <aside
    style="min-height: 200px"
  >
    <el-skeleton
      :loading="load"
      :rows="6"
      animated
    />
    <el-row :gutter="20">
      <el-col :md="12">
        <label for="">View By</label>
        <el-select
          v-model="group_by"
          placeholder="View by"
          style="width: 100%"
          @change="setViewBy"
        >
          <el-option
            value="clause_id"
            label="Parts"
          />
          <el-option
            value="section_id"
            label="Sections"
          />
        </el-select>
      </el-col>
      <el-col
        v-if="group_by === 'section_id'"
        :md="12"
      >
        <label for="">Select Part</label>
        <el-select
          v-model="clause_id"
          placeholder="Select Part"
          style="width: 100%"
          @change="fetchReportSummary"
        >
          <el-option
            v-for="(clause, index) in clauses"
            :key="index"
            :value="clause.id"
            :label="`${clause.name} - ${clause.description}`"
          />
        </el-select>
      </el-col>
    </el-row>
    <div
      v-if="showChart"
    >
      <highcharts
        :options="chart_report"
      />
    </div>
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
  },
  mounted() {
    this.fetchReportSummary()
    this.fetchClauses()
  },
  methods: {
    setViewBy() {
      const app = this
      if (app.group_by === 'clause_id') {
        app.clause_id = ''
        app.fetchReportSummary()
      }
    },
    fetchClauses() {
      const app = this
      const fetchClausesResource = new Resource('ndpa/clauses')
      fetchClausesResource.list(this.query)
        .then(response => {
          app.clauses = response.clauses
        })
    },
    fetchReportSummary() {
      const app = this
      app.load = true
      app.showChart = false
      const param = {
        project_id: app.selectedProject.id, client_id: app.selectedClient.id, group_by: app.group_by, clause_id: app.clause_id,
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
