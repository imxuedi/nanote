<template>
  <icons></icons>
  <div class="side-menu-bar">
    <side-menu-bar v-model:tabName="curTab"></side-menu-bar>
  </div>
  <div class="right">
    <div class="top-search-bar">
      <top-search-bar></top-search-bar>
    </div>
    <div class="dynamic-component">
      <keep-alive>
        <component :is="tabs[curTab]"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

import SideMenuBar from "@/components/main/SideMenuBar.vue";
import TopSearchBar from "@/components/main/TopSearchBar.vue";

import Dashboard from "@/components/tab-dashboard/Dashboard.vue";
import Bookmark from "@/components/tab-bookmark/Bookmark.vue";
import Cloud from "@/components/tab-cloud/Cloud.vue";
import Setting from "@/components/tab-setting/Setting.vue";

import Icons from "@/components/main/Icons.vue";

// 动态内容组件
const tabs = {Dashboard, Bookmark, Cloud, Setting}
const curTab = ref('Bookmark')

</script>

<style lang="scss" scoped>
.side-menu-bar {
  background-color: #fcf0f0;
  width: 70px;
  height: 100%;
  -webkit-user-select: none;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  -webkit-app-region: drag;
}

.side-menu-bar, .right {
  display: inline-block;
  height: 100vh;
}

.right {
  width: calc(100% - 70px);
  vertical-align: top;
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
  box-shadow: 1px 0 1px 1px #ddd;
}
</style>