export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Manage RCSA',
    icon: 'SearchIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      modules: ['rcsa'],
    },
    route: 'manage-rcsa',
    // children: [
    //   {
    //     title: 'RCM',
    //     route: 'manage-rcm',
    //   },
    //   {
    //     title: 'RCSA',
    //     route: 'manage-rcsa',
    //   },
    //   {
    //     title: 'Risk Log',
    //     route: 'risk-log',
    //   },
    // ],
  },
]
