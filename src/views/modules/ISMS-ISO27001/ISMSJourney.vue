<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Manage Schedules & Tasks">
      <ModuleCalendar v-if="checkRole(['admin'])" :selected-module="module" />
      <AssignedCalendar v-if="checkRole(['client'])" :selected-module="module" />
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['admin'])" label="All Scheduled Tasks" lazy>
      <Calendar :selected-module="module" />
    </el-tab-pane>
    <el-tab-pane v-if="checkRole(['client', 'admin'])" label="My Tasks" lazy>
      <MyCalendar :selected-module="module" />
    </el-tab-pane>
  </el-tabs>
  <!-- <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
  </div> -->
</template>

<script>
import Calendar from '@/views/modules/ModuleSetup/Calendar/partials/Calendar.vue'
import MyCalendar from '@/views/modules/ModuleSetup/Calendar/partials/MyCalendar.vue'
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
    return {
      module: 'isms'
    }
  },
  methods: {
    checkRole
  }
}
</script>
