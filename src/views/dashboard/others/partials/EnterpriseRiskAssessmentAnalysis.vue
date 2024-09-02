<template>
  <el-card
    style="min-height: 200px"
  >
    <div
      v-if="title !== ''"
      slot="header"
    >

      <h3>{{ title }}</h3>
    </div>
    <aside>
      <el-row :gutter="5">
        <el-col :md="12">
          <highcharts
            v-if="showChart"
            :options="chart_report"
          />
        </el-col>
        <el-col :md="6">
          <highcharts
            v-if="showChart"
            :options="riskSeverityChart"
          />
        <!-- <hr>
        <risk-ranking-matrix :matrix="matrix" /> -->
        </el-col>
        <el-col :md="6">
          <highcharts
            v-if="showChart"
            :options="controlEffectivenessChart"
          />
          <!-- <el-card>

            <div align="center">
              <h4>Average Compliance Rating</h4>
              <img
                :src="changeImpactImage(risk_level)"
              >
            </div>
            <p>
              Risk Score: <strong>{{ risk_score }}</strong><br>
              Risk Level: <strong>{{ risk_level }}</strong>
            </p>
          </el-card> -->
        </el-col>
      </el-row>
    </aside>
  </el-card>
</template>
<script>
import {
} from 'bootstrap-vue'
// import RiskRankingMatrix from '@/views/modules/RiskAndThreats/partials/RiskRankingMatrix.vue'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    module: {
      type: String,
      default: () => ('all'),
    },
    title: {
      type: String,
      default: () => (''),
    },
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          inverted: false,
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25,
          },
          // scrollablePlotArea: {
          //   minWidth: 900,
          //   scrollPositionX: 1,
          // },
          events: {
            drilldown(e) {
              this.setTitle({ text: 'Risk Severity by Business Process' }, { text: `Data showing risk analysis for ${e.point.name}` })
            },
            drillup() {
              this.setTitle({ text: 'Risk Severity by Business Unit' }, { text: 'Drilldown to view details for each Business Process' })
            },
          },
        },
        title: {
          text: 'Risk Severity by Business Unit',
        },
        subtitle: {
          text: 'Drilldown to view details for each Business Process',
        },
        xAxis: {
          type: 'category', // categories: [],
          labels: {
            skew3d: false,
            style: {
              fontSize: '14px',
            },
          },
          title: {
            text: 'Business Units',
          },
          min: 0,
          max: undefined,
          scrollbar: {
            enabled: false,
          },
        },
        yAxis: {
          min: 0,
          max: undefined,
          tickInterval: 5,
          title: {
            text: 'Risk Count',
          },
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: 'bold',
              color: 'gray',
            },
          },
        },
        plotOptions: {
          series: {
            // stacking: 'normal',
            dataLabels: {
              enabled: false,
              // rotation: 180,
            },
            // borderRadius: 7,
          },
        },
        colors: [],
        series: [],
        drilldown: {
          allowPointDrilldown: true,
          series: [],
        },

        // colors: ['#063', '#910000'],
        credits: {
          enabled: false,
        },
      },
      riskSeverityChart: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0,
          },
        },
        title: {
          text: 'Overall Risk Severity',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        tooltip: {
          // pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%',
          // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          point: {
            // valueSuffix: '%',
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
              // format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
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
      controlEffectivenessChart: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0,
          },
        },
        title: {
          text: 'Control Effectiveness',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        tooltip: {
          // pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%',
          // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          point: {
            // valueSuffix: '%',
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 50,
            innerSize: 100, // what makes it donut
            dataLabels: {
              enabled: false,
              // format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
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
      risk_level: '',
      risk_score: 0,
      load: false,
      showChart: false,
      matrix: '3x3',
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  watch: {
    selectedClient() {
      this.fetchReportSummary()
    },
  },
  mounted() {
    if (this.selectedClient.id !== null) {
      this.fetchReportSummary()
    }
  },
  methods: {
    changeImpactImage(str) {
      if (str) {
        return `images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return 'images/project-icons/no-impact-level.png'
    },
    fetchReportSummary() {
      const app = this
      app.load = true
      app.showChart = false
      const param = { client_id: app.selectedClient.id, module: app.module }
      const fetchConsultingsResource = new Resource('reports/process-risk-analysis')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.matrix = response.matrix
          app.chart_report.series = response.series
          // app.chart_report.xAxis.categories = response.categories
          // app.chart_report.subtitle.text = response.subtitle

          app.chart_report.drilldown.series = response.drilldown_series
          // app.chart_report.subtitle.text = response.subtitle
          // app.chart_report.title.text = response.title

          app.risk_level = response.risk_level
          app.risk_score = response.risk_score
          app.riskSeverityChart.series = response.severity_series
          app.controlEffectivenessChart.series = response.effectiveness_series
          app.load = false
          app.showChart = true
        }).catch(app.load = false)
    },
  },

}
</script>
