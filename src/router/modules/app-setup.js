export default [
  {
    path: '/curriculum-level/group',
    name: 'curriculum-level-group',
    component: () => import('@/views/modules/app-setup/Questions.vue'),
    meta: {
      roles: ['super'],
    },
  },
  {
    path: '/curriculum-level/setup',
    name: 'curriculum-level-setup',
    component: () => import('@/views/modules/app-setup/Clauses.vue'),
    meta: {
      roles: ['super'],
    },
  },
  {
    path: '/session',
    name: 'AcademicSession',
    component: () => import('@/views/modules/app-setup/Standards.vue'),
    meta: {
      roles: ['super'],
    },
  },
]
