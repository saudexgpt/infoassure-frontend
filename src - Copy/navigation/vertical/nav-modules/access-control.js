export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Access Control',
    icon: 'LockIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    route: 'manage-roles',
    acl: {
      permissions: ['can manage roles'],
    },
    // children: [
    //   {
    //     title: 'Manage Roles',
    //     route: 'manage-roles',
    //     acl: {
    //       permissions: ['can manage roles'],
    //     },
    //   },
    //   // {
    //   //   title: 'Manage Permissions',
    //   //   route: 'manage-permissions',
    //   //   acl: {
    //   //     roles: ['super'],
    //   //   },
    //   // },
    // ],
  },
]
