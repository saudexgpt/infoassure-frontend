/* eslint-disable no-shadow */
import Vue from 'vue'
import Vuex from 'vuex'
import camelCase from 'camelcase'
import getters from './getters'
// Modules
// import ecommerceStoreModule from '@/views/apps/e-commerce/eCommerceStoreModule'
// import app from './app'
// import appConfig from './app-config'
// import verticalMenu from './vertical-menu'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
// set './app.js' => 'app'
  const moduleName = camelCase(modulePath.replace(/^\.\/(.*)\.\w+$/, '$1'))
  const value = modulesFiles(modulePath)
  // eslint-disable-next-line no-param-reassign
  modules[moduleName] = value.default
  return modules
}, {})
export default new Vuex.Store({
  modules,
  getters,
  strict: process.env.DEV,
})
