export default [
  // {
  //   header: 'User Management',
  //   acl: {
  //     roles: ['admin'],
  //   },
  // },
  {
    title: 'Admin Settings',
    icon: 'ToolIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      roles: ['admin', 'super'],
    },
    children: [
      {
        title: 'Units',
        route: 'units',
        acl: {
          permissions: ['read-unit'],
        },
      },
      {
        title: 'Standards',
        route: 'standards',
        acl: {
          permissions: ['read-standards'],
        },
      },
      {
        title: 'Clauses/Requirements',
        route: 'clauses',
        acl: {
          permissions: ['read-clauses'],
        },
      },
      {
        title: 'Evidence',
        route: 'evidence',
        acl: {
          permissions: ['read-evidence'],
        },
      },
      {
        title: 'Gap Assessment',
        route: 'questions',
        acl: {
          permissions: ['read-gap assessment'],
        },
      },
      {
        title: 'Client Certificate',
        route: 'client-certificate',
        acl: {
          permissions: ['upload-client certificate'],
        },
      },
      {
        title: 'Access Control',
        route: 'manage-roles',
        acl: {
          roles: ['super'],
        },
      },
    ],
  },
]
