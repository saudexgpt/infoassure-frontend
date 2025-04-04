export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardMain.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/modules/settings/index.vue'),
  },
  {
    path: '/apps/email',
    name: 'apps-email',
    component: () => import('@/views/apps/email/Email.vue'),
    meta: {
      contentRenderer: 'sidebar-left',
      contentClass: 'email-application',
    },
  },
  {
    path: '/apps/email/:folder',
    name: 'apps-email-folder',
    component: () => import('@/views/apps/email/Email.vue'),
    meta: {
      contentRenderer: 'sidebar-left',
      contentClass: 'email-application',
      navActiveLink: 'apps-email',
    },
    beforeEnter(to, _, next) {
      if (['sent', 'draft', 'starred', 'spam', 'trash'].includes(to.params.folder)) next()
      else next({ name: 'error-404' })
    },
  },
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: () => import('@/views/apps/email/Email.vue'),
    meta: {
      contentRenderer: 'sidebar-left',
      contentClass: 'email-application',
      navActiveLink: 'apps-email',
    },
    beforeEnter(to, _, next) {
      if (['personal', 'company', 'important', 'private'].includes(to.params.label)) next()
      else next({ name: 'error-404' })
    },
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
    path: '/business-unit',
    name: 'business-unit',
    component: () => import('@/views/modules/business-units/SetUp.vue'),
    // meta: {
    //   except: ['client'],
    // },
  },
  {
    path: '/manage-rcm',
    name: 'manage-rcm',
    component: () => import('@/views/modules/RCSA/RCM.vue'),
    meta: {
      modules: ['rcsa'],
    },
  },
  {
    path: '/risk-library',
    name: 'risk-library',
    component: () => import('@/views/modules/RiskLibrary/index.vue'),
    // meta: {
    //   modules: ['rcsa'],
    // },
  },
  {
    path: '/risk-log',
    name: 'risk-log',
    component: () => import('@/views/modules/RCSA/RiskRegister.vue'),
    meta: {
      modules: ['rcsa'],
    },
  },
  // {
  //   path: '/manage-assets',
  //   name: 'manage-assets',
  //   component: () => import('@/views/modules/ManageAssets/index.vue'),
  // },
  // {
  //   path: '/risk-setup',
  //   name: 'risk-setup',
  //   component: () => import('@/views/modules/risk-assessment/ManageRisk.vue'),
  //   // meta: {
  //   //   except: ['client'],
  //   // },
  // },
  // {
  //   path: '/bia-setup',
  //   name: 'bia-setup',
  //   component: () => import('@/views/modules/BIA/SetUp.vue'),
  //   meta: {
  //     modules: ['bia'],
  //   },
  // },
  // {
  //   path: '/client-projects',
  //   name: 'client-projects',
  //   component: () => import('@/views/modules/projects/ClientProjects.vue'),
  //   meta: {
  //     permissions: ['read-client project'],
  //   },
  // },

  {
    path: '/manage-projects',
    name: 'manage-projects',
    component: () => import('@/views/modules/projects/ClientProjects.vue'),
    meta: {
      permissions: ['manage-client-projects'],
      roles: ['admin'],
    },
  },
  // {
  //   path: '/manage-projects',
  //   name: 'manage-projects',
  //   component: () => import('@/views/modules/projects/ManageProjects.vue'),
  //   meta: {
  //     // permissions: ['manage-client-projects'],
  //     roles: ['admin'],
  //   },
  // },
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
    path: '/document-templates',
    name: 'document-templates',
    component: () => import('@/views/modules/app-setup/DocumentTemplates.vue'),
    meta: {
      // permissions: ['read-evidence'],
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
    path: '/client-feedback-form',
    name: 'client-feedback-form',
    component: () => import('@/views/modules/app-setup/FeedBackForm.vue'),
    meta: {
      // permissions: ['manage-client-feedback'],
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
    path: '/units',
    name: 'units',
    component: () => import('@/views/modules/app-setup/Consultings.vue'),
    meta: {
      permissions: ['read-unit'],
    },
  },
  {
    path: '/vdd-questions',
    name: 'vdd-questions',
    component: () => import('@/views/modules/DUE-DILIGENCE/ManageDefaultQuestions.vue'),
    meta: {
      roles: ['super'],
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
    path: '/manage-packages',
    name: 'ManagePakages',
    component: () => import('@/views/modules/packages/index.vue'),
    meta: {
      roles: ['super'],
    },
  },
  {
    path: '/document-editor',
    name: 'DocumentEditor',
    component: () => import('@/views/components/editors/VueDocumentEditor.vue'),
    meta: {
      // roles: ['super'],
    },
  },
  {
    path: '/spreadsheet-editor',
    name: 'SpreadsheetEditor',
    component: () => import('@/views/components/editors/VueSpreadsheetEditor.vue'),
    meta: {
      // roles: ['super'],
    },
  },
  {
    path: '/activated-modules',
    name: 'ActivatedModules',
    component: () => import('@/views/modules/packages/ActivatedModule.vue'),
    meta: {
      roles: ['partner'],
    },
  },
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
    path: '/manage-partners',
    name: 'manage-partners',
    component: () => import('@/views/modules/user/Partners.vue'),
    meta: {
      permissions: ['read-partners'],
    },
  },
  {
    path: '/manage-client-users',
    name: 'manage-client-users',
    component: () => import('@/views/modules/user/ClientUsers.vue'),
    meta: {
      roles: ['admin'],
    },
  },
  {
    path: '/profile',
    component: () => import('@/views/modules/user/Profile.vue'),
    name: 'UserProfile',
  },
]
