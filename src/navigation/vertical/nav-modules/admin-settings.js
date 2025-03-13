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
      // roles: ['super'],
    },
    children: [
      // {
      //   title: 'Units',
      //   route: 'units',
      //   acl: {
      //     permissions: ['read-unit'],
      //   },
      // },
      // {
      //   title: 'Standards',
      //   route: 'standards',
      //   acl: {
      //     permissions: ['read-standards'],
      //   },
      // },
      // {
      //   title: 'Clauses/Requirements',
      //   route: 'clauses',
      //   acl: {
      //     permissions: ['read-clauses'],
      //   },
      // },
      // {
      //   title: 'Evidence',
      //   route: 'evidence',
      //   acl: {
      //     permissions: ['read-evidence'],
      //   },
      // },
      // {
      //   title: 'Document Templates',
      //   route: 'document-templates',
      //   acl: {
      //     // permissions: ['read-evidence'],
      //   },
      // },
      // {
      //   title: 'Gap Assessment',
      //   route: 'questions',
      //   acl: {
      //     permissions: ['read-gap assessment'],
      //   },
      // },
      {
        title: 'VDD Questions',
        route: 'vdd-questions',
        acl: {
          roles: ['super'],
        },
      },
      {
        title: 'Threat Library',
        route: 'risk-library',
      },
      {
        title: 'SOA',
        route: 'soa',
      },
      {
        title: 'Client Feedback Form',
        route: 'client-feedback-form',
        // acl: {
        //   permissions: ['manage-client-feedback'],
        // },
      },
      {
        title: 'Module Packages',
        route: 'ManagePakages',
        acl: {
          roles: ['super'],
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
