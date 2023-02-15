<template>
  <Icons/>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout has-sider style="border-radius: 5px;">
      <n-layout-sider class="side-menu-bar">
        <side-bar/>
      </n-layout-sider>
      <n-layout>
        <n-layout-header class="top-search-bar">
          <top-bar/>
        </n-layout-header>
        <n-layout-content>
          <content/>
        </n-layout-content>
        <!--        <n-layout-footer class="bottom-info-bar">-->
        <!--          <bottom-bar/>-->
        <!--        </n-layout-footer>-->
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import {
  NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter,
  NConfigProvider
} from "naive-ui";
import TopBar from "./components/main/TopBar.vue";
// import BottomBar from "./components/main/BottomBar.vue";
import SideBar from "./components/main/SideBar.vue";
import Icons from "./components/main/Icons.vue";
import Content from "./components/main/Content.vue";

import {computed, onMounted} from "vue";
import {useUserStore} from "./pinia/UserStore";
import {useColorStore} from "./pinia/ColorStore";
import {usePalettes} from "./hooks/useColor";

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
      hoverColor: colorStore.BASE1
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

// 清除加载动画
onMounted(() => {
  // 由于 vite 构建速度实在太快了，所以不得不让动画加载一会儿
  setTimeout(() => {
    postMessage({payload: 'removeLoading'}, '*')
  }, 500)
})
</script>

<style lang="scss" scoped>
.side-menu-bar {
  box-shadow: inset -2px 0 8px -2px #ddd;
  width: 70px;
  -webkit-user-select: none;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  //-webkit-app-region: drag;
}

.side-menu-bar, .right {
  height: 98vh;
}

.right {
  width: calc(100% - 70px);
  background-color: #ffffff;
}

.top-search-bar {
  background-color: #ffffff;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 2px 8px -2px #ddd;
  margin-bottom: 5px;
}

//.bottom-info-bar {
//  height: 3vh;
//}
</style>