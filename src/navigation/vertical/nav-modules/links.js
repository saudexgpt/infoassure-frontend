export default [
  {
    title: 'Dashboard',
    icon: 'HomeIcon',
    route: 'dashboard',
    // tag: '2',
    tagVariant: 'light-warning',
  },
  {
    title: 'Due Diligence Assessment',
    icon: 'SearchIcon',
    route: 'due-diligence',
    acl: {
      modules: ['due-diligence'],
    },
  },
  // {
  //   title: 'BIA Setup',
  //   icon: 'BriefcaseIcon',
  //   route: 'bia-setup',
  //   acl: {
  //     modules: ['bia'],
  //   },
  // },

  {
    title: 'Activated Modules',
    icon: 'CheckIcon',
    route: 'ActivatedModules',
    acl: {
      modules: ['due-diligence', 'bia'],
      except: ['client'],
      // roles: ['partner'],
    },
  },
  {
    title: 'Manage Projects',
    icon: 'CpuIcon',
    route: 'manage-projects',
    acl: {
      permissions: ['manage-client-projects', 'manage-project-plan', 'manage-project-phases'],
    },
  },

  {
    title: 'Client Certificate',
    icon: 'ClipboardIcon',
    route: 'client-certificate',
    acl: {
      permissions: ['upload-client certificate'],
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
