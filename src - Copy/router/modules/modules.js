export default [
  {
    path: '/modules',
    name: 'modules',
    component: () => import('@/views/modules/Index.vue'),
  },
  {
    path: '/modules/:title/:view',
    name: 'modules-details',
    component: () => import('@/views/modules/Details.vue'),
  },
  {
    path: '/module-setup/:id/:module',
    component: () => import('@/views/modules/packages/Setup.vue'),
    name: 'ModuleSetup',
    meta: {
      roles: ['super'],
    },
  },

  // entry point of all modules

  {
    path: '/ndpa-index',
    name: 'ndpa-index',
    component: () => import('@/views/modules/NDPA/index.vue'),
    acl: {
      roles: ['admin', 'client'],
    },
  },
  {
    path: '/vdd-index',
    name: 'vdd-index',
    component: () => import('@/views/modules/DUE-DILIGENCE/index.vue'),
    acl: {
      roles: ['admin', 'client'],
    },
  },
]
