export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardMain.vue'),
  },
  {
    path: '/my-projects',
    name: 'my-projects',
    component: () => import('@/views/modules/projects/index.vue'),
    meta: {
      roles: ['client'],
    },
  },
  {
    path: '/client-projects',
    name: 'client-projects',
    component: () => import('@/views/modules/projects/ClientProjects.vue'),
    meta: {
      permissions: ['read-client project'],
    },
  },
  {
    path: '/standards',
    name: 'standards',
    component: () => import('@/views/modules/app-setup/Standards.vue'),
    meta: {
      permissions: ['read-standards'],
    },
  },
  {
    path: '/clauses',
    name: 'clauses',
    component: () => import('@/views/modules/app-setup/Clauses.vue'),
    meta: {
      permissions: ['read-clauses'],
    },
  },
  {
    path: '/evidence',
    name: 'evidence',
    component: () => import('@/views/modules/app-setup/Evidence.vue'),
    meta: {
      permissions: ['read-evidence'],
    },
  },
  {
    path: '/client-certificate',
    name: 'client-certificate',
    component: () => import('@/views/modules/app-setup/ClientCertificate.vue'),
    meta: {
      permissions: ['upload-client certificate'],
    },
  },

  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/views/modules/app-setup/Questions.vue'),
    meta: {
      permissions: ['read-gap assessment'],
    },
  },
  {
    path: '/consultings',
    name: 'consultings',
    component: () => import('@/views/modules/app-setup/Consultings.vue'),
    meta: {
      permissions: ['read-consulting'],
    },
  },
  // {
  //   path: '/process-consulting',
  //   component: () => import('@/views/modules/projects/ProcessConsulting.vue'),
  //   name: 'processConsulting',
  //   // meta: {
  //   //   permissions: ['can manage staff'],
  //   // },
  // },
  // {
  //   path: '/technical-consulting',
  //   component: () => import('@/views/modules/projects/TechnicalConsulting.vue'),
  //   name: 'technicalConsulting',
  //   // meta: {
  //   //   permissions: ['can manage staff'],
  //   // },
  // },
  {
    path: '/acl/roles',
    name: 'manage-roles',
    component: () => import('@/views/modules/access-control/index.vue'),
    meta: {
      roles: ['super'],
    },
  },
  {
    path: '/manage-staff',
    name: 'manage-staff',
    component: () => import('@/views/modules/user/index.vue'),
    meta: {
      permissions: ['read-staff'],
    },
  },
  {
    path: '/manage-clients',
    name: 'manage-clients',
    component: () => import('@/views/modules/user/Clients.vue'),
    meta: {
      permissions: ['read-clients'],
    },
  },
  {
    path: '/profile',
    component: () => import('@/views/modules/user/Profile.vue'),
    name: 'UserProfile',
  },
]