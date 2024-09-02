export default [
  {
    path: '/sms-dashboard',
    name: 'sms-dashboard',
    component: () => import('@/views/modules/SMS-ISO20000/Dashboard.vue'),
  },
  {
    path: '/manage-sms',
    name: 'manage-sms',
    component: () => import('@/views/modules/SMS-ISO20000/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/sms-report',
    name: 'sms-report',
    component: () => import('@/views/modules/SMS-ISO20000/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
