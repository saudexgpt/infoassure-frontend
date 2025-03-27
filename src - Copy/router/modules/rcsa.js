export default [
  {
    path: '/rcsa-dashboard',
    name: 'rcsa-dashboard',
    component: () => import('@/views/modules/RCSA/Dashboard.vue'),
  },
  {
    path: '/manage-rcsa',
    name: 'manage-rcsa',
    component: () => import('@/views/modules/RCSA/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/rcsa-report',
    name: 'rcsa-report',
    component: () => import('@/views/modules/RCSA/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
