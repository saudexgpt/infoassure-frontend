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
      permissions: ['can manage company staff', 'can manage staff', 'can manage student'],
    },
    children: [
      {
        title: 'Company Staff',
        route: 'manage-company-staff',
        acl: {
          permissions: ['can manage company staff'],
        },
      },
      {
        title: 'Students',
        route: 'manage-student',
        acl: {
          permissions: ['can manage student'],
        },
      },
      {
        title: 'Staff',
        route: 'manage-staff',
        acl: {
          permissions: ['can manage staff'],
        },
      },
      {
        title: 'Parent',
        route: 'manage-parent',
        acl: {
          permissions: ['can manage student'],
        },
      },
    ],
  },
]
