export default [
  {
    title: 'Dashboard',
    icon: 'HomeIcon',
    route: 'dashboard',
    // tag: '2',
    tagVariant: 'light-warning',
  },
  // {
  //   title: 'Projects',
  //   icon: 'BriefcaseIcon',
  //   route: 'my-projects',
  //   acl: {
  //     roles: ['client'],
  //   },
  // },
  {
    title: 'Manage Projects',
    icon: 'BriefcaseIcon',
    route: 'manage-projects',
    acl: {
      permissions: ['manage-client-projects', 'manage-project-plan', 'manage-project-phases'],
    },
  },
  // {
  //   title: 'Profile',
  //   icon: 'UsersIcon',
  //   route: 'UserProfile',
  // },
  // {
  //   title: 'Process Consulting',
  //   icon: 'CpuIcon',
  //   route: 'processConsulting',
  //   // route: { name: 'project', params: { consulting: 'process' } },
  // },
  // {
  //   title: 'Technical Consulting',
  //   icon: 'SlidersIcon',
  //   route: 'technicalConsulting',
  //   // route: { name: 'project', params: { consulting: 'technical' } },
  // },
]
