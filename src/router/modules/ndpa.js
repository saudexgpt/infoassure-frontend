export default [
  {
    path: '/ndpa-dashboard',
    name: 'ndpa-dashboard',
    component: () => import('@/views/modules/NDPA/Dashboard.vue'),
  },
  {
    path: '/manage-ndpa',
    name: 'manage-ndpa',
    component: () => import('@/views/modules/NDPA/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/ndpa-report',
    name: 'ndpa-report',
    component: () => import('@/views/modules/NDPA/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
