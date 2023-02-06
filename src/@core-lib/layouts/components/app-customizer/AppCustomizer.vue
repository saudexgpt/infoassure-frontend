<template>
  <div
    class="customizer d-none d-md-block"
    :class="{'open': isCustomizerOpen}"
  >
    <!-- Toggler -->
    <b-link
      class="customizer-toggle d-flex align-items-center justify-content-center"
      @click="isCustomizerOpen = !isCustomizerOpen"
    >
      <feather-icon
        icon="SettingsIcon"
        size="15"
        class="spinner"
      />
    </b-link>
    <!-- /Toggler -->

    <!-- Header -->
    <div class="customizer-section d-flex justify-content-between align-items-center">
      <div>
        <h4 class="text-uppercase mb-0">
          Theme Customizer
        </h4>
        <small>Customize &amp; Preview in Real Time</small>
      </div>
      <feather-icon
        icon="XIcon"
        size="18"
        class="cursor-pointer"
        @click="isCustomizerOpen = !isCustomizerOpen"
      />
    </div>
    <!-- Header -->
    <div class="customizer-section">
      Used Disk Space: {{ userData.used_space }} of {{ school.disk_space }}GB
      <el-progress :percentage="userData.percentage_used_space" />
    </div>
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="ps-customizer-area scroll-area"
    >
      <!-- Logo Update -->
      <div
        v-if="school"
        class="customizer-section"
      >
        <span class="school-logo">
          <b-img
            align="center"
            :src="baseServerUrl +'storage/'+ school.logo"
            alt="logo"
            width="220"
          />
        </span>
        <!-- <el-upload
          ref="upload"
          class="upload-demo"
          action="/"
          :auto-upload="false"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >
            Select School Logo
          </el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >
            Upload to server
          </el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            jpg/png files with a size less than 500kb
          </div>
        </el-upload> -->
        <b-form-group
          label="Change Logo"
        >
          <input
            type="file"
            class="form-control"
            @change="onImageChange"
          >
        </b-form-group>
      </div>
      <!-- Skin, RTL, Router Animation -->
      <!-- <div class="customizer-section">

        <b-form-group label="Skin">
          <b-form-radio-group
            id="skin-radio-group"
            v-model="skin"
            name="skin"
            :options="skinOptions"
          />
        </b-form-group>

        <b-form-group label="Content Width">
          <b-form-radio-group
            id="content-width-radio-group"
            v-model="contentWidth"
            name="content-width"
            :options="contentWidthOptions"
          />
        </b-form-group>
        <b-form-group
          label="Router Transition"
          label-cols="6"
        >
          <v-select
            v-model="routerTransition"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :clearable="false"
            label="title"
            :options="routerTransitionOptions"
            :reduce="option => option.value"
          />
        </b-form-group>
      </div> -->
      <!-- /Skin, RTL, Router Animation -->

      <!-- SECTION: Menu -->
      <!-- <div class="customizer-section">

        <b-form-group
          label="Menu Layout"
        >
          <b-form-radio-group
            v-model="layoutType"
            name="layout-type"
            :options="layoutTypeOptions"
          />
        </b-form-group>
        <div
          v-if="layoutType === 'vertical'"
          class="d-flex justify-content-between align-items-center mt-2"
        >
          <span class="font-weight-bold">Menu Collapsed</span>
          <b-form-checkbox
            v-model="isVerticalMenuCollapsed"
            name="is-vertical-menu-collapsed"
            class="mr-0"
            switch
            inline
          />
        </div>

        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="font-weight-bold">Menu Hidden</span>
          <b-form-checkbox
            v-model="isNavMenuHidden"
            name="is-menu-visible"
            class="mr-0"
            switch
            inline
          />
        </div>

      </div> -->

      <!-- SECTION: Navbar -->
      <div class="customizer-section">

        <!-- Navbar Color -->
        <b-form-group
          v-show="layoutType === 'vertical'"
          label="Change Navbar Color"
        >
          <el-color-picker
            v-model="navbar_color"
            show-alpha
            :predefine="predefineColors"
            @change="setNavbarColor()"
          />
        </b-form-group>

        <!-- Sidebar Color -->
        <b-form-group
          v-show="layoutType === 'vertical'"
          label="Change Side Menu Color"
        >
          <el-color-picker
            v-model="sidebar_color"
            show-alpha
            :predefine="predefineColors"
            @change="setSidebarColor()"
          />
        </b-form-group>

        <!-- Navbar Type -->
        <!-- <b-form-group :label="layoutType === 'vertical' ? 'Navbar Type' : 'Menu Type'">
          <b-form-radio-group
            v-model="navbarType"
            name="navbar-type"
            :options="navbarTypes"
          />
        </b-form-group> -->
      </div>

      <!-- SECTION: Footer -->
      <!-- <div class="customizer-section">
        <b-form-group label="Footer Type">
          <b-form-radio-group
            v-model="footerType"
            name="footer-type"
            :options="footerTypes"
          />
        </b-form-group>
      </div> -->
    </vue-perfect-scrollbar>
  </div>
