<template>
  <el-card>
    <!-- <div
      slot="header"
      class="clearfix"
    >
      <strong>Risk Score Count by Requirements</strong>
    </div> -->
    <div v-if="loadingAnalysis">

      <el-skeleton
        :loading="loadingAnalysis"
        :rows="7"
        animated
      />
    </div>
    <div v-else>
      <highcharts
        v-if="categories_count > 0"
        :options="riskAssessmentReportChart"
      />
      <el-empty
        v-else
        :description="`No Data Found for ${selectedVendor.name}`"
      />
    </div>
  </el-card>
</template>

<script>
import {
// BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedVendor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      loadingAnalysis: false,
      categories_count: 0,
      vendors: [],
      riskAssessmentReportChart: {
        chart: {
          type: 'bar',
          options3d: {
            enabled: true,
          },
        },
        title: {
          text: 'Risk Score Count by Requirements',
          align: 'center',
        },
        subtitle: {
          text: '',
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            borderRadius: 5,
            dataLabels: {
              enabled: true,
            },
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
            enabled: false,
          },
        },
        colors: ['green', 'yellow', 'red'],
        series: [],
        credits: {
          enabled: false,
        },
      },
    }
  },
  watch: {
    selectedVendor() {
      this.loadResources()
    },
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    loadResources() {
      const app = this
      app.fetchRiskAssessmentAnalysis()
    },
    fetchRiskAssessmentAnalysis() {
      const app = this
      app.loadingAnalysis = true
      const fetchRAResource = new Resource('vdd/reports/vendor-risk-assessment-analysis')
      fetchRAResource.list({ vendor_id: app.selectedVendor.id })
        .then(response => {
          app.riskAssessmentReportChart.series = response.series
          app.riskAssessmentReportChart.xAxis.categories = response.risk_categories
          app.riskAssessmentReportChart.subtitle.text = app.selectedVendor.name
          app.categories_count = response.risk_categories.length
          app.loadingAnalysis = false
        }).catch(() => { app.loadingAnalysis = false })
    },
    // fetchEnterpriseRiskScore() {
    //   const app = this
    //   app.loadingAnalysis = true
    //   const fetchRAResource = new Resource('vdd/reports/enterprise-risk-score')
    //   fetchRAResource.list({ vendor_id: app.selectedVendor.id })
    //     .then(response => {
    //       console.log(response)
    //       app.loadingAnalysis = false
    //     }).catch(() => { app.loadingAnalysis = false })
    // },
  },
}
</script>
