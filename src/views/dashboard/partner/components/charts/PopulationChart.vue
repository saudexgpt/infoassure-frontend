<template>
  <div class="app-container">
    <!-- <el-row :gutter="10" class="panel-group">

      <el-col :xs="24" :sm="12" :md="6">
        <div class="info-box bg-aqua">
          <span class="info-box-icon"><i class="fa fa-male"></i></span>

          <div class="info-box-content">
            <span class="info-box-text"> Male Students</span>
            <span class="info-box-number"><count-to :start-val="0" :end-val="lgaPopulationDataArray[0]" :duration="2600" class="card-panel-num" /></span>
          </div>

        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="info-box bg-red">
          <span class="info-box-icon"><i class="fa fa-female"></i></span>

          <div class="info-box-content">
            <span class="info-box-text"> Female Students</span>
            <span class="info-box-number"><count-to :start-val="0" :end-val="lgaPopulationDataArray[1]" :duration="3000" class="card-panel-num" /></span>
          </div>

        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="info-box bg-green">
          <span class="info-box-icon"><svg-icon icon-class="peoples" class-name="card-panel-icon" /></span>

          <div class="info-box-content">
            <span class="info-box-text"> Total Male Staff</span>
            <span class="info-box-number"><count-to :start-val="0" :end-val="lgaPopulationDataArray[2]" :duration="3200" class="card-panel-num" /></span>
          </div>

        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="info-box bg-yellow">
          <span class="info-box-icon"><svg-icon icon-class="peoples" class-name="card-panel-icon" /></span>

          <div class="info-box-content">
            <span class="info-box-text"> Total Female Staff</span>
            <span class="info-box-number"><count-to :start-val="0" :end-val="lgaPopulationDataArray[3]" :duration="3600" class="card-panel-num" /></span>
          </div>

        </div>

      </el-col>
    </el-row> -->
    <div class="box">
      <div class="box-header">
        <h4 class="box-title">Population Report</h4>
      </div>
      <div class="box-body">

        <el-row :gutter="0" class="panel-group">
          <highcharts :options="population_analytics" />
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import CountTo from 'vue-count-to';
import Resource from '@/api/resource';
const populationDataFetch = new Resource('report/display-chart');
const stateLGA= new Resource('get-state-lga');
export default {
  components: {CountTo},
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      default: () => (''),
    },
  },
  watch: {
    $props: {
      handler() {
        this.loadChart();
      },
      deep: true,
      immediate: true,
    },
  },
  data(){
    return {
      population_analytics: {
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
          },
          title: {
            text: 'Schools'
          }
        },
        yAxis: {
          min: 0,
          max: undefined,
          tickInterval: 50,
          title: {
            text: 'Population'
          },
          stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: 'gray'
            }
          }
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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

        //colors: ['#063', '#910000'],
        credits: {
          enabled: false
        },
      },
      lgaPopulationDataArray: [],

    }

  },

  created()
  {
    let role = this.role;

    this.params.category = 'population';
    this.params.role = role;
    //this.loadChart();


  },

  methods: {
    // async loadChart()
    // {
    //   //this.handleCenterLoading();
    //   //this.loading = true;
    //   // let app = this;
    //   //axios.get('report/display-chart'+params)
    //   let loader = false;
    //   const { data } = await populationDataFetch.list(this.params, loader);

    //   //this.population_analytics.xAxis.categories = data.categories;

    //   this.population_analytics.series = data.series;
    //   this.population_analytics.subtitle.text = data.subtitle;
    //   this.population_analytics.title.text = data.title;



    // },
    loadChart:function(event) {

      let app = this;
      let loader = false;
      populationDataFetch.list(app.params, loader)
      .then(response => {
        //console.log(response);
        app.population_analytics.series = response.series;
        app.population_analytics.subtitle.text = response.subtitle;
        app.population_analytics.title.text = response.title;
        app.lgaPopulationDataArray = response.lgaPopulationDataArray;
      });





    },



  }

}



</script>