</template>

<script>
import {
  BLink, BImg, BFormGroup, /* BFormCheckbox, BFormRadioGroup */
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import useAppCustomizer from './useAppCustomizer'
import Resource from '@/api/resource'

export default {
  components: {
    // BSV
    BLink,
    BImg,
    // BFormRadioGroup,
    // BFormCheckbox,
    BFormGroup,

    // 3rd party
    // vSelect,
    VuePerfectScrollbar,

  },
  data() {
    return {
      navbar_color: '',
      sidebar_color: '',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ],
    }
  },
  setup() {
    const {
      // Vertical Menu
      isVerticalMenuCollapsed,

      // Customizer
      isCustomizerOpen,

      // Skin
      skin,
      skinOptions,

      // Content Width
      contentWidth,
      contentWidthOptions,

      // RTL
      isRTL,

      // routerTransition
      routerTransition,
      routerTransitionOptions,

      // Layout Type
      layoutType,
      layoutTypeOptions,

      // NavMenu Hidden
      isNavMenuHidden,

      // Navbar
      navbarColors,
      navbarTypes,
      navbarBackgroundColor,
      navbarType,

      // Footer
      footerTypes,
      footerType,
    } = useAppCustomizer()

    if (layoutType.value === 'horizontal') {
      // Remove semi-dark skin option in horizontal layout
      const skinSemiDarkIndex = skinOptions.findIndex(s => s.value === 'semi-dark')
      delete skinOptions[skinSemiDarkIndex]

      // Remove menu hidden radio in horizontal layout => As we already have switch for it
      const menuHiddneIndex = navbarTypes.findIndex(t => t.value === 'hidden')
      delete navbarTypes[menuHiddneIndex]
    }

    // Perfect Scrollbar
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    const logoToBeUploaded = ''
    return {
      // Vertical Menu
      isVerticalMenuCollapsed,

      // Customizer
      isCustomizerOpen,

      // Skin
      skin,
      skinOptions,

      // Content Width
      contentWidth,
      contentWidthOptions,

      // RTL
      isRTL,

      // routerTransition
      routerTransition,
      routerTransitionOptions,

      // Layout Type
      layoutType,
      layoutTypeOptions,

      // NavMenu Hidden
      isNavMenuHidden,

      // Navbar
      navbarColors,
      navbarTypes,
      navbarBackgroundColor,
      navbarType,

      // Footer
      footerTypes,
      footerType,

      // Perfect Scrollbar
      perfectScrollbarSettings,

      logoToBeUploaded,
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    },
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    school() {
      return this.$store.getters.userData.school
    },
  },
  created() {
    this.navbar_color = this.school.navbar_bg
    this.sidebar_color = this.school.sidebar_bg
  },
  methods: {
    onImageChange(e) {
      const app = this
      // console.log(e)
      // eslint-disable-next-line prefer-destructuring
      app.logoToBeUploaded = e.target.files[0]

      app.submitUpload()
    },
    submitUpload() {
      const app = this
      const formData = new FormData()
      formData.append('sch_logo', app.logoToBeUploaded)
      const updateLogResource = new Resource('school-setup/update-logo')
      updateLogResource.store(formData)
        .then(response => {
          app.$store.dispatch('user/updateSchoolLogo', response)
        })
        .catch(e => {
          app.$message(e.response.message)
        })
    },
    setNavbarColor() {
      const app = this
      const formData = { navbar_bg: this.navbar_color }
      const updateLogResource = new Resource('school-setup/update-color')
      this.$store.dispatch('user/updateNavbarColor', this.navbar_color)
      updateLogResource.update(app.school.id, formData)
        .then(() => {
        })
        .catch(e => {
          app.$message(e.response.message)
        })
    },
    setSidebarColor() {
      const app = this
      const formData = { sidebar_bg: this.sidebar_color }
      const updateLogResource = new Resource('school-setup/update-color')
      this.$store.dispatch('user/updateSidebarColor', this.sidebar_color)
      updateLogResource.update(app.school.id, formData)
        .then(() => {
        })
        .catch(e => {
          app.$message(e.response.message)
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/components/variables-dark';

.customizer-section {
  padding: 1.5rem;
    border-bottom: 1px solid #ebe9f1;

  .dark-layout & {
    border-color: $theme-dark-border-color;
  }

  #skin-radio-group ::v-deep {
    .custom-control-inline {
      margin-right: 0.7rem;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;;
    &:last-of-type {
    margin-bottom: 0;
    }
    ::v-deep legend {
      font-weight: 500;
    }
  }
}

.mark-active {
  box-shadow: 0 0 0 0.2rem rgba(38,143,255,.5);
}

.ps-customizer-area {
  height: calc(100% - 83px)
}
</style>
