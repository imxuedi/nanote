<template>
  <n-layout has-sider :style="{borderRadius: '5px', ...colorStore.cssVariable}">
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
    </n-layout>
  </n-layout>
</template>

<script setup>

import {NLayout, NLayoutHeader, NLayoutContent} from "naive-ui";
import {onMounted} from "vue";

import TopBar from "./TopBar.vue";
import SideBar from "./SideBar.vue";
import Content from "./Content.vue";
import {useColorStore} from "../../pinia/ColorStore";

const colorStore = useColorStore()


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

//.side-menu-bar, .right {
//  height: calc(100vh - 10px);
//}

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
  //margin-bottom: 5px;
  position: relative;
  z-index: 1;
}

</style>