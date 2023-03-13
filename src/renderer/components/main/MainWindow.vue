<template>
  <!--  <n-layout has-sider :style="{borderRadius: '10px'}">-->
  <!--    <n-layout-sider class="side-menu-bar">-->
  <!--      <side-bar/>-->
  <!--    </n-layout-sider>-->
  <!--    <n-layout>-->
  <!--      <n-layout-header class="top-search-bar">-->
  <!--        <top-bar/>-->
  <!--      </n-layout-header>-->
  <!--      <n-layout-content>-->
  <!--        <content/>-->
  <!--      </n-layout-content>-->
  <!--    </n-layout>-->
  <!--  </n-layout>-->

  <div class="container">
    <side-bar class="side-menu-bar"/>
    <div class="right">
      <top-bar class="top-search-bar"/>
      <content class="content"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue"
import {NLayout, NLayoutHeader, NLayoutContent} from "naive-ui"
import TopBar from "./TopBar.vue"
import SideBar from "./SideBar.vue"
import Content from "./Content.vue"

// 清除加载动画
onMounted(() => {
  // 由于 vite 构建速度实在太快了，所以不得不让动画加载一会儿
  setTimeout(() => {
    postMessage({payload: 'removeLoading'}, '*')
  }, 500)
})
</script>

<style lang="scss" scoped>
$sidebar-width: 70px;
$top-height: 50px;
$radius: 8px;

.container {
  border-radius: $radius + 2px;
  height: calc(100vh - 4px);
}

.side-menu-bar {
  width: $sidebar-width;
  float: left;
  color: var(--BASE7);
  background-color: var(--background);
  -webkit-user-select: none;
  border-top-left-radius: $radius;
  border-bottom-left-radius: $radius;
}

.right {
  margin-left: $sidebar-width;
  width: calc(100% - 70px);
  border-bottom-right-radius: $radius;
}

.side-menu-bar, .right {
  height: 100%;
}

.content {
  background: var(--content);
  height: calc(100% - 50px);
  border-bottom-right-radius: $radius;
}

.top-search-bar {
  height: $top-height;
  -webkit-app-region: drag;
  border-top-right-radius: $radius;
}

</style>
