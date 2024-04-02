<template>
  <p class="clearfix mb-0 no-print">

    <span class="float-md-right d-none d-md-block">
      Product of: <b-link
        class="ml-25"
        :href="companyUrl"
        target="_blank"
      >{{ appName }}</b-link> © {{ new Date().getFullYear() }}
      <!-- <feather-icon
        icon="HeartIcon"
        size="21"
        class="text-danger stroke-current"
      /> -->
    </span>
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BLink,
  },
  setup() {
    // App Name
    const { appName, appLogoImage, companyUrl } = $themeConfig.app

    return {
      // App Name
      appName,
      appLogoImage,
      companyUrl,
    }
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
  },
  methods: {
  },
}
</script>
