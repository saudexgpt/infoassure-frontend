import 'vue/jsx'
// 引入全局样式
import '@/styles/index.less'
import vuetify from '@/plugins/vuetify'
import './permission.ts'
// 引入windi css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

import store from '@/VuexStore'

// 全局组件
import { setupGlobCom } from '@/components'
// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { registerLicense } from '@syncfusion/ej2-base'

import { createApp } from 'vue'

import App from './App.vue'

import { ClientTable } from 'v-tables-3'

import JsonExcel from 'vue-json-excel3'

import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
// console.log(Highcharts)
import drilldown from 'highcharts/modules/drilldown'
import exporting from 'highcharts/modules/exporting'
// Optional: Import offline-exporting if needed
import OfflineExporting from 'highcharts/modules/offline-exporting'
import HighchartsGantt from 'highcharts/modules/gantt'
// import highcharts3d from 'highcharts/highcharts-3d'
// import highchartsMore from 'highcharts/highcharts-more'
// import solidGauge from 'highcharts/modules/solid-gauge'
if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  drilldown(Highcharts)
}
if (!Highcharts.Chart.prototype.exportChart) {
  exporting(Highcharts)
}
if (!Highcharts.Chart.prototype.exportChartLocal) {
  OfflineExporting(Highcharts)
}

if (!Highcharts.GanttChart.prototype.init) {
  HighchartsGantt(Highcharts)
}
registerLicense(import.meta.env.VITE_SYNC_FUSION_LICENSE)
// highcharts3d(Highcharts)
// highchartsMore(Highcharts)
// solidGauge(Highcharts)
const setupAll = async () => {
  const app = createApp(App)
  app.use(vuetify)
  app.use(ClientTable)
  app.use(HighchartsVue, { highcharts: Highcharts })
  app.use(JsonExcel)
  app.component('downloadExcel', JsonExcel)
  await setupI18n(app)

  app.use(store)

  setupStore(app)
  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)

  app.mount('#app')
}

setupAll()
