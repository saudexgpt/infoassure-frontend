export default [
  {
    path: '/lms-dashboard',
    name: 'lms-dashboard',
    component: () => import('@/views/modules/LMS/Dashboard.vue'),
  },
  {
    path: '/manage-lms',
    name: 'manage-lms',
    component: () => import('@/views/modules/LMS/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/lms-report',
    name: 'lms-report',
    component: () => import('@/views/modules/LMS/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
