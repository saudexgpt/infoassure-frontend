export default [
  {
    path: '/vdd-dashboard',
    name: 'vdd-dashboard',
    component: () => import('@/views/modules/DUE-DILIGENCE/Dashboard.vue'),
  },
  {
    path: '/manage-vdd',
    name: 'manage-vdd',
    component: () => import('@/views/modules/DUE-DILIGENCE/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/vdd-report',
    name: 'vdd-report',
    component: () => import('@/views/modules/DUE-DILIGENCE/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
