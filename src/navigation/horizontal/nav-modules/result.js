export default [
  // {
  //   header: 'Result Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Result',
    icon: 'FileTextIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   except: ['super', 'parent', 'librarian'],
    // },
    acl: {
      modules: ['result'],
      roles: ['admin', 'teacher', 'student'],
    },
    children: [
      {
        title: 'Configure Grades',
        route: 'ManageGrade',
        acl: {
          modules: ['result'],
          permissions: ['can configure grades'],
        },
      },
      {
        title: 'Result Settings',
        route: 'ResultDisplaySettings',
        acl: {
          modules: ['result'],
          permissions: ['can manage result settings'],
        },
      },
      {
        title: 'Manage Result',
        route: 'ManageResult',
        acl: {
          modules: ['result'],
          permissions: ['can manage results'],
        },
      },
      {
        title: 'Record Result',
        route: 'RecordResult',
        acl: {
          modules: ['result'],
          roles: ['teacher'],
        },
      },
      {
        title: 'Broad Sheet',
        route: 'ManageBroadSheet',
        acl: {
          modules: ['result'],
          roles: ['teacher'],
        },
      },
      {
        title: 'My Result',
        route: 'MyResult',
        acl: {
          modules: ['result'],
          roles: ['student'],
        },
      },
    ],
  },
]
