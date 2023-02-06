<template>
  <b-card
    no-body
    class="card-revenue-budget"
  >
    <b-row class="mx-0">
      <b-col
        md="12"
        class="budget-wrapper"
      >
        <h4 class="card-title mb-50 mb-sm-0">
          Debtors Report Chart
        </h4>
        <hr>
        <div class="d-flex">
          <span>Make a selection</span>
        </div>
        <div class="d-flex">
          <el-select
            v-model="params.sess_id"
            placeholder="Select a Session"
            @input="loadDebtors()"
          >
            <el-option

              v-for="(session, index) in sessions"
              :key="index"
              :label="session.name"
              :value="session.id"
            />
          </el-select>
          <el-select
            v-model="params.term_id"
            placeholder="Select a Term"
            @input="loadDebtors()"
          >
            <el-option

              v-for="(term, index) in terms"
              :key="index"
              :label="term.name"
              :value="term.id"
            />
          </el-select>
        </div>
        <hr>
        <div class="d-sm-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <div class="d-flex align-items-center mr-1">
              <strong>{{ title }}</strong>
            </div>
          </div>
        </div>
        <!-- chart -->
        <vue-apex-charts
          id="revenue-report-chart"
          type="bar"
          :height="400"
          :options="debtReport.chartOptions"
          :series="debtReport.series"
        />
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import {
  BCard, BRow, BCol,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import Ripple from 'vue-ripple-directive'
// import EcommerceEarningsChart from '@/views/dashboard/ecommerce/EcommerceEarningsChart.vue'

import Resource from '@/api/resource'

export default {
  components: {
    VueApexCharts,
    BCard,
    BRow,
    BCol,
    // BButton,
    // EcommerceEarningsChart,
  },
  directives: {
    Ripple,
  },
  props: {
    sessions: {
      type: Array,
      required: true,
    },
    terms: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: '',
      params: {
        category: 'debtors',
        sess_id: '',

      },
      debtReport: {
        chartOptions: {
          chart: {
            stacked: false,
            type: 'bar',
            toolbar: { show: false },
          },
          grid: {
            padding: {
              top: 0,
              bottom: 0,
            },
            yaxis: {
              lines: { show: false },
            },
            xaxis: {
              lines: { show: true },
            },
          },
          xaxis: {
            type: 'category',
            labels: {
              style: {
                colors: '#6E6B7B',
                fontSize: '0.86rem',
                fontFamily: 'Montserrat',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
            },
          },
          legend: {
            show: true,
          },
          dataLabels: {
            enabled: true,
          },
          colors: [$themeColors.dark],
          plotOptions: {
            bar: {
              columnWidth: '30%',
              endingShape: 'rounded',
              // borderRadius: 0,
              horizontal: true,
            },
            distributed: true,
          },
          yaxis: {
            labels: {
              style: {
                colors: '#6E6B7B',
                fontSize: '0.86rem',
                fontFamily: 'Montserrat',
              },
            },
          },
        },
        series: [],
      },
      // debtReport: {
      //   chartOptions: {
      //     chart: {
      //       type: 'donut',
      //       toolbar: {
      //         show: false,
      //       },
      //     },
      //     dataLabels: {
      //       enabled: false,
      //     },
      //     legend: { show: true },
      //     // comparedResult: [2, -3, 8],
      //     labels: [],
      //     stroke: { width: 0 },
      //     // colors: [$themeColors.success, $themeColors.danger],
      //     grid: {
      //       padding: {
      //         right: -20,
      //         bottom: -8,
      //         left: -20,
      //       },
      //     },
      //     plotOptions: {
      //       pie: {
      //         // startAngle: -10,
      //         donut: {
      //           labels: {
      //             show: true,
      //             name: {
      //               show: true,
      //               offsetY: 15,
      //             },
      //             value: {
      //               offsetY: -15,
      //               formatter(val) {
      //                 // eslint-disable-next-line radix
      //                 return `₦${parseInt(val).toLocaleString()}`
      //               },
      //             },
      //             total: {
      //               show: true,
      //               offsetY: 15,
      //               label: 'Total',
      //               formatter(w) {
      //                 return `₦${w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString()}`
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   series: [0, 0],
      // },
      currency: '',
      load: false,
    }
  },
  created() {
    this.loadDebtors()
  },
  methods: {
    loadDebtors() {
      const app = this
      app.load = true

      const chartDataFetch = new Resource('report/display-chart')
      chartDataFetch.list(this.params).then(data => {
        app.debtReport.series = data.series
        // app.debtReport.chartOptions.labels = data.labels
        // app.debtReport.chartOptions = {
        //   ...app.debtReport.chartOptions,
        //   ...{
        //     labels: data.labels,
        //   },
        // }
        app.title = data.title
        app.currency = data.currency

        app.load = false
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
  },
}
</script>
