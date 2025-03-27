export default [
  {
    path: '/isms-dashboard',
    name: 'isms-dashboard',
    component: () => import('@/views/modules/ISMS-ISO27001/Dashboard.vue'),
  },
  {
    path: '/manage-isms',
    name: 'manage-isms',
    component: () => import('@/views/modules/ISMS-ISO27001/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/isms-report',
    name: 'isms-report',
    component: () => import('@/views/modules/ISMS-ISO27001/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
