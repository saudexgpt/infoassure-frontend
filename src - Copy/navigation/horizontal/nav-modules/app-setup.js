export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Settings',
    icon: 'ToolIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      roles: ['super'],
    },
    children: [
      {
        title: 'Currlm. Level Group',
        route: 'curriculum-level-group',
      },
      {
        title: 'Curriculum Level',
        route: 'curriculum-level-setup',
      },
      {
        title: 'Terms & Sessions',
        route: 'AcademicSession',
      },
    ],
  },
]
