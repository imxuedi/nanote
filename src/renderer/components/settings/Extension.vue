<template>
  <div>
    <n-input placeholder="在应用市场中搜索扩展" @change="searchExtension" clearable></n-input>
    <n-tabs type="line" animated>
      <n-tab-pane name="marketplace" tab="插件市场">
        插件市场
      </n-tab-pane>
      <n-tab-pane name="installed" tab="已安装">
        已经安装
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import {NInput, NTabs, NTabPane} from "naive-ui";

const searchExtension = () => {

}

</script>

<style lang="scss" scoped>

</style>