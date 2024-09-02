// import navMenuItems from '@/navigation/vertical'
import store from '@/store'

import dashboard from '@/navigation/vertical/nav-modules/dashboard'
import appSetup from '@/navigation/vertical/nav-modules/app-setup'
import links from '@/navigation/vertical/nav-modules/links'
import adminSettings from '@/navigation/vertical/nav-modules/admin-settings'
import riskAssessment from '@/navigation/vertical/nav-modules/risk-assessment'
import userManagement from '@/navigation/vertical/nav-modules/user-management'

import Resource from '@/api/resource'

const state = {
  navMenuItems: [],
  availableModules: [],
  clientActivatedProjects: [],
  clientActivatedModules: [],
}

const mutations = {
  // eslint-disable-next-line no-shadow
  SET_NAV_ITEMS(state, navMenuItems) {
    state.navMenuItems = navMenuItems
  },
  // eslint-disable-next-line no-shadow
  SET_MODULES(state, modules) {
    state.availableModules = modules
  },
  // eslint-disable-next-line no-shadow
  SET_CLIENT_ACTIVATED_PROJECTS(state, projects) {
    state.clientActivatedProjects = projects
  },
  // eslint-disable-next-line no-shadow
  SET_CLIENT_ACTIVATED_MODULES(state, modules) {
    state.clientActivatedModules = modules
  },
}

const actions = {
  setNavItems({ commit }) {
    const { availableModules } = store.getters
    const navMenuItems = [...dashboard, ...appSetup, ...availableModules, ...riskAssessment, ...links, ...userManagement, ...adminSettings]
    commit('SET_NAV_ITEMS', navMenuItems)
  },
  fetchActivatedModules({ commit }, client) {
    return new Promise((resolve, reject) => {
      const fetchCriteriaResource = new Resource('fetch-client-activated-projects')
      fetchCriteriaResource.get(client.id)
        .then(response => {
          commit('SET_CLIENT_ACTIVATED_PROJECTS', response.projects)
          commit('SET_CLIENT_ACTIVATED_MODULES', response.activated_modules)
          const modules = []
          response.projects.forEach(project => {
            const availableModule = project.available_module
            if (availableModule) {
              modules.push({
                title: availableModule.name,
                icon: 'PackageIcon',
                acl: {
                  modules: [availableModule.slug],
                },
                children: [
                  {
                    title: 'Dashboard',
                    route: `${availableModule.slug}-dashboard`,
                  },
                  {
                    title: 'Activities',
                    route: `manage-${availableModule.slug}`,
                  },
                  {
                    title: 'Reports',
                    route: `${availableModule.slug}-report`,
                  },
                ],
              })
            }
          })
          // if (modules.length === 1) {
          //   modules.unshift({ header: 'Active Module' })
          // }
          // if (modules.length > 1) {
          //   modules.unshift({ header: 'Active Modules' })
          // }
          commit('SET_MODULES', modules)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  // fetchAvailableModules({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     const fetchModulesResource = new Resource('fetch-available-modules')
  //     fetchModulesResource.list()
  //       .then(response => {
  //         const modules = []
  //         response.modules.forEach(availableModule => {
  //           modules.push({
  //             title: availableModule.name,
  //             icon: 'PackageIcon',
  //             acl: {
  //               modules: [availableModule.slug],
  //             },
  //             children: [
  //               {
  //                 title: 'Dashboard',
  //                 route: `${availableModule.slug}-dashboard`,
  //               },
  //               {
  //                 title: 'Activities',
  //                 route: `manage-${availableModule.slug}`,
  //               },
  //               {
  //                 title: 'Reports',
  //                 route: `${availableModule.slug}-report`,
  //               },
  //             ],
  //           })
  //         })
  //         commit('SET_MODULES', modules)
  //         resolve(response)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
