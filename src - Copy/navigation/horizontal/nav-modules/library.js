export default [
  // {
  //   header: 'Attendance Module',
  //   // acl: {
  //   //   roles: ['admin'],
  //   // },
  // },
  {
    title: 'Library',
    icon: 'LayersIcon',
    // tag: '2',
    // tagVariant: 'light-warning',
    acl: {
      modules: ['library'],
      except: ['super', 'parent'],
    },
    children: [
      {
        title: 'Manage Books',
        route: 'LibraryBooks',
        acl: {
          modules: ['library'],
          roles: ['librarian'],
        },
      },
      // {
      //   title: 'Add Book',
      //   route: 'AddBook',
      //   acl: {
      //     modules: ['library'],
      //     roles: ['librarian'],
      //   },
      // },
      {
        title: 'Available Books',
        route: 'AvailableBooks',
        acl: {
          modules: ['library'],
          except: ['super', 'parent', 'librarian'],
        },
      },
      {
        title: 'Borrowed Books',
        route: 'BorrowedBooks',
        acl: {
          modules: ['library'],
          except: ['super', 'parent', 'librarian'],
        },
      },
    ],
  },
]
