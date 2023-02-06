<template>
  <layout-vertical>

    <router-view />

    <app-customizer
      v-if="roles.includes('admin')"
      slot="customizer"
    />

  </layout-vertical>
</template>

<script>
// import axios from 'axios'
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue'
import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    AppCustomizer,
    LayoutVertical,
  },
  data() {
    return {
      showCustomizer: $themeConfig.layout.customizer,
    }
  },
  computed: {
    roles() {
      return this.$store.getters.userData.roles
    },
  },
}
</script>
