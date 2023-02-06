export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Assignment',
    icon: 'BookIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   except: ['super', 'parent', 'librarian'],
    // },
    acl: {
      modules: ['assignment'],
      roles: ['admin', 'teacher', 'student'],
    },
    children: [
      {
        title: 'All Assignments',
        route: 'AllAssignments',
        acl: {
          modules: ['assignment'],
          roles: ['admin'],
        },
      },
      {
        title: 'Add Assignment',
        route: 'AddAssignment',
        acl: {
          modules: ['assignment'],
          roles: ['teacher'],
        },
      },
      {
        title: 'View Assignments',
        route: 'ViewAssignments',
        acl: {
          modules: ['assignment'],
          roles: ['teacher'],
        },
      },
      {
        title: 'My Assignment',
        route: 'StudentAssignment',
        acl: {
          modules: ['assignment'],
          roles: ['student'],
        },
      },
    ],
  },
]
