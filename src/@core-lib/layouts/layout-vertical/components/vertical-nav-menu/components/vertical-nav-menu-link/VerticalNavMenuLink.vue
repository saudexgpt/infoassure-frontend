<template>
  <li
    v-if="canViewVerticalNavMenuLink(item)"
    class="nav-item"
    :class="{
      'active': isActive,
      'disabled': item.disabled
    }"
  >
    <!-- <b-link
      v-if="isActive"
      v-bind="linkProps"
      class="d-flex align-items-center"
      :style="`background: ${sidebar_bg}; border: ${navbar_bg}; box-shadow: 0 0 1px 1px ${navbar_bg}; border-radius: 5px; padding: 5px 10px 5px 20px;`"
    > -->
    <b-link
      v-if="isActive"
      v-bind="linkProps"
      class="d-flex align-items-center"
      :style="`background: ${sidebar_bg}; border-radius: 5px;`"
    >
      <!-- <feather-icon :icon="item.icon || 'TargetIcon'" /> -->
      <i
        v-if="item.icon === 'HomeIcon'"
        class="el-icon-odometer"
      />
      <feather-icon
        v-else
        :icon="item.icon || ''"
      />

      <span class="menu-title text-truncate">{{ t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'primary'"
        class="mr-1 ml-auto"
      >
        {{ item.tag }}
      </b-badge>
    </b-link>
    <b-link
      v-else
      v-bind="linkProps"
      class="d-flex align-items-center"
    >
      <!-- <feather-icon :icon="item.icon || 'TargetIcon'" /> -->
      <i
        v-if="item.icon === 'HomeIcon'"
        class="el-icon-odometer"
      />
      <feather-icon
        v-else
        :icon="item.icon || ''"
      />
      <span class="menu-title text-truncate">{{ t(item.title) }}</span>
      <b-badge
        v-if="item.tag"
        pill
        :variant="item.tagVariant || 'primary'"
        class="mr-1 ml-auto"
      >
        {{ item.tag }}
      </b-badge>
    </b-link>
  </li>
</template>

<script>
// import { useUtils as useAclUtils } from '@core/libs/acl'
import { BLink, BBadge } from 'bootstrap-vue'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import useVerticalNavMenuLink from './useVerticalNavMenuLink'
import mixinVerticalNavMenuLink from './mixinVerticalNavMenuLink'

import Helper from '@/api/helper'

const loadHelper = new Helper()

export default {
  components: {
    BLink,
    BBadge,
  },
  mixins: [mixinVerticalNavMenuLink],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sidebar_bg() {
      return this.$store.getters.userData.sidebar_bg
    },
    navbar_bg() {
      return this.$store.getters.userData.navbar_bg
    },
  },
  setup(props) {
    const { isActive, linkProps, updateIsActive } = useVerticalNavMenuLink(props.item)
    const { t } = useI18nUtils()
    // const { canViewVerticalNavMenuLink } = useAclUtils()
    return {
      isActive,
      linkProps,
      updateIsActive,

      // ACL
      // canViewVerticalNavMenuLink,

      // i18n
      t,
    }
  },
  methods: {
    // ACL
    canViewVerticalNavMenuLink(item) {
      return loadHelper.canAccessLink(item, this.$store.getters.userData)
    },
  },
}
</script>
