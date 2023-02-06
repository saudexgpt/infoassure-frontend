export default [
  // {
  //   header: 'Result Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Time Table',
    icon: 'CalendarIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   except: ['super', 'parent', 'librarian'],
    // },
    acl: {
      modules: ['timetable'],
      roles: ['admin', 'teacher', 'student'],
    },
    children: [
      {
        title: 'Manage',
        route: 'ManageTimeTable',
        acl: {
          modules: ['timetable'],
          permissions: ['can manage time-table'],
        },
      },
      // {
      //   title: 'Record Result',
      //   route: 'RecordResult',
      // },
      {
        title: 'Class Routine',
        route: 'StudentRoutine',
        acl: {
          modules: ['timetable'],
          roles: ['student'],
        },
      },
      {
        title: 'My Routine',
        route: 'TeacherRoutine',
        acl: {
          modules: ['timetable'],
          roles: ['teacher'],
        },
      },
    ],
  },
]
