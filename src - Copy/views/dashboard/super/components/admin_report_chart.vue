<template>
  <div class="">

    <el-tabs
      v-model="activeName"
      style="margin-top:15px;"
      type="border-card"
    >
      <el-tab-pane
        key="Admission"
        label="Admission Chart"
        name="Admission"
      >

        <keep-alive>
          <admission-chart
            v-if="activeName=='Admission'"
            :role="role"
            type="Admission"
          />
        </keep-alive>

      </el-tab-pane>
      <el-tab-pane
        key="Academic"
        label="Academic Performance"
        name="Academic"
      >
        <keep-alive>
          <academic-performance
            v-if="activeName=='Academic'"
            type="Academic"
          />
        </keep-alive>

      </el-tab-pane>
      <!-- <el-tab-pane
        key="Attendance"
        label="Attendance Chart"
        name="Attendance"
      >
        <keep-alive>
          <attendance-chart
            v-if="activeName=='Attendance'"
            type="Attendance"
          />
        </keep-alive>
      </el-tab-pane> -->
    </el-tabs>

  </div>
</template>
<script>

import AdmissionChart from './charts/AdmissionChart.vue'
// import AttendanceChart from '../../../attendance/index'
import AcademicPerformance from './charts/AcademicPerformance.vue'

export default {
  components: {
    AdmissionChart, AcademicPerformance,
  },
  data() {
    return {

      role: 'admin',
      activeName: 'Admission',

    }
  },

}
</script>
