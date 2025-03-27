<template>
  <div>
    <el-skeleton
      :loading="loading"
      :rows="4"
      animated
    />
    <div v-if="!loading">
      <el-card>
        <div
          slot="header"
          class="clearfix"
        >
          <strong>Vendors By Category</strong>
        </div>
        <highcharts
          :options="highChart"
        />
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
      highChart: {
        chart: {
          type: 'bar',
          options3d: {
            enabled: false,
          },
        },
        title: {
          text: '',
          align: 'center',
        },
        subtitle: {
          text: '',
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
    }
  },
  mounted() {
    this.fetchVendorsRatings()
  },
  methods: {
    fetchVendorsRatings() {
      const app = this
      app.loading = true
      const fetchReportResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchReportResource.list({ chart_type: 'category' })
        .then(response => {
          app.highChart.series = response.vendor_categories_series
          app.highChart.xAxis.categories = response.vendor_categories
          app.loading = false
        }).catch(() => { app.loading = false })
    },
  },
}
</script>
