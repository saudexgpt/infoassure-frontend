import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
// import Layout from './layouts/main/Main.vue'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['super','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// import apps from './modules/apps'
import pages from './modules/pages'

Vue.use(Router)
export const constantRoutes = [

  // =============================================================================
  // PAGES
  // =============================================================================
  {
    hidden: true,
    path: '/login',
    name: 'page-login',
    component: () => import('@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      redirectIfLoggedIn: true,
    },
  },
  {
    hidden: true,
    path: '/register',
    name: 'UserRegistration',
    component: () => import('@/views/pages/authentication/UserRegistration.vue'),
    meta: {
      layout: 'full',
      // redirectIfLoggedIn: true,
    },
  },
  {
    hidden: true,
    path: '/confirm-registration/:code',
    name: 'ConfirmRegistration',
    component: () => import('@/views/pages/authentication/ConfirmRegister.vue'),
    meta: {
      layout: 'full',
      // redirectIfLoggedIn: true,
    },
  },
  {
    hidden: true,
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/pages/authentication/ForgotPassword.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    hidden: true,
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/views/pages/authentication/ResetPassword.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    hidden: true,
    path: '/error-404',
    name: 'page-error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    hidden: true,
    path: '/error-500',
    name: 'page-error-500',
    component: () => import('@/views/pages/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    hidden: true,
    path: '/not-authorized',
    name: 'page-not-authorized',
    component: () => import('@/views/pages/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    hidden: true,
    path: '/maintenance',
    name: 'page-maintenance',
    component: () => import('@/views/pages/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {

    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/modules/Notifications.vue'),
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  // =============================================================================
  // MAIN LAYOUT ROUTES
  // =============================================================================
  { path: '/', redirect: { name: 'dashboard' } },
  ...pages,
  // ...parent,
  {
    path: '*',
    redirect: '/error-404',
    hidden: true,
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  base: '/',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: constantRoutes,
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
