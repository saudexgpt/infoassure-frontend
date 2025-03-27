export default [
  {
    title: 'Materials',
    icon: 'BookIcon',
    acl: {
      modules: ['materials'],
      roles: ['teacher', 'student'],
    },
    children: [
      {
        title: 'Course Materials',
        route: 'CourseMaterials',
        acl: {
          modules: ['materials'],
          roles: ['teacher'],
        },
      },
      {
        title: 'Subject Curriculum',
        route: 'SubjectCurriculum',
        acl: {
          modules: ['materials'],
          roles: ['teacher'],
        },
      },
      {
        title: 'My Course Materials',
        route: 'StudentCourseMaterials',
        acl: {
          modules: ['materials'],
          roles: ['student'],
        },
      },
      {
        title: 'My Subject Curriculum',
        route: 'StudentSubjectCurriculum',
        acl: {
          modules: ['materials'],
          roles: ['student'],
        },
      },
    ],
  },
]
