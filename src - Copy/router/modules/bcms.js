export default [
  {
    path: '/bcms-dashboard',
    name: 'bcms-dashboard',
    component: () => import('@/views/modules/BCMS-ISO22301/Dashboard.vue'),
  },
  {
    path: '/manage-bcms',
    name: 'manage-bcms',
    component: () => import('@/views/modules/BCMS-ISO22301/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/bcms-report',
    name: 'bcms-report',
    component: () => import('@/views/modules/BCMS-ISO22301/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
