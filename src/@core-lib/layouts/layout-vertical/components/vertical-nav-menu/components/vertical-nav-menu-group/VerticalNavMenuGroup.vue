<template>
  <li
    v-if="canViewVerticalNavMenuGroup(item)"
    class="nav-item has-sub"
    :class="{
      'open': isOpen,
      'disabled': item.disabled,
      'sidebar-group-active': isActive,
    }"
  >
    <b-link
      class="d-flex align-items-center"
      @click="() => updateGroupOpen(!isOpen)"
    >
      <i
        v-if="item.icon === 'HomeIcon'"
        class="el-icon-odometer"
      />
      <feather-icon
        v-else
        :icon="item.icon || 'TargetIcon'"
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
    <b-collapse
      v-model="isOpen"
      class="menu-content"
      tag="ul"
    >
      <component
        :is="resolveNavItemComponent(child)"
        v-for="child in item.children"
        :key="child.header || child.title"
        ref="groupChild"
        :item="child"
      />
    </b-collapse>
  </li>
</template>

<script>
import { BLink, BBadge, BCollapse } from 'bootstrap-vue'
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
// import { useUtils as useAclUtils } from '@core/libs/acl'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'

// Composition Function
import useVerticalNavMenuGroup from './useVerticalNavMenuGroup'
import mixinVerticalNavMenuGroup from './mixinVerticalNavMenuGroup'
import Helper from '@/api/helper'

const loadHelper = new Helper()

export default {
  name: 'VerticalNavMenuGroup',
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    BLink,
    BBadge,
    BCollapse,
  },
  mixins: [mixinVerticalNavMenuGroup],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    school() {
      return this.$store.getters.userData.school
    },
  },
  setup(props) {
    const {
      isOpen,
      isActive,
      updateGroupOpen,
      updateIsActive,
    } = useVerticalNavMenuGroup(props.item)

    const { t } = useI18nUtils()
    // const { canViewVerticalNavMenuGroup } = useAclUtils()

    return {
      resolveNavItemComponent,
      isOpen,
      isActive,
      updateGroupOpen,
      updateIsActive,

      // ACL
      // canViewVerticalNavMenuGroup,

      // i18n
      t,
    }
  },
  methods: {
    // ACL
    canViewVerticalNavMenuGroup(item) {
      return loadHelper.canAccessLink(item, this.$store.getters.userData)
    },
  },
}
</script>

<style>

</style>
