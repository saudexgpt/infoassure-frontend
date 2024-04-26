import Vue from 'vue'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css

// Import the styles too, globally
import 'vue-swatches/dist/vue-swatches.css'
// Import stylesheet
import ElementUI from 'element-ui'
// import { DocumentEditorPlugin } from '@syncfusion/ej2-vue-documenteditor'
// eslint-disable-next-line import/no-extraneous-dependencies
import { registerLicense } from '@syncfusion/ej2-base'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import drilldown from 'highcharts/modules/drilldown'
import exporting from 'highcharts/modules/exporting'
import highcharts3d from 'highcharts/highcharts-3d'
import highchartsMore from 'highcharts/highcharts-more'
import solidGauge from 'highcharts/modules/solid-gauge'
import stockInit from 'highcharts/modules/stock'
import { ServerTable, ClientTable, Event } from 'vue-tables-2'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import IdleVue from 'idle-vue'
// import Pusher from 'pusher-js'
import i18n from '@/libs/i18n'
import lang from '@/lang'
import router from './router'
import store from './store'
import App from './App.vue'
// Global Components
import './global-components'
import '@/permission'
// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
// import '@/libs/vue-select'
// import '@/libs/tour'

// Axios Mock Adapter
import '@/@fake-db/db'

/* -------------------------------------------------------------------------- */
/*                             PUSHER CONFIG                                  */
/* -------------------------------------------------------------------------- */
// Pusher.logToConsole = true
// const pusher = new Pusher(process.env.VUE_APP_MIX_PUSHER_APP_KEY, {
//   cluster: process.env.VUE_APP_MIX_PUSHER_APP_CLUSTER,
//   encrypted: true,
// })
// Vue.prototype.$pusher = pusher
const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  idleTime: 900000, // 900000ms == 900 seconds i.e 15 mins
  startAtIdle: false,
})
Vue.use(ElementUI, {
  i18n: (key, value) => lang.t(key, value),
})
// Vue.use(DocumentEditorPlugin)

// registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCekx1WmFZfVpgcl9HZlZVRmYuP1ZhSXxXdkZhXn9YcXJRRGheWUQ=')
// Trial license
// registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCekxyWmFZfVpgcV9DZFZTQWYuP1ZhSXxXdkZhUX9bdXBXQ2JbVkw=')

/// //////////////live license///////////////////////
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxceXRTRmhdWE10XUA=')

Vue.use(CKEditor)
Vue.use(ClientTable, {
  perPage: 10,
  texts: {
    filter: 'Search:',
  },
  sortIcon: {
    base: 'el-icon',
    is: 'el-icon-d-caret',
    up: 'el-icon-caret-top',
    down: 'el-icon-caret-bottom',
  },
}, false, 'bootstrap4')
Vue.use(HighchartsVue)

drilldown(Highcharts)
exporting(Highcharts)
highcharts3d(Highcharts)
highchartsMore(Highcharts)
solidGauge(Highcharts)
stockInit(Highcharts)
Vue.use(ServerTable)
Vue.use(Event)
// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
