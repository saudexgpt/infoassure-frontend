import router from './router'
import store from '@/VuexStore'
// import { useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
// import { useUserStoreWithOut } from '@/store/modules/user'
// import store from '@/VuexStore'
import { getToken } from '@/utils/auth'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  if (
    to.path === '/bia' ||
    to.path === '/vdd' ||
    to.path === '/vdd/mailbox/inbox' ||
    to.path === '/vdd/mailbox/sent'
  ) {
    store.dispatch('user/loadOtherUserData')
    next()
  } else {
    const permissionStore = usePermissionStoreWithOut()
    // console.log(permissionStore)
    // const appStore = useAppStoreWithOut()
    // const userStore = useUserStoreWithOut()
    const hasToken = getToken()
    if (hasToken) {
      // console.log(userData)
      if (to.path === '/login') {
        next({ path: '/dashboard' })
        return
      } else {
        if (permissionStore.getIsAddRouters) {
          // store.dispatch('clients/fetchClients')
          next()
        } else {
          await store.dispatch('user/getInfo')
          const { userData } = store.getters
          const { roles, permissions, modules } = userData
          await permissionStore.generateRoutes(roles, permissions, modules)
          if (roles.includes('admin') || roles.includes('client')) {
            store.dispatch('clients/fetchClients')
          }
          permissionStore.getAddRouters.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
          })
          const redirectPath = from.query.redirect || to.path
          const redirect = decodeURIComponent(redirectPath as string)
          const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
          permissionStore.setIsAddRouters(true)
          try {
            next(nextData)
          } catch (error) {
            // remove token and go to login page to re-login
            store.dispatch('user/resetToken')
            // router.push({ path: '/login', query: { to: to.path } }).catch(() => { })
            next(`/login?redirect=${to.path}`)
          }
        }
      }
    } else {
      if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
        next()
      } else {
        const url = to.path.split('/')
        if (url.includes('confirm-registration') || url.includes('reset-password')) {
          next()
        } else {
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
