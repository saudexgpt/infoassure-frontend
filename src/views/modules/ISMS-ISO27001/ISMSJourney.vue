<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane v-if="checkRole(['admin', 'client'])" label="Manage Schedules & Tasks" lazy>
      <ModuleCalendar v-if="checkRole(['admin'])" />
      <AssignedCalendar v-if="checkRole(['client'])" />
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['admin'])" label="All Scheduled Tasks" lazy>
      <Calendar />
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['client', 'admin'])" label="My Tasks" lazy>
      <MyCalendar />
    </el-tab-pane>
  </el-tabs>
  <!-- <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
  </div> -->
</template>

<script>
import Calendar from './partials/Calendar.vue'
import MyCalendar from './partials/MyCalendar.vue'
import ModuleCalendar from './partials/ModuleCalendar.vue'
import checkRole from '@/utils/role'
import AssignedCalendar from './partials/AssignedCalendar.vue'
export default {
  components: {
    ModuleCalendar,
    Calendar,
    MyCalendar,
    AssignedCalendar
  },

  data() {
    return {}
  },
  methods: {
    checkRole
  }
}
</script>
