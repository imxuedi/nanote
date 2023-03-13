<template>
  <n-dialog-provider>
    <n-layout>
      <n-layout-header>
        <div class="setting-header">
          <span>&emsp;⚙ </span>
          <svg height="13px" viewBox="0 0 1024 1024" @click="closeWindow">
            <use xlink:href="#app-close"></use>
          </svg>
        </div>
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider>
          <div class="setting-sider">
            <ul @click="changeTab">
              <li v-for="item of settingItems" :key="item.key"
                  :id="item.key"
                  :class="[currentTab===item.key?'active':'']">
                {{ item.label }}
              </li>
            </ul>
          </div>
        </n-layout-sider>
        <n-layout-content>
          <n-message-provider>
            <div class="setting-content">
              <component :is="currentComponent"/>
            </div>
          </n-message-provider>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-dialog-provider>
</template>

<script setup>
import {computed, ref} from "vue";
import {IPC_API} from "@/hooks/useIPC";
import {NLayout, NLayoutHeader, NLayoutContent, NMessageProvider} from "naive-ui";
import Base from "./Base.vue";
import Sync from "./Sync.vue";
import About from './About.vue'
import Extension from "./Extension.vue";

// Tab 切换
const settingItems = ref([
  {label: '通用设置', key: 'base'},
  {label: '数据同步', key: 'sync'},
  // {label: '备份与恢复', key: 'backup'},
  {label: '插件管理', key: 'extension'},
  {label: '关于', key: 'about'},
])
const currentTab = ref("base")

const currentComponent = computed(() => {
  return {
    sync: Sync,
    base: Base,
    about: About,
    extension: Extension
  }[currentTab.value]
})

const changeTab = (e) => {
  let li = e.composedPath().find(li => li.tagName === 'LI')
  li && (currentTab.value = li.id)
}

// 窗口关闭刷新主界面
const closeWindow = () => {
  IPC_API.openItem({type: 'setting', args: 'close'})
  IPC_API.openItem({type: 'reload'})
}

</script>

<style lang="scss" scoped>
.setting-header {
  height: 25px;
  color: white;
  background-color: var(--BASE4);
  -webkit-app-region: drag;
  line-height: 25px;
}

.setting-sider {
  height: 100%;
  font-size: 13px;
  -webkit-user-select: none;
}

.setting-content {
  height: calc(100vh - 55px);
  font-size: 13px;
  -webkit-user-select: none;
  background: var(--content);
}

.setting-content {
  padding: 10px 20px;
  overflow-y: auto;
}

.setting-sider {
  background-color: var(--BASE1);

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    //border-right: 1px solid #666;
    cursor: pointer;
    height: 100%;

    li {
      padding: 8px 50px 8px 20px;
      height: 20px;
      line-height: 20px;
      transition: all .2s ease-in-out;

      &:hover:not(.active) {
        background-color: var(--BASE2);
      }

      &.active {
        //color: var(--BASE6);
        background-color: var(--BASE3);
      }
    }
  }
}


svg {
  float: right;
  padding: 6px 13px;
  transition: all .3s ease-in-out;
  -webkit-app-region: no-drag;

  &:hover {
    background-color: #fb7373;
  }
}


::-webkit-scrollbar {
  width: 10px;
  background-color: var(--BASE5);
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background-color: var(--BASE2);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--BASE3);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--BASE4);
}
</style>
