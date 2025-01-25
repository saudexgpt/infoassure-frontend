import Resource from '@/api/resource'
import store from '@/store'

const state = {
  allClients: [],
  selectedClient: { id: null },
  partnerWithClients: [],
}

const mutations = {
  // eslint-disable-next-line no-shadow
  SET_CLIENTS(state, clients) {
    state.allClients = clients
  },
  // eslint-disable-next-line no-shadow
  SET_PARTNERS_CLIENTS(state, partnersWithCLients) {
    state.partnerWithClients = partnersWithCLients
  },
  // eslint-disable-next-line no-shadow
  SET_SELECTED_CLIENT(state, client) {
    state.selectedClient = client
  },
}

const actions = {
  // eslint-disable-next-line no-empty-pattern
  fetchClients({ commit }) {
    return new Promise((resolve, reject) => {
      const fetchCriteriaResource = new Resource('clients')
      fetchCriteriaResource.list({ option: 'all' })
        .then(response => {
          commit('SET_CLIENTS', response.clients)
          commit('SET_PARTNERS_CLIENTS', response.partner_with_clients)
          if (response.clients.length > 0) {
            commit('SET_SELECTED_CLIENT', response.clients[0])
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  storeRiskAssessment() {
    return new Promise((resolve, reject) => {
      const clientId = store.getters.selectedClient.id
      const fetchCriteriaResource = new Resource('risk-assessment/store-risk-assessment')
      fetchCriteriaResource.store({ client_id: clientId })
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  setSelectedClient({ commit }, client) {
    commit('SET_SELECTED_CLIENT', client)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
