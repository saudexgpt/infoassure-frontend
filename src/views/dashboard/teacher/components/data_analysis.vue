<template>
  <div v-if="staff">
    <b-row
      class="match-height"
      :gutter="10"
    >
      <b-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <analytics-congratulation
          :data="staff.user"
        />
        <b-row
          class="match-height"
          :gutter="10"
        >
          <b-col
            :xs="12"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <router-link :to="{ name: 'TeacherClasses'}">
              <statistic-card-horizontal
                color="warning"
                icon="UsersIcon"
                :statistic="class_teachers.length"
                statistic-title="No. of Class(es)"
              />
            </router-link>
          </b-col>
          <b-col
            :xs="12"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <router-link :to="{ name: 'TeacherSubjects'}">
              <statistic-card-horizontal
                color="primary"
                icon="BookIcon"
                :statistic="subject_teachers.length"
                statistic-title="No. of Subject(s)"
              />
            </router-link>
          </b-col></b-row>
      </b-col>
      <b-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <subject-performance-report />
      </b-col>
    </b-row>
    <b-row
      class="match-height"
      :gutter="5"
    >
      <b-col
        :lg="6"
        :xl="6"
        :md="6"
        :sm="6"
        :xs="12"
      >
        <!-- <el-card>
          <div slot="header">
            <h4>My Subjects</h4>
          </div>

          <v-client-table
            v-model="subject_teachers"
            :columns="columns"
            :options="options"
          >
            <div
              slot="sn"
              slot-scope="props"
            >
              {{ props.index }}
            </div>
            <div
              slot="subject.name"
              slot-scope="props"
            >
              {{ props.row.subject.name + ' (' + props.row.class_teacher.c_class.name + ')' }}
            </div>
          </v-client-table>
        </el-card> -->
        <teacher-routine view-type="time-table" />
      </b-col>
      <b-col
        :lg="6"
        :xl="6"
        :md="6"
        :sm="6"
        :xs="12"
      >
        <timeline />
      </b-col>
      <!-- <highcharts :options="chart_analytics" /> -->
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
// import StatisticCardWithAreaChart from '@core/components/statistics-cards/StatisticCardWithAreaChart.vue'
import AnalyticsCongratulation from '@/views/dashboard/analytics/AnalyticsCongratulation.vue'
import Resource from '@/api/resource'
import TeacherRoutine from '@/views/modules/time-table/TeacherRoutine.vue'
import Timeline from '@/views/modules/user/Timeline.vue'

import SubjectPerformanceReport from './SubjectPerformanceReport.vue'

const sessionalStaffPerformance = new Resource('teacher/sessional-staff-performance')
const dataAnalysisResource = new Resource('dashboard/teacher')

export default {
  components: {
    BRow, BCol, StatisticCardHorizontal, SubjectPerformanceReport, AnalyticsCongratulation, TeacherRoutine, Timeline,
  },
  data() {
    return {

      // chart_analytics: {
      //   chart: {
      //     type: 'column',
      //     options3d: {
      //       enabled: false,
      //       alpha: 0,
      //       beta: 0,
      //       depth: 100,
      //       viewDistance: 25,
      //     },
      //     scrollablePlotArea: {
      //       minWidth: 900,
      //       scrollPositionX: 1,
      //     },

      //   },
      //   title: {
      //     text: 'MY PERFORMANCE ANALYSIS',
      //   },
      //   subtitle: {
      //     text: 'Termly performance for each academic session',
      //   },
      //   xAxis: {
      //     type: 'category', // categories: [],
      //     labels: {
      //       skew3d: true,
      //       style: {
      //         fontSize: '14px',
      //       },
      //     },
      //   },
      //   yAxis: {
      //     min: 0,
      //     max: 100,
      //     tickInterval: 20,
      //     title: {
      //       text: 'Performance Scale (%)',
      //     },
      //     // stackLabels: {
      //     //   enabled: true,
      //     //   style: {
      //     //       fontWeight: 'bold',
      //     //       color: 'gray'
      //     //   }
      //     // }
      //   },
      //   // plotOptions: {
      //   //   column: {
      //   //       stacking: 'normal',
      //   //       dataLabels: {
      //   //           enabled: true
      //   //       }
      //   //   }
      //   // },
      //   series: [

      //   ],

      //   // colors: ['#063', '#910000'],
      //   credits: {
      //     enabled: false,
      //   },
      // },
      staff: '',
      subject_teachers: [],
      class_activities: [],
      class_teachers: [],
      series: [
        {
          name: 'Performance',
          data: [],
        },
      ],
      average_performance: 0,
      columns: [
        'sn',
        'subject.name',
      ],

      options: {
        headings: {
          'subject.name': 'Subject',
          sn: '#',
        },
        sortable: [
          'id',
          'subject.name',
        ],
        // filterable: false,
        filterable: [
          'id',
          'subject.name',
        ],
      },
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchSessionalStaffPerformance()
    this.fetchData()
  },
  methods: {

    fetchSessionalStaffPerformance() {
      const app = this
      // this.listLoading = true;
      sessionalStaffPerformance.list()
        .then(response => {
          // app.chart_analytics.series = response.series
          app.series = response.series
        })
    },
    fetchData() {
      const app = this
      // this.listLoading = true;
      dataAnalysisResource.list()
        .then(response => {
          app.class_activities = response.class_activities
          app.staff = response.staff
          app.subject_teachers = response.subject_teachers
          // app.average_performance = response.average_performance
          // app.total_in_class = response.total_in_class
          // app.current_class = response.current_class
          app.class_teachers = response.class_teachers
        })
    },
  },
}
</script>
