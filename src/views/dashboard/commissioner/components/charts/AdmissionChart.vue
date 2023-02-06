<template>
  <div class="app-container">
    <el-row :gutter="0" class="panel-group">
      <el-col :xs="24" :sm="12" :md="12" class="box-panel-col" style="background: #f0f0f0; padding: 5px;">
          <multiselect
            v-model="school"
            :options="params.lga.schools"
            label="name"
            value="id"
            track-by="id"
            :searchable="true"
            :close-on-select="true"
            placeholder="Select School"
            @input="showAdmissionChart()"

          />
          <!-- <el-select v-model="params.school_id" placeholder="Select School" class="span">
            <el-option v-for="(school, index) in schools" v-bind:value="school.id" :key="index" :label="school.name"/>

          </el-select> -->

      </el-col>
      <el-col :xs="24" :sm="12" :md="12" class="box-panel-col" style="background: #f0f0f0; padding: 5px;">

        <multiselect
          v-model="selected_session"
          :options="all_sessions"
          label="name"
          value="id"
          track-by="id"
          :searchable="true"
          :close-on-select="true"
          placeholder="Select Academic Session"
          @input="showAdmissionChart()"
        />
      </el-col>

    </el-row>
    <div class="box">
      <div class="box-header">
        <h4 class="box-title">Admission Report</h4>
      </div>
      <div class="box-body">

        <el-row :gutter="0" class="panel-group" v-if="!no_school">
          <highcharts :options="chart_analytics" />
        </el-row>
        <el-row :gutter="0" class="panel-group" v-else>
          <div class="callout callout-danger">No information to display since no school is registered under {{params.lga.name}}</div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect';
import Resource from '@/api/resource';
const chartDataFetch = new Resource('report/display-chart');
//const stateLGA= new Resource('get-state-lga');
export default {
  components: { Multiselect },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },

  },
  data(){
    return {
      all_sessions: [],
      selected_session: '',
      school: '',
      no_school: false,
      chart_param: {
        admission_sess_id: '',
        role: 'admin',//this is to fetch what school admins can see
        school_id: '',
        category :'admission'
      },

      chart_analytics: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          },
          scrollablePlotArea: {
            minWidth: 900,
            scrollPositionX: 1
          },
          events: {
            drilldown: function(e) {
              //console.log(e);
                //this.xAxis[0].setTitle({ text: drilldownTitleXAxis });
                //this.xAxis[0].setTitle({ text: 'Classes' });
                //this.setSubtitle({ text: e.point.name+' Attendance' });
                //this.xAxis.categories = ['Adult','Youth','Children', 'Total'];
                //this.xAxis[0].setCategories({ Category: ['Adult','Youth','Children', 'Total'] });
              // this.update({
              //     scrollbar: {
              //         enabled: true
              //     }
              // }, false);
            },
            drillup: function(e) {
              //console.log(e);
                //this.xAxis[0].setTitle({ text: 'Levels' });
                //this.yAxis[0].setTitle({ text: defaultTitleYAxis });
                //this.setSubtitle({ text: 'Click on a column to drill down and see attendance for each class' });
            }
          }
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',//categories: [],
          labels: {
            skew3d: true,
            style: {
              fontSize: '14px'
            }
          }
        },
        yAxis: {
          min: 0,
          max: undefined,
          tickInterval: 5,
          title: {
            text: 'No. of Students'
          },
          stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: 'gray'
            }
          }
        },
        plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              }
          }
        },
        series: [

        ],
        drilldown: {
          allowPointDrilldown: false,
          series: []
        },

        //colors: ['#063', '#910000'],
        credits: {
          enabled: false
        },
      },


    }

  },
  watch: {
    $props: {
      handler() {
        this.setChartParam();
      },
      deep: true,
      immediate: true,
    },
  },
  // created()
  // {

  //   this.loadChart();

  // },

  methods: {
    setChartParam()
    {
      let app = this;
      app.no_school = false;
      if (app.params.lga.schools.length > 0) {
        app.school = app.params.lga.schools[0];
        app.chart_param.school_id = app.school.id;
        app.loadChart();
      }else{
        app.no_school = true;
      }

    },
    async loadChart()
    {
      //this.handleCenterLoading();
      //this.loading = true;
      let app = this;
      //axios.get('report/display-chart'+params)
      let loader = false;
      const { data } = await chartDataFetch.list(app.chart_param, loader);

      //this.chart_analytics.xAxis.categories = data.categories;

      app.chart_analytics.series = data.series;
      app.chart_analytics.drilldown.series = data.drilldown_series;
      app.chart_analytics.subtitle.text = data.subtitle;
      app.chart_analytics.title.text = data.title;

      app.selected_session = data.selected_session;
      app.all_sessions = data.all_sessions;
      //this.admission_sess_id = data.admission_sess_id;

    },


    showAdmissionChart() {
      var admission_sess_id = this.selected_session.id;
      var role = this.role;
    	//alert(admission_sess_id);
	    var category = 'admission';
	    //var params = '?category='+category+"&admission_sess_id="+admission_sess_id+'&role='+role;
      this.chart_param.category = category;
      this.chart_param.admission_sess_id = admission_sess_id;
      this.chart_param.school_id = this.school.id;
      this.loadChart();
	    //window.location = toUrl;

	  }


  }

}



</script>
