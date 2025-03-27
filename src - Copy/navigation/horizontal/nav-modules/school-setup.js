export default [
  // {
  //   header: 'School Setup',
  //   acl: {
  //     roles: ['admin'],
  //   },
  // },
  {
    title: 'Setup',
    icon: 'SettingsIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      permissions: ['can manage settings', 'can manage subjects', 'can manage news and events'],
    },
    children: [
      {
        title: 'Manage Level',
        route: 'level-setup',
        acl: {
          permissions: ['can manage settings'],
        },
      },
      {
        title: 'Manage Section',
        route: 'section-setup',
        acl: {
          permissions: ['can manage settings'],
        },
      },
      {
        title: 'Manage Class',
        route: 'class-setup',
        acl: {
          permissions: ['can manage settings'],
        },
      },
      {
        title: 'Manage Subject',
        route: 'subject-setup',
        acl: {
          permissions: ['can manage settings', 'can manage subjects'],
        },
      },
      {
        title: 'Session & Term',
        route: 'session-and-term',
        acl: {
          permissions: ['can manage settings'],
        },
      },
    ],
  },
]
