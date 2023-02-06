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
        label="Academic Performance Chart"
        name="Academic"
      >
        <keep-alive>
          <academic-performance
            v-if="activeName=='Academic'"
            type="Academic"
          />
        </keep-alive>

      </el-tab-pane>
      <el-tab-pane
        v-if="modules.includes('account')"
        key="Revenue"
        label="Revenue Chart"
        name="Revenue"
      >
        <keep-alive>
          <!-- <academic-performance
            v-if="activeName=='Academic'"
            type="Academic"
          /> -->
          <revenue
            v-if="sessions.length > 0 && activeName=='Revenue'"
            type="Revenue"
            :sessions="sessions"
          />
        </keep-alive>

      </el-tab-pane>
      <el-tab-pane
        v-if="modules.includes('account')"
        key="Debtors"
        label="Debtors Chart"
        name="Debtors"
      >
        <keep-alive>
          <debtors
            v-if="sessions.length > 0 && activeName=='Debtors'"
            type="Debtors"
            :sessions="sessions"
            :terms="terms"
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
import Revenue from './charts/Revenue.vue'
import Debtors from './charts/Debtors.vue'

export default {
  components: {
    AdmissionChart,
    AcademicPerformance,
    Revenue,
    Debtors,
  },
  props: {
    sessions: {
      type: Array,
      required: true,
    },
    terms: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {

      role: 'admin',
      activeName: 'Admission',

    }
  },
  computed: {
    modules() {
      return this.$store.getters.userData.modules
    },
  },

}
</script>
