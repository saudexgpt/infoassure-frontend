export default [
  {
    title: 'Risk Management',
    icon: 'AlertTriangleIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    // acl: {
    //   roles: ['super'],
    // },
    children: [
      {
        title: 'Risk Assessment',
        route: 'risk-assessment',
        acl: {
          // modules: ['bia'],
          // except: ['client'],
        },
      },
    ],
  },
]
