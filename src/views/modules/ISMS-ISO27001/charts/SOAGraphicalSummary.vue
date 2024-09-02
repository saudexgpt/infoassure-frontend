<template>
  <aside>
    <highcharts
      v-loading="loading"
      :options="chart_report"
    />
  </aside>
</template>
<script>

export default {
  components: {
  },
  props: {
    summary: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      chart_report: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false,
          },
        },
        title: {
          text: 'SOA Summary',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        plotOptions: {
          // column: {
          //   stacking: 'normal',
          // },
        },
        xAxis: {
          categories: [],
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          // max: 100,
          title: {
            text: 'Scale',
          },
        },
        series: [],
        credits: {
          enabled: false,
        },
      },
    }
  },
  watch: {
    summary() {
      this.setData()
    },
  },
  created() {
    this.setData()
  },
  methods: {
    setData() {
      const app = this
      app.chart_report.series = app.summary.series
      app.chart_report.xAxis.categories = app.summary.categories
      app.chart_report.subtitle.text = app.summary.subtitle
    },
  },

}
</script>
