import router from '@/router'
// import store from './store'
import store from '@/VuexStore'
import { getToken, getUserRole } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

function setRoutes(userData) {
  const { roles, permissions, modules } = userData
  store.dispatch('permission/generateRoutes', { roles, permissions, modules }).then(routes => {
    // dynamically add accessible routes
    routes.forEach((route) => {
      router.addRoute(route) // 动态添加可访问路由表
    })
//     console.log(router)
  })
}
const whiteList = ['/login', '/login-as', '/bia', '/vdd', '/vdd/mailbox/inbox', '/vdd/mailbox/sent', '/account/suspended', '/register', '/forgot-password', '/maintenance'] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  if (to.path === '/bia' || to.path === '/vdd' || to.path === '/vdd/mailbox/inbox' || to.path === '/vdd/mailbox/sent') {
    store.dispatch('user/loadOtherUserData')
    next()
  } else {
    // set page title
    // document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
      const { userData } = store.getters
      if (to.path === '/login-as') {
        next()
      } else {
        const userRole = getUserRole()
        // console.log(userRole)
        // determine whether the user has an active role to login as
         
        if (userRole === 'empty') {
          next('/login-as')
        } else {
           
          if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
          } else {
            const hasRoles = userData.roles && userData.roles.length > 0
             
            if (hasRoles) {
              next()
              store.dispatch('clients/fetchClients')
            } else {
              try {
              // get user info
              // note: roles must be a object array! such as: ['admin'] or ,['manager','editor']
                const reloadedUserData = await store.dispatch('user/getInfo')
                // generate accessible routes map based on roles
                // const accessRoutes = await store.dispatch('permission/generateRoutes', roles, permissions);
                setRoutes(reloadedUserData)
                next({ ...to, replace: true })
              } catch (error) {
              // remove token and go to login page to re-login
                store.dispatch('user/resetToken')
                // router.push({ path: '/login', query: { to: to.path } }).catch(() => { })
                next(`/login?redirect=${to.path}`)
              }
            }
          }
        }
      }
    } else {
      /* has no token */
      // console.log(whiteList.indexOf(to.matched[0] ? to.matched[0].path : ''))
       
      if (whiteList.includes(to.path)) {
        // in the free login whitelist, go directly
        next()
      } else {
        const url = to.path.split('/')
        if (url.includes('confirm-registration')) {
          next()
        } else if (url.includes('reset-password')) {
          next()
        } else {
          // other pages that do not have permission to access are redirected to the login page.
          // router.push({ path: '/login', query: { to: to.path } }).catch(() => { })
          next('/login')
        }
      }
    }
  }
})
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
