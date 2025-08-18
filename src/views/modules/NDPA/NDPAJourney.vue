<template>
  <el-tabs type="card" class="demo-tabs">
    <el-tab-pane v-if="checkRole(['admin'])" label="Manage Schedules & Tasks" lazy>
      <ModuleCalendar />
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['admin'])" label="View Scheduled Tasks" lazy>
      <Calendar />
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['client'])" label="My Tasks" lazy>
      <MyCalendar />
    </el-tab-pane>
  </el-tabs>
  <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
  </div>
</template>

<script>
import Calendar from './partials/Calendar.vue'
import MyCalendar from './partials/MyCalendar.vue'
import ModuleCalendar from './partials/ModuleCalendar.vue'
import checkRole from '@/utils/role'
export default {
  components: {
    ModuleCalendar,
    Calendar,
    MyCalendar
  },

  data() {
    return {}
  },
  methods: {
    checkRole
  }
}
</script>
