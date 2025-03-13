<template>
  <div>
    <el-card>
      <el-skeleton
        :loading="loading"
        :rows="4"
        animated
      />
    </el-card>
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
        <apexchart
          v-if="series"
          :options="chartOptions"
          :series="series"
        />
        <el-empty v-else />
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
      const fetchStaffResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchStaffResource.list({ chart_type: 'ratings' })
        .then(response => {
          app.series = response.vendor_ratings_series
          app.loading = false
        }).catch(() => { app.loading = false })
    },
  },
}
</script>
