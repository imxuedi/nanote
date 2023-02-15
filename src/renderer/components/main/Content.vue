<template>
  <div id="app-container" :style="colorStore.cssVariable">
    <widget-panel v-show="pluginStore.currentApp==='widget'"/>
    <template v-for="plugin of pluginStore.fixedPlugins" :key="plugin.name">
      <div :id="plugin.name" v-show="pluginStore.currentApp === plugin.name"></div>
    </template>
  </div>
</template>

<script setup>
import {onMounted, watchEffect} from "vue";
import {useUserStore} from "../../pinia/UserStore";
import {useColorStore} from "../../pinia/ColorStore";
import {usePluginStore} from "../../pinia/PluginStore";
import {useLogger} from "../../hooks/useLogger";
import {handleQiankunError} from "../../hooks/useErrorHandler";
import WidgetPanel from "../widget/WidgetPanel.vue";

const pluginStore = usePluginStore()
const colorStore = useColorStore()
const userStore = useUserStore()

// TODO 清除副作用，并且保存数据
watchEffect(() => {
  const originData = userStore.plugins
  const plugins = Object.keys(originData)
  if (plugins.length) {
    let preloads = plugins.filter(item => {
      return originData[item].enable && originData[item].main.fixed
    })
    pluginStore.$patch({
      plugins: originData,
      fixedPlugins: preloads.map(item => ({...originData[item], name: item}))
    })
    // log to console
    useLogger.info("即将启用 ", preloads.length, " 个插件")
    preloads.forEach(item => useLogger.purple("启用 ", item))
    // start to load
    pluginStore.loadNanoteApps(preloads)
  }
})


// 生命周期 hooks
onMounted(() => {
  handleQiankunError()
})
</script>

<style lang="scss" scoped>
#app-container {
  //height: 200px;
  height: calc(98vh - 70px);
  overflow-y: auto;
  overflow-x: hidden;
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