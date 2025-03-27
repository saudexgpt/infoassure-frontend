export default [
  {
    path: '/acl/roles',
    name: 'manage-roles',
    component: () => import('@/views/modules/access-control/index.vue'),
    meta: {
      roles: ['super'],
    },
  },
  // {
  //   path: '/acl/permissions',
  //   name: 'manage-permissions',
  //   component: () => import('@/views/modules/access-control/Permissions.vue'),
  //   meta: {
  //     roles: ['super'],
  //   },
  // },
]
