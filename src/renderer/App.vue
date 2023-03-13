<template>
  <Icons/>
  <n-config-provider
      :theme="customTheme"
      :theme-overrides="themeOverrides">
    <component :is="currentComponent()" :style="themeStore.cssVariable"/>
  </n-config-provider>
</template>

<script setup>
import {computed} from "vue";
import {NConfigProvider, darkTheme} from "naive-ui";
import Icons from "@/components/main/Icons.vue";
import MainWindow from "@/components/main/MainWindow.vue";
import SettingContainer from "@/components/settings/Setting.vue";
import {useUserStore} from "@/pinia/UserStore";
import {useThemeStore} from "@/pinia/ThemeStore";
import {IPC_API} from "@/hooks/useIPC";

const userStore = useUserStore()
const themeStore = useThemeStore()

const customTheme = computed(() => {
  return themeStore.$state.darkMode ? darkTheme : undefined
})


/**
 * 默认主题覆盖
 *
 // * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = computed(() => {
  console.log('1231231')
  return {
    common: {
      primaryColor: themeStore.color.primary,
      primaryColorHover: themeStore.color.BASE5,
      hoverColor: themeStore.color.focused,
      primaryColorSuppl: themeStore.color.BASE8,
    }
  }
})

// 获取配置并注入 pinia
IPC_API
    .takeLocalData({path: 'root'})
    .then(data => {
      userStore.$patch(data)
      const primaryColor = userStore.theme.primaryColor
      const darkMode = userStore.theme.darkMode
      themeStore.patchColor(primaryColor, darkMode)
      themeStore.$patch({darkMode})
    })

const currentComponent = () => {
  let route = location.pathname
  if (route === '/') {
    return MainWindow
  }
  if (route === '/setting') {
    return SettingContainer
  }
}

</script>
