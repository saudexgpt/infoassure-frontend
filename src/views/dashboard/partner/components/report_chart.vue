<template>
  <div class="">

    <el-tabs v-model="activeName"  style="margin-top:15px;" type="border-card">
      <el-tab-pane  label="Population Chart" key="Population" name="Population">

        <keep-alive>
          <population-chart :params="params" :role="role" v-if="activeName=='Population'" type="Population" />
        </keep-alive>

      </el-tab-pane>
      <el-tab-pane  label="Admission Chart" key="Admission" name="Admission">

        <keep-alive>
          <admission-chart :params="params" :role="role" v-if="activeName=='Admission'" type="Admission" />
        </keep-alive>

      </el-tab-pane>
      <el-tab-pane  label="Academic Performance" key="Academic" name="Academic">
        <keep-alive>
          <academic-performance :params="params" v-if="activeName=='Academic'" type="Academic" />
        </keep-alive>

      </el-tab-pane>
      <el-tab-pane  label="Attendance Chart" key="Attendance" name="Attendance">
        <keep-alive>
          <attendance-chart :params="params" v-if="activeName=='Attendance'" type="Attendance" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>

  import PopulationChart from './charts/PopulationChart.vue';
  import AdmissionChart from './charts/AdmissionChart.vue';
  import AttendanceChart from '../../../attendance/partials/all_attendance';
  import AcademicPerformance from './charts/AcademicPerformance.vue';
  export default {
    props: {
      params: {
        type: Object,
        default: () => ({}),
      },
    },
    components: {
        PopulationChart, AdmissionChart, AcademicPerformance, AttendanceChart
    },
    data(){

      return {

        role: 'commissioner',
        activeName: 'Population',

      }

    },


  }
</script>
