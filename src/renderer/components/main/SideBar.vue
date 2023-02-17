<template>
  <div class="side-bar">
    <div class="app-logo">
      <svg height="18px" viewBox="0 0 1024 1024">
        <use xlink:href="#alphabet-N"></use>
      </svg>
      <svg height="18px" viewBox="0 0 1024 1024">
        <use xlink:href="#alphabet-A"></use>
      </svg>
    </div>
    <div class="app-icon" @click="changeCurrentApp">
      <div :class="['icon-outline', pluginStore.currentApp === 'widget' ? 'active': '']"
           id="widget-icon">
        <svg height="25px" viewBox="0 0 1024 1024">
          <use xlink:href="#app-widget"></use>
        </svg>
      </div>
      <!--   上面是 widget 下面是 plugins   -->
      <template v-for="plugin of pluginStore.fixedPlugins" :key="plugin.name">
        <div :class="['icon-outline', pluginStore.currentApp === plugin.name ? 'active': '']"
             :id="plugin.name + '-icon'">
          <img :src="`http://localhost:7465/${plugin.name}/${plugin.icon}`" alt="Icon">
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {usePluginStore} from "../../pinia/PluginStore";
import {useLogger} from "../../hooks/useLogger";

const pluginStore = usePluginStore()

const changeCurrentApp = (e) => {
  let item = e.composedPath().find(t => t.id?.endsWith('icon'))
  // 点击了空白区域
  if (!item) return
  let name = item.id.replace('-icon', '')
  if (pluginStore.currentApp !== name) {
    useLogger.purple('switch component ', name)
    pluginStore.changeCurrentPlugin(name)
  }
}

</script>

<style lang="scss" scoped>
.side-bar {
  height: 100%;
  color: var(--BASE7);
  background-color: var(--BASE1);


  .app-logo {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      margin: 0 2px;
    }
  }

  .app-icon {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: calc(100% - 50px);

    > .icon-outline {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 100%;
      transition: background-color .3s ease-in-out;

      &:hover:not(.active) {
        background-color: var(--BASE2);
      }

      &.active {
        background-color: var(--BASE3);
      }

      > img {
        height: 25px;
        width: 25px;
      }
    }
  }
}
</style>