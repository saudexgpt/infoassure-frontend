<template>
  <div class="app-container">
    <div class="box">
      <div class="box-header">
        <h4 class="box-title">
          Admission Report
        </h4>
      </div>
      <div class="box-body">
        <el-row
          :gutter="0"
          class="panel-group"
        >
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
            class="box-panel-col"
          >
            <el-select
              v-model="params.admission_sess_id"
              filterable
              placeholder="Select Academic Session"
              style="width: 100%"
              @input="loadChart()"
            >
              <el-option
                v-for="(session, index) in all_sessions"
                :key="index"
                :label="session.name"
                :value="session.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row
          v-loading="load"
          :gutter="0"
          class="panel-group"
        >
          <highcharts
            height="650px"
            :options="chart_analytics"
          />
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
// import Multiselect from 'vue-multiselect'
import { $themeColors } from '@themeConfig'
import Resource from '@/api/resource'

const chartDataFetch = new Resource('report/display-chart')
export default {
  // components: { Multiselect },
  props: {
    role: {
      type: String,
      default: () => (''),
    },
  },
  data() {
    return {
      all_sessions: [],
      selected_session: '',
      admission_sess_id: '',

      chart_analytics: {
        chart: {
          type: 'column',
          inverted: false,
          height: 600,
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
            // drilldown(e) {
            //   // console.log(e);
            //   // this.xAxis[0].setTitle({ text: drilldownTitleXAxis });
            //   // this.xAxis[0].setTitle({ text: 'Classes' });
            //   // this.setSubtitle({ text: e.point.name+' Attendance' });
            //   // this.xAxis.categories = ['Adult','Youth','Children', 'Total'];
            //   // this.xAxis[0].setCategories({ Category: ['Adult','Youth','Children', 'Total'] });
            //   // this.update({
            //   //     scrollbar: {
            //   //         enabled: true
            //   //     }
            //   // }, false);
            // },
            // drillup(e) {
            //   // console.log(e);
            //   // this.xAxis[0].setTitle({ text: 'Levels' });
            //   // this.yAxis[0].setTitle({ text: defaultTitleYAxis });
            //   // this.setSubtitle({ text: 'Click on a column to drill down and see attendance for each class' });
            // },
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
            text: 'Levels',
          },
          min: 0,
          max: undefined,
          scrollbar: {
            enabled: true,
          },
        },
        yAxis: {
          min: 0,
          max: undefined,
          tickInterval: 5,
          title: {
            text: 'No. of Students',
          },
          stackLabels: {
            enabled: true,
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
              enabled: true,
              // rotation: 180,
            },
            // borderRadius: 7,
          },
        },
        colors: [$themeColors.primary, $themeColors.danger],
        series: [

        ],
        drilldown: {
          allowPointDrilldown: false,
          series: [],
        },

        // colors: ['#063', '#910000'],
        credits: {
          enabled: false,
        },
      },

      params: {
        category: 'population',
        role: this.role,
        admission_sess_id: '',

      },
      load: false,
    }
  },

  created() {
    const { role } = this

    this.params.category = 'admission'
    this.params.role = role
    this.loadChart()
  },

  methods: {
    loadChart() {
      // this.handleCenterLoading();
      // this.loading = true;
      const app = this
      // axios.get('report/display-chart'+params)
      app.load = true
      chartDataFetch.list(this.params).then(data => {
        // this.chart_analytics.xAxis.categories = data.categories;
        app.chart_analytics.series = data.series
        app.chart_analytics.drilldown.series = data.drilldown_series
        app.chart_analytics.subtitle.text = data.subtitle
        app.chart_analytics.title.text = data.title

        app.selected_session = data.selected_session
        app.all_sessions = data.all_sessions
        app.admission_sess_id = data.admission_sess_id

        app.load = false
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },

    // showAdmissionChart() {
    //   this.admission_sess_id = this.selected_session.id
    //   const { admission_sess_id } = this
    //   const { role } = this
    // // alert(admission_sess_id);
    //   const category = 'admission'
    //   // var params = '?category='+category+"&admission_sess_id="+admission_sess_id+'&role='+role;
    //   this.params.category = category
    //   this.params.admission_sess_id = admission_sess_id
    //   this.params.role = role
    //   this.loadChart()
    //   // window.location = toUrl;
    // },

  },

}

</script>
