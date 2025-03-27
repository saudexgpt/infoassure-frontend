import { useUtils as useI18nUtils } from '@core/libs/i18n'
import store from '@/store'
// import { useUtils as useAclUtils } from '@core/libs/acl'
import Helper from '@/api/helper'

const loadHelper = new Helper()

const { t } = useI18nUtils()
// const { canViewVerticalNavMenuHeader } = useAclUtils()

function canViewVerticalNavMenuHeader(item) {
  return loadHelper.canAccessLink(item, store.getters.userData)
}
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  render(h) {
    const span = h('span', {}, t(this.item.header))
    const icon = h('feather-icon', { props: { icon: 'MoreHorizontalIcon', size: '18' } })
    if (canViewVerticalNavMenuHeader(this.item)) {
      return h('li', { class: 'navigation-header text-truncate' }, [span, icon])
    }
    return h()
  },
}
