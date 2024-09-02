export default [
  {
    path: '/vapt-dashboard',
    name: 'vapt-dashboard',
    component: () => import('@/views/modules/VAPT/Dashboard.vue'),
  },
  {
    path: '/manage-vapt',
    name: 'manage-vapt',
    component: () => import('@/views/modules/VAPT/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/vapt-report',
    name: 'vapt-report',
    component: () => import('@/views/modules/VAPT/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
