export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Attendance',
    icon: 'UserCheckIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      modules: ['attendance'],
      permissions: ['can view class attendance', 'can view subject attendance'],
    },
    children: [
      {
        title: 'Class Attendance',
        route: 'ClassAttendance',
        acl: {
          modules: ['attendance'],
          permissions: ['can view class attendance'],
        },
      },
      {
        title: 'Subject Attendance',
        route: 'SubjectAttendance',
        acl: {
          modules: ['attendance'],
          permissions: ['can view subject attendance'],
        },
      },
      // {
      //   title: 'My Attendance',
      //   route: 'ClassAttendance',
      //   acl: {
      //     roles: ['student'],
      //   },
      // },
    ],
  },
]
