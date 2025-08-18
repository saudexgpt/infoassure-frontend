<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import LockDialog from './components/LockDialog.vue'
import { ref, computed } from 'vue'
import LockPage from './components/LockPage.vue'
import { useLockStore } from '@/store/modules/lock'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import store from '@/VuexStore'
import LoginAs from '@/views/modules/user/LoginAs.vue'

const { push } = useRouter()

const userStore = useUserStore()

const lockStore = useLockStore()

const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const logOut = async () => {
  await store.dispatch('user/logout')
  push('/login').catch(() => {})
}

const dialogVisible = ref<boolean>(false)
const showModal = ref<boolean>(false)
// 锁定屏幕
const lockScreen = () => {
  dialogVisible.value = true
}

const toDocument = () => {
  window.open('https://element-plus-admin-doc.cn/')
}

const toPage = (path: string) => {
  push(path)
}
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img
        :src="store.getters.baseServerUrl + 'storage/' + store.getters.userData.photo"
        alt="Photo"
        onerror="this.src='/images/profile-image.png'"
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">
        {{ store.getters.userData.name }}<br />
        <small>
          <em>Role: {{ store.getters.userData.login_as.toUpperCase() }}</em>
        </small>
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="$router.push('/user/profile').catch(() => {})"> Profile </div>
        </ElDropdownItem>
        <ElDropdownItem>
          <div @click="showModal = true"> Change Role </div>
        </ElDropdownItem>
        <!-- <ElDropdownItem>
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided>
          <div @click="lockScreen">{{ t('lock.lockScreen') }}</div>
        </ElDropdownItem> -->
        <ElDropdownItem>
          <div @click="logOut">{{ t('common.logOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />
  <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport>
  <el-dialog title="Change Role" v-model="showModal" width="30%">
    <LoginAs />
  </el-dialog>
</template>

<style scoped lang="less">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
