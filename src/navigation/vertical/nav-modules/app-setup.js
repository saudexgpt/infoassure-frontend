export default [
  {
    title: 'Settings',
    icon: 'ToolIcon',
    route: 'settings',
    acl: {
      roles: ['admin'],
    },
  },
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  // {
  //   title: 'Settings',
  //   icon: 'ToolIcon',
  //   // tag: '2',
  //   // tagVariant: 'light-warning',
  //   acl: {
  //     roles: ['admin'],
  //   },
  //   children: [
  //     {
  //       title: 'Manage Assets',
  //       route: 'manage-assets',
  //     },
  //     {
  //       title: 'Business Units',
  //       route: 'business-unit',
  //       acl: {
  //         // modules: ['bia'],
  //         // except: ['client'],
  //       },
  //     },
  //     {
  //       title: 'Risk Management',
  //       route: 'risk-management-setup',
  //     },
  //   ],
  // },
]
