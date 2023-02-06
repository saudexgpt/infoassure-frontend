export default [
  // {
  //   header: 'App Settings',
  //   acl: {
  //     roles: ['super'],
  //   },
  // },
  {
    title: 'Manage Schools',
    icon: 'TrelloIcon',
    route: 'schools',
    acl: {
      permissions: ['can view all schools', 'can manage schools', 'can register schools'],
    },
    children: [
      {
        title: 'All Schools',
        route: 'schools',
        acl: {
          permissions: ['can view all schools', 'can manage schools'],
        },
      },
      {
        title: 'My Schools',
        route: 'my-schools',
        acl: {
          permissions: ['can register schools'],
          except: ['can manage schools'],
        },
      },
      {
        title: 'Register Schools',
        route: 'register-schools',
        acl: {
          permissions: ['can manage schools', 'can register schools'],
        },
      },
    ],
  },

]
