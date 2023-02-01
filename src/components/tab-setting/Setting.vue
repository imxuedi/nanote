<template>
  <div class="container">
    <div class="aside">
      <n-menu :options="menu" v-model:value="current.menu.value"/>
    </div>
    <div class="right">
      <component :is="current.component.value"/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {NMenu} from 'naive-ui'
import BookmarkSetting from "@/components/tab-setting/BookmarkSetting.vue";
import BaseSetting from "@/components/tab-setting/BaseSetting.vue";
import Developing from "@/components/main/Developing.vue";

const settings = [
  {title: '⚙ 基本设置', component: BaseSetting, key: 'base'},
  {title: '📊 面板设置', component: Developing, key: 'dashboard'},
  {title: '🏷 书签设置', component: BookmarkSetting, key: 'bookmark'},
  {title: '☁   云文件', component: Developing, key: 'cloud'},
  {title: '📌 插件市场', component: Developing, key: 'plugin'},
]

const current = {
  menu: ref('bookmark'),
  component: computed(() => {
    return settings.find(item => item.key === current.menu.value).component
  })
}

const menu = settings.map(({title, key}) => {
  return {label: title, key}
})

</script>

<style lang="scss" scoped>
.aside {
  height: calc(100vh - 80px);
  width: 150px;
  display: inline-block;
  border-right: 1px solid #ddd;
}

.right {
  display: inline-block;
  height: calc(100vh - 80px);
  width: calc(100% - 152px);
  vertical-align: top;
}
</style>