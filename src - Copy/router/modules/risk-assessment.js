export default [
  {
    path: '/risk-assessment',
    name: 'risk-assessment',
    component: () => import('@/views/modules/risk-assessment/index.vue'),
    // meta: {
    //   roles: ['super'],
    // },
  },
  {
    path: '/risk-management-setup',
    name: 'risk-management-setup',
    component: () => import('@/views/modules/RiskAndThreats/index.vue'),
    // meta: {
    //   except: ['client'],
    // },
  },
]
