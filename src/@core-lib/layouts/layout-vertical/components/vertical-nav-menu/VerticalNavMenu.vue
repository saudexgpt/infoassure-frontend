<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow no-print"
    :class="[
      { 'expanded': !isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered) },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light'
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area no-print"
      tagname="ul"
      @ps-scroll-y="evt => { shallShadowBottom = evt.srcElement.scrollTop > 0 }"
    >
      <!-- main menu header-->
      <!-- Uncomment this if you want the logo part to have background color-->
      <!-- <div
      class="navbar-header expanded no-print"
      :style="'background: ' + school.sidebar_bg"
    > -->
      <div
        class="navbar-header expanded no-print"
      >
        <slot
          name="header"
          :toggleVerticalMenuActive="toggleVerticalMenuActive"
          :toggleCollapsed="toggleCollapsed"
          :collapseTogglerIcon="collapseTogglerIcon"
        >
          <ul
            class="nav navbar-nav flex-row"
          >

            <!-- Logo & Text -->
            <li
              class="nav-item mr-auto"
            >
              <b-link
                class="navbar-brand"
                to="/"
              >
                <div class="school-logo">
                  <img
                    align="center"
                    :src="baseServerUrl +'storage/'+ logo"
                    alt="logo"
                  >
                </div>
              </b-link>
            </li>

          <!-- Toggler Button -->
          <!-- <li class="nav-item nav-toggle">
            <b-link class="nav-link modern-nav-toggle">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none"
                @click="toggleVerticalMenuActive"
              />
              <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon"
                @click="toggleCollapsed"
              />
            </b-link>
          </li> -->
          </ul>
        </slot>
      </div>
      <!-- / main menu header-->

      <!-- Shadow -->
      <div
        :class="{'d-block': shallShadowBottom}"
        class="shadow-bottom no-print"
      />

      <!-- main menu content-->

      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main"
      />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { BLink } from 'bootstrap-vue'
import { provide, computed, ref } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import { $themeConfig } from '@themeConfig'
import navMenuItems from '@/navigation/vertical'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import useVerticalNavMenu from './useVerticalNavMenu'

export default {
  components: {
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BLink,
    // BImg,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const dialogVisible = ref(false)
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props)

    const { skin } = useAppConfig()

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false)

    provide('isMouseHovered', isMouseHovered)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 100,
      wheelPropagation: true,
    }

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'))

    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    return {
      dialogVisible,
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,

      // App Name
      appName,
      appLogoImage,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    logo() {
      return this.$store.getters.userData.logo
    },
  },
  methods: {
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>

<style scoped>
.main-menu .navbar-header {
  height: 100%;
  width: 260px;
  height: 9rem;
  position: relative;
  text-align: center;
  transition: 300ms ease all, background 0s;
}
.school-logo {
  width: 220px;
  height: 6rem;
}

img {
  max-width: 100%;
  max-height: 100%;
}
</style>
