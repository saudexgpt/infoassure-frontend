<template>
  <div>
<<<<<<< HEAD
    <el-skeleton
      :loading="loading"
      :rows="4"
      animated
    />
=======
    <el-card>
      <el-skeleton
        :loading="loading"
        :rows="4"
        animated
      />
    </el-card>
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
    <div v-if="!loading">
      <el-card>
        <div
          slot="header"
          class="clearfix"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="Vendors By Inherent Risk Rating"
            placement="top-start"
          >
            <strong>Vendors By IRR <i class="el-icon-question" /></strong>
          </el-tooltip>
        </div>
<<<<<<< HEAD
        <highcharts
          :options="highChart"
        />
=======
        <apexchart
          v-if="series"
          :options="chartOptions"
          :series="series"
        />
        <el-empty v-else />
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
      </el-card>
    </div>
  </div>
</template>

<script>
import {
// BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      loading: false,
<<<<<<< HEAD
      highChart: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 0,
          },
        },
        title: {
          text: '',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%',
          // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          point: {
            // valueSuffix: '%',
          },
        },
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 8,
            innerSize: 150, // what makes it donut
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
              // format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            showInLegend: true,
          },
        },
        colors: ['#34db31', '#db9731', '#db3131'],
        series: [],
        credits: {
          enabled: false,
=======
      series: [],
      chartOptions: {
        chart: {
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            // offsetY: 10,
          },
        },
        colors: ['#28c76f', '#ff9f43', '#ea5455'],
        labels: ['Low', 'Medium', 'High'],
        legend: {
          position: 'bottom',
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
        },
      },
    }
  },
  mounted() {
    this.fetchVendorsRatings()
  },
  methods: {
    fetchVendorsRatings() {
      const app = this
      app.loading = true
<<<<<<< HEAD
      const fetchReportResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchReportResource.list({ chart_type: 'ratings' })
        .then(response => {
          app.highChart.series = response.series
=======
      const fetchStaffResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchStaffResource.list({ chart_type: 'ratings' })
        .then(response => {
          app.series = response.vendor_ratings_series
>>>>>>> e535cf9e54c24382d79f396c014e9034db20c8b6
          app.loading = false
        }).catch(() => { app.loading = false })
    },
  },
}
</script>
