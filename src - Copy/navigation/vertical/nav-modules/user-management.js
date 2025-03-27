export default [
  // {
  //   header: 'User Management',
  //   acl: {
  //     roles: ['admin'],
  //   },
  // },
  {
    title: 'Users Management',
    icon: 'UsersIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      // permissions: ['read-partners', 'read-clients', 'read-staff'],
      roles: ['super', 'partner'],
    },
    children: [
      {
        title: 'Manage Partners',
        route: 'manage-partners',
        acl: {
          permissions: ['read-partners'],
          roles: ['super'],
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
  {
    title: 'Manage Users',
    icon: 'UsersIcon',
    route: 'manage-client-users',
    acl: {
      roles: ['admin'],
    },
  },
]
