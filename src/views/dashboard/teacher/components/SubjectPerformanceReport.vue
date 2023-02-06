<template>
  <b-card
    v-loading="load"
    no-body
    class="card-revenue-budget"
  >
    <b-row
      v-if="series.length > 0"
      class="mx-0"
    >

      <b-col
        md="12"
        class="revenue-report-wrapper"
      >
        <strong>Make Selection</strong>
        <el-select
          v-model="params.sess_id"
          placeholder="Select Session"
          style="width: 100%"
          @change="loadChart()"
        >
          <el-option
            v-for="(all_session, index) in response_data.all_sessions"
            :key="index"
            :value="all_session.id"
            :label="all_session.name"
          />
        </el-select>
        <hr>
        <el-select
          v-model="params.term_id"
          placeholder="Select Term"
          style="width: 100%"
          @change="loadChart()"
        >
          <el-option
            v-for="(select_term_name, index) in response_data.term_array"
            :key="index"
            :value="index"
            :label="select_term_name"
          />
        </el-select>

        <!-- <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          @change="loadChart()"
        >
          View Performance
        </b-button> -->
      </b-col>
      <b-col
        md="12"
        class="revenue-report-wrapper"
      >
        <div align="center">
          <h4 class="card-title mb-0 mb-sm-0">
            My Students' Average Subject Performance
          </h4>
          <strong>[{{ response_data.selected_session }}, {{ response_data.selected_term }} Term]</strong>
        </div>

        <!-- chart -->
        <div>
          <vue-apex-charts
            id="revenue-report-chart"
            type="bar"
            height="250"
            :options="chartOptions"
            :series="series"
          />
        </div>
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
import Resource from '@/api/resource'

export default {
  components: {
    VueApexCharts,
    BCard,
    // BButton,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      revenue_report: {},
      chartOptions: {
        chart: {
          stacked: true,
          type: 'bar',
          toolbar: { show: false },
        },
        grid: {
          padding: {
            top: -20,
            bottom: -10,
          },
          yaxis: {
            lines: { show: false },
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
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        legend: {
          show: true,
        },
        dataLabels: {
          enabled: true,
        },
        colors: [$themeColors.primary, $themeColors.warning],
        plotOptions: {
          bar: {
            columnWidth: '17%',
            endingShape: 'rounded',
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
      // budget chart
      // budgetChart: {
      //   options: {
      //     chart: {
      //       height: 80,
      //       toolbar: { show: false },
      //       zoom: { enabled: false },
      //       type: 'line',
      //       sparkline: { enabled: true },
      //     },
      //     stroke: {
      //       curve: 'smooth',
      //       dashArray: [0, 5],
      //       width: [2],
      //     },
      //     colors: [$themeColors.primary, '#dcdae3'],
      //     tooltip: {
      //       enabled: false,
      //     },
      //   },
      // },
      response_data: {
        all_sessions: [],
        selected_session: '',
        selected_term: '',
        sess_id: '',
        term_id: '',
        class_teacher_id: '',

        level: '',
        term_array: [],
        $levels: [],
        selected_classes: [],

      },
      params: {
        term_id: '',
        sess_id: '',
        category: 'teacher_subject_performance',
      },
      series: [],
      load: false,
    }
  },
  created() {
    this.loadChart()
  },
  methods: {
    loadChart() {
      const app = this
      app.load = true
      app.chartOptions.xaxis.categories = []

      const chartDataFetch = new Resource('report/display-chart')
      chartDataFetch.list(this.params)
        .then(response => {
          app.series = response.series
          // app.chartOptions.xaxis.categories = response.subject_names
          // app.getSubjectAndClass()
          app.response_data = response
          if (app.params.term_id === app.params.sess_id === '') {
            app.params.term_id = response.term_id
            app.params.sess_id = response.sess_id
          }
          app.load = false
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },
  },
}
</script>
