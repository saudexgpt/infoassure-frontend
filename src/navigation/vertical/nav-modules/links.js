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
    title: 'Client Projects',
    icon: 'BriefcaseIcon',
    route: 'client-projects',
    acl: {
      permissions: ['read-client project'],
    },
  },
  {
    title: 'Manage Clients',
    icon: 'UsersIcon',
    route: 'manage-clients',
    acl: {
      permissions: ['read-clients'],
    },
  },
  {
    title: 'Manage Staff',
    icon: 'UsersIcon',
    route: 'manage-staff',
    acl: {
      permissions: ['read-staff'],
    },
  },
  {
    title: 'Profile',
    icon: 'UsersIcon',
    route: 'UserProfile',
  },
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
