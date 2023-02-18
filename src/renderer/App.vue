<template>
  <Icons/>
  <n-config-provider :theme-overrides="themeOverrides">
<!--    <n-dialog-provider>-->
      <component :is="currentComponent()"/>
<!--    </n-dialog-provider>-->
  </n-config-provider>
</template>

<script setup>
import {computed} from "vue";
import {NConfigProvider} from "naive-ui";

import Icons from "@/components/main/Icons.vue";
import MainWindow from "@/components/main/MainWindow.vue";
import SettingContainer from "@/components/settings/Setting.vue";

import {useUserStore} from "@/pinia/UserStore";
import {usePalettes} from "@/hooks/useColor";
import {useColorStore} from "@/pinia/ColorStore";

const userStore = useUserStore()
const colorStore = useColorStore()

/**
 * 默认主题覆盖
 *
 // * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = computed(() => {
  return {
    common: {
      primaryColor: colorStore.PRIMARY,
      primaryColorHover: colorStore.BASE5,
      primaryColorPressed: colorStore.BASE7,
      primaryColorSuppl: colorStore.BASE5,
      hoverColor: colorStore.BASE2
    },
  }
})

// 获取配置并注入 pinia
IPC_API
    .takeLocalData({path: 'root'})
    .then(data => {
      userStore.$patch(data)
      const primaryColor = userStore.theme.primaryColor
      const darkMode = userStore.theme.darkMode
      const colors = usePalettes(primaryColor, darkMode)
      console.log({colors})
      colorStore.$patch(colors)
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