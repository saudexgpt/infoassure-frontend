export default [
  {
    title: 'Account',
    icon: 'CreditCardIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      modules: ['account'],
      except: ['super', 'parent'],
    },
    children: [
      {
        title: 'Fees Settings',
        route: 'FeeSettings',
        acl: {
          modules: ['account'],
          permissions: ['can view fees settings'],
        },
      },
      {
        title: 'Fee Payments',
        route: 'FeePayments',
        acl: {
          modules: ['account'],
          permissions: ['can view fees payments'],
        },
      },
      {
        title: 'My Fees',
        route: 'StudentFees',
        acl: {
          modules: ['account'],
          roles: ['student'],
        },
      },
    ],
  },
]
