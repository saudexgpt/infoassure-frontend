/* eslint-disable no-shadow */
import {
  login, logout, register, getInfo, updatePassword, confirmOTP,
} from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
// import store from '@/store'

const state = {
  id: '',
  token: getToken(),
  userData: {
    id: '',
    name: '',
    email: '',
    phone: '',
    introduction: '',
    modules: [],
    roles: [],
    permissions: [],
    p_status: '',
    notifications: [],
    password_status: '',
    unreadNotificationCount: 0,
    suspended_for_nonpayment: 0,
    system_set_session: '',
    system_set_term: '',
    school: {
      current_session: {
        name: '',
      },
      current_term: {
        name: '',
      },
    },
    student: '',
    whatsapp_no: '2348160295559',
  },
}

const mutations = {
  SET_USER_DATA(state, objValue) {
    Object.assign(state.userData, objValue)
  },
  UPDATE_SCHOOL_LOGO(state, logo) {
    state.userData.school.logo = logo
  },
  UPDATE_NAVBAR_COLOR(state, color) {
    state.userData.school.navbar_bg = color
  },
  UPDATE_SIDEBAR_COLOR(state, color) {
    state.userData.school.sidebar_bg = color
  },

  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_ID(state, id) {
    state.id = id
  },
  SET_NOTIFICATIONS: (state, notifications) => {
    state.userData.notifications = notifications
  },
  SET_UNREADNOTIFICATION_COUNT: (state, count) => {
    state.userData.unreadNotificationCount += count
  },
  ADD_NEW_NOTIFICATION: (state, notification) => {
    state.userData.notifications.unshift(notification)
  },
}

const actions = {
  addNewNotifications({ commit }, notification) {
    commit('ADD_NEW_NOTIFICATION', notification)
  },
  updateSchoolLogo({ commit }, logo) {
    commit('UPDATE_SCHOOL_LOGO', logo)
  },
  updateNavbarColor({ commit }, color) {
    commit('UPDATE_NAVBAR_COLOR', color)
  },
  updateSidebarColor({ commit }, color) {
    commit('UPDATE_SIDEBAR_COLOR', color)
  },
  setNotifications({ commit }, notifications) {
    commit('SET_NOTIFICATIONS', notifications)
  },
  setUnreadNotificationCount({ commit }, count) {
    commit('SET_UNREADNOTIFICATION_COUNT', count)
  },
  // user login
  register(userInfo) {
    // const { name, email, password, c_password } = userInfo;
    return new Promise((resolve, reject) => {
      register(userInfo)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // eslint-disable-next-line no-empty-pattern
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then(response => {
          if (response.tk) {
            commit('SET_USER_DATA', response.data)
            commit('SET_TOKEN', response.tk)
            commit('SET_ID', response.data.id)
            setToken(response.tk)
          }
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  confirmOTP({ commit }, data) {
    const { id, token } = data
    return new Promise((resolve, reject) => {
      confirmOTP(id, { token })
        .then(response => {
          commit('SET_USER_DATA', response.data)
          commit('SET_TOKEN', response.tk)
          commit('SET_ID', response.data.id)
          setToken(response.tk)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('Verification failed, please Login again.')
          }
          const { roles } = data
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('getInfo: roles must be a non-null array!')
          }
          // console.log(data)
          commit('SET_USER_DATA', data)
          commit('SET_ID', data.id)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // eslint-disable-next-line no-empty-pattern
  updatePassword({}, data) {
    return new Promise((resolve, reject) => {
      updatePassword(data)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit }) {
    commit('SET_USER_DATA', '')
    removeToken()
    resetRouter()
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_USER_DATA', '')
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  loginAsUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      logout(userId)
        .then(response => {
          commit('SET_USER_DATA', response)
          commit('SET_TOKEN', response.tk)
          setToken(response.tk)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  loginToASchool({ commit }, schoolId) {
    return new Promise((resolve, reject) => {
      logout(schoolId)
        .then(response => {
          commit('SET_USER_DATA', response)
          commit('SET_TOKEN', response.tk)
          setToken(response.tk)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
