<template>
  <b-row class="mx-0">
    <b-col
      md="12"
      class="budget-wrapper"
    >

      <h4 class="card-title mb-50 mb-sm-0">
        Revenue Report
      </h4>
      <hr>
      <div class="d-flex">
        <span>Pick Session</span>
      </div>
      <div class="d-flex">
        <el-select
          v-model="params.sess_id"
          placeholder="Select a Session"
          @input="loadChart()"
        >
          <el-option

            v-for="(session, index) in sessions"
            :key="index"
            :label="session.name"
            :value="session.id"
          />
        </el-select>
      </div>
    </b-col>
    <b-col
      md="6"
      class="budget-wrapper"
    >
      <div class="d-sm-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center mr-1">
            <span>Termly Report</span>
          </div>
        </div>
      </div>

      <!-- chart -->
      <vue-apex-charts
        id="revenue-report-chart"
        type="bar"
        :height="350"
        :options="revenueReport.chartOptions"
        :series="revenueReport.series"
      />
      <!-- <hr>
        <div class="d-flex">
          <span>Total Income:</span>
          <span class="font-weight-bolder mr-25">&nbsp;{{ currency + total_income.toLocaleString() }}</span>
        </div>
        <div class="d-flex ">
          <span>Total Expenditure:</span>
          <span class="font-weight-bolder mr-25">&nbsp;{{ currency + total_expenses.toLocaleString() }}</span>
        </div>
        <hr>
        <div class="d-flex ">
          <h2
            v-if="profit >= 0"
            class="mb-25"
          >
            Profit: {{ currency + profit.toLocaleString() }}
          </h2>
          <h2
            v-else
            class="mb-25"
          >
            Loses: {{ currency + parseFloat(profit).toLocaleString() }}
          </h2>
        </div> -->
    </b-col>
    <b-col
      md="6"
      class="budget-wrapper"
    >
      <vue-apex-charts
        :options="earningsChart.chartOptions"
        :series="earningsChart.series"
      />
    </b-col>
  </b-row>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import Ripple from 'vue-ripple-directive'
// import EcommerceEarningsChart from '@/views/dashboard/ecommerce/EcommerceEarningsChart.vue'

import Resource from '@/api/resource'

export default {
  components: {
    VueApexCharts,
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
  },
  data() {
    return {
      params: {
        category: 'finance',
        sess_id: '',

      },
      revenueReport: {
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
              lines: { show: true },
            },
          },
          xaxis: {
            categories: ['1st', '2nd', '3rd'],
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
            enabled: false,
          },
          colors: [$themeColors.success, $themeColors.danger],
          plotOptions: {
            bar: {
              columnWidth: '17%',
              endingShape: 'rounded',
              // borderRadius: 5,
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
        series: [{
          name: 'Income',
          data: [0, 0, 0],
        },
        {
          name: 'Expenditure',
          data: [0, 0, 0],
        }],
      },
      earningsChart: {
        chartOptions: {
          chart: {
            type: 'donut',
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: true,
          },
          legend: {
            show: true,
            formatter(val, opts) {
              return `${val}: ₦${opts.w.globals.series[opts.seriesIndex].toLocaleString()}`
            },
          },
          // comparedResult: [2, -3, 8],
          labels: ['Income', 'Expenditure'],
          stroke: { width: 0 },
          colors: [$themeColors.success, $themeColors.danger],
          grid: {
            padding: {
              right: -20,
              bottom: -8,
              left: -20,
            },
          },
          plotOptions: {
            pie: {
              startAngle: 0,
              donut: {
                labels: {
                  show: true,
                  name: {
                    show: true,
                    offsetY: 15,
                  },
                  value: {
                    offsetY: -15,
                    formatter(val) {
                      // eslint-disable-next-line radix
                      return `₦${parseInt(val).toLocaleString()}`
                    },
                  },
                  total: {
                    show: true,
                    offsetY: 15,
                    label: 'Profit',
                    formatter(w) {
                      return `₦${(w.globals.seriesTotals.reduce((a, b) => b - a, 0) * -1).toLocaleString()}`
                    },
                  },
                },
              },
            },
          },
        },
        series: [0, 0],
      },

      profit: 0,
      total_income: 0,
      total_expenses: 0,
      currency: '',
      load: false,
    }
  },
  created() {
    this.params.sess_id = this.sessions[0].id
    this.loadChart()
  },
  methods: {
    loadChart() {
      const app = this
      app.load = true

      const chartDataFetch = new Resource('report/display-chart')
      chartDataFetch.list(this.params).then(data => {
        app.revenueReport.series = data.bar_chart_series
        app.earningsChart.series = data.pie_chart_series
        app.profit = data.profit
        app.total_income = data.total_income
        app.total_expenses = data.total_expenses
        app.currency = data.currency

        app.load = false
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
    loadDebtors() {
      const app = this
      app.load = true

      const chartDataFetch = new Resource('report/display-chart')
      chartDataFetch.list(this.params).then(data => {
        app.revenueReport.series = data.bar_chart_series
        app.earningsChart.series = data.pie_chart_series
        app.profit = data.profit
        app.total_income = data.total_income
        app.total_expenses = data.total_expenses
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
