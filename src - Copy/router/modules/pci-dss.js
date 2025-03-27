export default [
  {
    path: '/pcidss-dashboard',
    name: 'pcidss-dashboard',
    component: () => import('@/views/modules/PCI-DSS/Dashboard.vue'),
  },
  {
    path: '/manage-pcidss',
    name: 'manage-pcidss',
    component: () => import('@/views/modules/PCI-DSS/Manage.vue'),
    // meta: {
    //   roles: ['client'],
    // },
  },
  {
    path: '/pcidss-report',
    name: 'pcidss-report',
    component: () => import('@/views/modules/PCI-DSS/Report.vue'),
    // meta: {
    //   modules: ['due-diligence'],
    // },
  },
]
