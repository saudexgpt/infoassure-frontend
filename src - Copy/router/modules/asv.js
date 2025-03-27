export default [
  {
    path: '/asv-dashboard',
    name: 'asv-dashboard',
    component: () => import('@/views/modules/ASV/Dashboard.vue'),
  },
  {
    path: '/manage-asv',
    name: 'manage-asv',
    component: () => import('@/views/modules/ASV/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/asv-report',
    name: 'asv-report',
    component: () => import('@/views/modules/ASV/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
