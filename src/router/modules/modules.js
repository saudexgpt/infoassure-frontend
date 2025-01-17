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
]
