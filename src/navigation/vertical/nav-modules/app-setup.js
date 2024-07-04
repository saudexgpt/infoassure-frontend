export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Setup',
    icon: 'ToolIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   roles: ['super'],
    // },
    children: [
      {
        title: 'Manage Assets',
        route: 'manage-assets',
      },
      {
        title: 'Business Units',
        route: 'business-unit',
        acl: {
          // modules: ['bia'],
          // except: ['client'],
        },
      },
      // {
      //   title: 'Risk & Control Matrix',
      //   route: 'risk-setup',
      // },
      {
        title: 'Risk Management',
        route: 'risk-management',
      },
    ],
  },
]
