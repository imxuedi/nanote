<template>
  <div :id="props.id">
    独立的窗口，装载插件
  </div>
</template>

<script setup>
// import {usePlu}
// 基于 qiankun 进行装载
const props = defineProps({
  id: String,
  entry: String,
  name: String
})

</script>

<style lang="scss" scoped>

</style>