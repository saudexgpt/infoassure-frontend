<script setup lang="ts">
import { LoginForm, OTPForm } from './components'
// import { ThemeSwitch } from '@/components/ThemeSwitch'
// import { LocaleDropdown } from '@/components/LocaleDropdown'
import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
import { ElScrollbar } from 'element-plus'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const { t } = useI18n()

const viewType = ref('login')
const userId = ref(undefined)

const toggleView = (view) => {
  viewType.value = view
}
const setUserId = (val) => {
  userId.value = val
  console.log(val)
}
</script>

<template>
  <div
    :class="prefixCls"
    class="h-[100%] relative lt-xl:bg-[var(--login-bg-color)] lt-sm:px-10px lt-xl:px-10px lt-md:px-10px"
  >
    <ElScrollbar class="h-full">
      <div class="relative flex mx-auto min-h-100vh">
        <div
          :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden`"
        >
          <div class="flex items-center relative text-white">
            <img src="@/assets/imgs/logo-full-light.png" alt="" />
            <!-- <span class="text-40px font-bold">{{ underlineToHump(appStore.getTitle) }}</span> -->
          </div>
          <div class="flex justify-center items-center h-[calc(100%-60px)]">
            <TransitionGroup
              appear
              tag="div"
              enter-active-class="animate__animated animate__bounceInLeft"
            >
              <img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="w-450px" />
              <div class="text-3xl text-white italic" key="2">{{ t('login.welcome') }}</div>
              <!-- <div class="mt-5 font-normal text-white text-14px" key="3">
                {{ t('login.message') }}
              </div> -->
            </TransitionGroup>
          </div>
        </div>
        <div class="flex-1 p-30px lt-sm:p-10px dark:bg-[var(--login-bg-color)] relative">
          <div
            class="flex justify-between items-center text-white at-2xl:justify-end at-xl:justify-end"
          >
            <div class="flex items-center at-2xl:hidden at-xl:hidden">
              <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
              <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
            </div>

            <!-- <div class="flex justify-end items-center space-x-10px">
              <ThemeSwitch />
              <LocaleDropdown class="lt-xl:text-white dark:text-white" />
            </div> -->
          </div>
          <Transition appear enter-active-class="animate__animated animate__bounceInRight">
            <div
              class="h-full items-center m-auto w-[100%] at-2xl:max-w-500px at-xl:max-w-500px at-md:max-w-500px at-lg:max-w-500px"
            >
              <LoginForm
                v-if="viewType === 'login'"
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
                @to-otp="toggleView('otp')"
                @loggedInUserId="setUserId"
              />
              <OTPForm
                v-if="viewType === 'otp'"
                :user-id="userId"
                class="p-20px h-auto m-auto lt-xl:rounded-3xl lt-xl:light:bg-white"
              />
            </div>
          </Transition>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-login';

.@{prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
</style>
