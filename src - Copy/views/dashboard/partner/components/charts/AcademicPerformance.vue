<template>
  <div class="app-container">
    <aside>
      <el-row :gutter="5">
        <el-col :xs="24" :sm="24" :md="24" class="box-panel-col" style="background: #f0f0f0; padding: 5px;">
          <multiselect
            v-model="school"
            :options="params.lga.schools"
            label="name"
            value="id"
            track-by="id"
            :searchable="true"
            :close-on-select="true"
            placeholder="Select School"
            @input="setSchool()"
          />
          <!-- <el-select v-model="params.school_id" placeholder="Select School" class="span">
            <el-option v-for="(school, index) in schools" v-bind:value="school.id" :key="index" :label="school.name"/>

          </el-select> -->

        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <!-- <p>Session</p> -->

          <select class="form-control" v-model="chart_param.sess_id" @change="loadChart()">
            <option value="" disabled="disabled">Select Session</option>

            <option v-for="(all_session, index) in response_data.all_sessions" v-bind:value="all_session.id" :key="index">{{all_session.name}}</option>
          </select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <!-- <p>Term</p> -->
          <select class="form-control" v-model="chart_param.term_id" @change="loadChart()">
            <option value="" disabled="disabled">Select Term</option>

            <option v-for="(select_term_name, index) in response_data.term_array" v-bind:value="index" :key="index">{{select_term_name}}</option>
          </select>

        </el-col>
        <el-col :xs="24" :sm="12" :md="6">

          <select v-model="level" placeholder="Select Level" @change="fetchClassTeachers" class="form-control">
            <option value='' disabled="disabled">Select Level</option>
            <option v-for="(level, index) in response_data.levels" v-bind:value="level" :key="index">{{level.level}}</option>

          </select>

        </el-col>
        <el-col :xs="24" :sm="12" :md="6">

          <select v-model="chart_param.class_teacher_id" class="form-control" @change="loadChart()">
            <option value="" disabled="disabled">Select Class</option>
            <option v-for="(class_teacher, index) in class_teachers" v-bind:value="class_teacher.id" :key="index">{{class_teacher.c_class.name}}</option>

          </select>
        </el-col>

      </el-row>
    </aside>
    <div class="box">
      <div class="box-header"><h4 class="box-title">Academic Performance Report</h4></div>
      <div class="box-body">
        <el-row :gutter="0" class="panel-group" v-if="!no_school">
            <el-tabs  style="margin-top:15px;" type="border-box">
            <el-tab-pane  label="Subject Performance Chart">

                <highcharts :options="subject_performance"></highcharts>

            </el-tab-pane>
            <el-tab-pane  label="Gender Performance Comparison">

                <highcharts :options="gender_performance"></highcharts>

            </el-tab-pane>
            </el-tabs>
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
const fetchClass = new Resource('level/subject/class');
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
      no_school: false,
      school: '',
      level: '',
      class_teachers:[],
      chart_param: {
        term_id: '',
        class_teacher_id : '',
        sess_id : '',
        level_id : '',
        role: 'admin',//this is to fetch what school admins can see
        school_id: '',
        category :'student_performance'
      },
      response_data: {
        all_sessions: [],
        selected_session: '',
        sess_id: '',
        term_id: '',
        class_teacher_id: '',

        level_id: '',
        term_array: [],
        $levels: [],
        selected_classes: [],

      },

      show_subject_performance: true,
      show_gender_performance: true,



      subject_performance: {
        chart: {
          type: 'bar',

          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          },


          events: {
            drilldown: function(e) {
                //this.xAxis[0].setTitle({ text: drilldownTitleXAxis });
                //this.yAxis[0].setTitle({ text: drilldownTitleYAxis });
                //this.xAxis.categories = ['Adult','Youth','Children', 'Total'];
                //this.xAxis[0].setCategories({ Category: ['Adult','Youth','Children', 'Total'] });
            },
            drillup: function(e) {
                //this.xAxis[0].setTitle({ text: defaultTitleXAxis });
                //this.yAxis[0].setTitle({ text: defaultTitleYAxis });
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
          //categories: [],
          type: 'category',
          labels: {
            skew3d: true,
            style: {
              fontSize: '14px'
            }
          },
          min: 0,
          max: 4,
          scrollbar: {
            enabled: true
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 10,
          title: {
            text: 'Subject Average'
          }
        },
        series: [

        ],
        drilldown: {
          series: []
        },
        //colors: ['#063', '#910000'],
        credits: {
          enabled: false
        },
      },

      gender_performance: {
        chart: {
          type: 'bar',
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          },


        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: [],
          //type: 'category',
          labels: {
            skew3d: true,
            style: {
              fontSize: '14px'
            }
          },
          min: 0,
          max: 2,
          scrollbar: {
            enabled: true
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 10,
          title: {
            text: 'Subject Average'
          }
        },
        series: [

        ],

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
      deep: false,
      immediate: true,
    },
  },
  // created: function()
  // {
  //   let role = this.role;



  //   this.loadChart();

  // },

  methods: {
    setChartParam()
    {
      let app = this;

      app.no_school = false;
      if (app.params.lga.schools.length > 0) {
        if (app.school == '') {
          app.school = app.params.lga.schools[0];
          app.chart_param.school_id = app.school.id;
          app.loadChart();
        }


      }else{
        app.no_school = true;
      }

    },

    loadChart()
    {
      let app = this;
      let loader = false;
      chartDataFetch.list(app.chart_param, loader)
      .then(response => {
        app.subject_performance.series = response.data.series;
        app.subject_performance.subtitle.text = response.data.subtitle;
        app.subject_performance.title.text = response.data.title;
        app.subject_performance.drilldown.series = response.data.drilldown_series;

        //gender performance
        app.gender_performance.xAxis.categories = response.data.gender_performance_categories;
        app.gender_performance.series = response.data.gender_performance_series;
        app.gender_performance.title.text = response.data.gender_performance_title;
        app.gender_performance.subtitle.text = response.data.gender_performance_subtitle;

        app.response_data = response.data;

        app.chart_param.term_id = response.data.term_id;
        app.chart_param.class_teacher_id = response.data.class_teacher_id;
        app.chart_param.sess_id = response.data.sess_id;
        //app.chart_param.level_id = response.data.level.id;
        //app.level = response.data.level;
        //app.getSubjectAndClass();
      })
      .catch(error => {
        console.log(error);
      });





    },

    setSchool()
    {
      let app = this;
      app.chart_param.school_id = app.school.id;
      app.chart_param.level_id = app.level.id;
      app.loadChart();
    },

    fetchClassTeachers()
    {
      let app = this;
      let level = app.level;
      app.class_teachers = level.class_teachers;
      app.chart_param.class_teacher_id = '';//app.class_teachers[0].id;
      app.chart_param.level_id = level.id;

    },

    //  getSubjectAndClass:function(event) {

    //   let app = this;
    //   let param = { level_id: app.params.level_id};
    //   let loader = false;
    //   if (app.params.level_id != '') {
    //     fetchClass.list(param, loader)
    //     .then(response => {
    //       //console.log(response);
    //       app.response_data.selected_classes = response.class;
    //       //this.response_data.class_teacher_id = '';
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });



    //   }

    // },


  }

}



</script>
<style>
.form-control {
  border-radius: 4px;
  box-shadow: none;
  border-color: #d2d6de;
  width: 100%;
  min-height: 35px;
}
</style>
