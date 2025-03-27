<template>
  <div class="app-container">
    <div class="box">
      <div class="box-header">
        <h4 class="box-title">
          Academic Performance Report
        </h4>
      </div>
      <div class="box-body">
        <aside>
          <el-row :gutter="5">
            <el-col
              :xs="24"
              :sm="12"
              :md="6"
            >
              <select
                v-model="level"
                class="form-control"
                @change="fetchClassTeachers()"
              >
                <option
                  value=""
                  disabled
                >
                  Select Level
                </option>
                <option
                  v-for="(each_level, index) in response_data.levels"
                  :key="index"
                  :value="each_level"
                >
                  {{ each_level.level }}
                </option>

              </select>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="6"
            >
              <el-select
                v-model="params.class_teacher_id"
                placeholder="Select Class"
                style="width: 100%"
                @change="loadChart()"
              >
                <el-option
                  v-for="(class_teacher, index) in class_teachers"
                  :key="index"
                  :label="class_teacher.c_class.name"
                  :value="class_teacher.id"
                />

              </el-select>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="6"
            >
              <el-select
                v-model="params.sess_id"
                placeholder="Select Academic Session"
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
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="6"
            >
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

            </el-col>
          </el-row>
        </aside>

        <el-row
          :gutter="0"
          class="panel-group"
        >
          <el-tabs
            style="margin-top:15px;"
            type="border-box"
          >
            <el-tab-pane label="Subject Performance Chart">

              <highcharts :options="subject_performance" />

            </el-tab-pane>
            <el-tab-pane label="Gender Performance Comparison">

              <highcharts :options="gender_performance" />

            </el-tab-pane>
          </el-tabs>
        </el-row>

      </div>

    </div>
  </div>

</template>
<script>

import Resource from '@/api/resource'

const chartDataFetch = new Resource('report/display-chart')
// const fetchClass = new Resource('level/subject/class')
const defaultTitleXAxis = 'Class Subjects'
const defaultTitleYAxis = 'Subject Average'
const drilldownTitleXAxis = 'Grades'
const drilldownTitleYAxis = 'Grade Count'
export default {

  // probs: [role],
  data() {
    return {
      level: '',
      class_teachers: [],
      response_data: {
        all_sessions: [],
        selected_session: '',
        sess_id: '',
        term_id: '',
        class_teacher_id: '',

        level: '',
        term_array: [],
        $levels: [],
        selected_classes: [],

      },

      show_subject_performance: true,
      show_gender_performance: true,

      subject_performance: {
        chart: {
          type: 'column',

          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25,
          },

          events: {
            drilldown() {
              this.xAxis[0].setTitle({ text: drilldownTitleXAxis })
              this.yAxis[0].setTitle({ text: drilldownTitleYAxis })
              // this.yAxis[0].setOptions({ max: undefined })
            },
            drillup() {
              this.xAxis[0].setTitle({ text: defaultTitleXAxis })
              this.yAxis[0].setTitle({ text: defaultTitleYAxis })
            },
          },

        },
        title: {
          text: '',
        },
        subtitle: {
          text: '',
        },
        xAxis: {
          // categories: [],
          type: 'category',
          labels: {
            skew3d: true,
            style: {
              fontSize: '14px',
            },
          },
          // min: 0,
          // max: 4,
          scrollbar: {
            enabled: true,
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 20,
          title: {
            text: 'Subject Average',
          },
        },
        series: [

        ],
        drilldown: {
          series: [],
        },
        // colors: ['#063', '#910000'],
        credits: {
          enabled: false,
        },
      },

      gender_performance: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25,
          },

        },
        title: {
          text: '',
        },
        subtitle: {
          text: '',
        },
        xAxis: {
          categories: [],
          // type: 'category',
          labels: {
            skew3d: true,
            style: {
              fontSize: '14px',
            },
          },
          // min: 0,
          // max: 2,
          scrollbar: {
            enabled: true,
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 10,
          title: {
            text: 'Subject Average',
          },
        },
        series: [

        ],

        // colors: ['#063', '#910000'],

        credits: {
          enabled: false,
        },
      },
      params: {
        term_id: '',
        sess_id: '',
        level_id: '',
        class_teacher_id: '',
        category: 'student_performance',
      },
    }
  },

  created() {
    // const { role } = this

    this.loadChart()
  },

  methods: {

    loadChart() {
      const app = this

      chartDataFetch.list(this.params)
        .then(response => {
          app.subject_performance.series = response.series
          app.subject_performance.subtitle.text = response.subtitle
          app.subject_performance.title.text = response.title
          app.subject_performance.drilldown.series = response.drilldown_series

          // gender performance
          app.gender_performance.xAxis.categories = response.gender_performance_categories
          app.gender_performance.series = response.gender_performance_series
          app.gender_performance.title.text = response.gender_performance_title
          app.gender_performance.subtitle.text = response.gender_performance_subtitle

          app.response_data = response
          if (app.params.term_id === app.params.sess_id === app.params.level_id === '') {
            app.params.term_id = response.term_id
            app.params.class_teacher_id = response.class_teacher_id
            app.params.sess_id = response.sess_id
            app.params.level_id = response.level_id
          }
          // app.getSubjectAndClass()
        })
        .catch(error => {
          console.log(error)
        })
    },

    fetchClassTeachers() {
      const app = this
      const { level } = app
      app.class_teachers = level.class_teachers
      app.params.class_teacher_id = ''// app.class_teachers[0].id;
      app.params.level_id = level.id
      // app.fetchSubjectTeachers();
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

  },

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
