<template>
  <div id="app-container">
    <widget-panel v-show="pluginStore.currentApp==='widget'"/>
    <template v-for="plugin of pluginStore.fixedPlugins" :key="plugin.name">
      <div :id="plugin.name" v-show="pluginStore.currentApp === plugin.name" style="height: 100%"></div>
    </template>
    <!--  未来开两个方向，研究 iframe 有没有更好的使用方式  -->
    <!--    <iframe src="http://localhost:7465/nanote-todo/index.html" ></iframe>-->
  </div>
</template>

<script setup>
import {onMounted, watchEffect} from "vue";
import {useUserStore} from "../../pinia/UserStore";
import {usePluginStore} from "../../pinia/PluginStore";
import {useLogger} from "../../hooks/useLogger";
import {handleQiankunError} from "../../hooks/useErrorHandler";
import WidgetPanel from "../widget/WidgetPanel.vue";

const pluginStore = usePluginStore()
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
$radius: 10px;

#app-container {
  background: var(--content);
  overflow-y: auto;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  display: none;
  //width: 10px;
  //background-color: var(--BASE5);
  //border-radius: $radius;
}

//::-webkit-scrollbar-track {
//  background-color: var(--BASE2);
//  border-radius: $radius;
//}
//
//::-webkit-scrollbar-thumb {
//  background-color: var(--BASE3);
//  border-radius: $radius;
//}
//
//::-webkit-scrollbar-thumb:hover {
//  background-color: var(--BASE4);
//}

</style>
