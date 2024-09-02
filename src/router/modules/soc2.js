export default [
  {
    path: '/soc2-dashboard',
    name: 'soc2-dashboard',
    component: () => import('@/views/modules/SOC2/Dashboard.vue'),
  },
  {
    path: '/manage-soc2',
    name: 'manage-soc2',
    component: () => import('@/views/modules/SOC2/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/soc2-report',
    name: 'soc2-report',
    component: () => import('@/views/modules/SOC2/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
