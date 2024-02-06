export default [
  // {
  //   header: 'User Management',
  //   acl: {
  //     roles: ['admin'],
  //   },
  // },
  {
    title: 'Manage Users',
    icon: 'UsersIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      permissions: ['read-partners', 'read-clients', 'read-staff'],
    },
    children: [
      {
        title: 'Manage Partners',
        route: 'manage-partners',
        acl: {
          permissions: ['read-partners'],
        },
      },
      {
        title: 'Manage Clients',
        route: 'manage-clients',
        acl: {
          permissions: ['read-clients'],
        },
      },
      {
        title: 'Manage Staff',
        route: 'manage-staff',
        acl: {
          permissions: ['read-staff'],
        },
      },
    ],
  },
]
