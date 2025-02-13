import { $themeBreakpoints } from '@themeConfig'

export default {
  namespaced: true,
  state: {
    windowWidth: 0,
    shallShowOverlay: false,
    baseServerUrl: process.env.VUE_APP_MIX_BASE_SERVER_URL,
    assessmentActivity: [
      { value: 'risk_assessment', label: 'Risk Assessment' },
      { value: 'soa', label: 'Statement Of Applicability (SOA)' },
      { value: 'bia', label: 'BIA' },
      { value: 'dpia', label: 'DPIA' },
      { value: 'ropa', label: 'RoPA' },
      { value: 'pda', label: 'PDA' },
    ],
    paystackKey: process.env.VUE_APP_MIX_PAYSTACK_API_KEY,
  },
  getters: {
    currentBreakPoint: state => {
      const { windowWidth } = state
      if (windowWidth >= $themeBreakpoints.xl) return 'xl'
      if (windowWidth >= $themeBreakpoints.lg) return 'lg'
      if (windowWidth >= $themeBreakpoints.md) return 'md'
      if (windowWidth >= $themeBreakpoints.sm) return 'sm'
      return 'xs'
    },
  },
  mutations: {
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val
    },
    TOGGLE_OVERLAY(state, val) {
      state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay
    },
  },
  actions: {
  },
}
