<template>
  <div class="box">
    <div class="box-body">
      <el-row
        :gutter="10"
        class="panel-group"
      >
        <el-col :md="12">
          <aside>
            <highcharts
              :options="column_chart_analytics"
            />
          </aside>
        </el-col>
        <el-col :md="12">

          <highcharts
            :options="pie_chart_analytics"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  // components: { Multiselect },
  props: {
    columnChartData: {
      type: Array,
      default: () => ([]),
    },
    pieChartData: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      column_chart_analytics: {
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
          events: {
          },
        },
        title: {
          text: '',
        },
        subtitle: {
          text: '',
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
            text: '',
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
          tickInterval: 2,
          title: {
            text: 'No. of Risks',
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
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
              // rotation: 180,
            },
            // borderRadius: 7,
          },
        },
        series: [],
        drilldown: {
          allowPointDrilldown: false,
          series: [],
        },

        // colors: ['#063', '#910000'],
        credits: {
          enabled: false,
        },
      },
      pie_chart_analytics: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: 'Control Effectiveness',
          align: 'left',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
            dataLabels: {
              enabled: true,
            },
            showInLegend: true,
          },
        },
        series: [],
      },
    }
  },

  created() {
    this.setData()
  },

  methods: {
    setData() {
      const app = this
      app.column_chart_analytics.series = app.columnChartData
      app.pie_chart_analytics.series = app.pieChartData
    },

  },

}

</script>
