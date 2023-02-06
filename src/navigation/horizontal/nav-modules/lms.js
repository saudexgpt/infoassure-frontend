export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'E-Learning',
    icon: 'AirplayIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   except: ['super', 'parent', 'librarian'],
    // },
    acl: {
      modules: ['lms'],
      roles: ['admin', 'teacher', 'student'],
    },
    children: [
      {
        title: 'E-Exam',
        route: 'EExam',
        acl: {
          modules: ['lms'],
          roles: ['teacher', 'admin'],
        },
      },
      {
        title: 'Classroom',
        route: 'Classroom',
        acl: {
          modules: ['lms'],
          roles: ['teacher', 'admin'],
        },
      },
      {
        title: 'Student Exam',
        route: 'StudentExam',
        acl: {
          modules: ['lms'],
          roles: ['student'],
        },
      },
      {
        title: 'Class Room',
        route: 'StudentClassroom',
        acl: {
          modules: ['lms'],
          roles: ['student'],
        },
      },
    ],
  },
]
