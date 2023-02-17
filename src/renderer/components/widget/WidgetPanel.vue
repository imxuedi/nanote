<template>
  <div id="canvas-container">
    <canvas ref="context" width="500" height="500"></canvas>
    <n-card>

    </n-card>
  </div>
</template>

<script setup>
// --------------------- NOTICE ------------------------
// fabric 已经被全局加载，因为 npm 包目前对浏览器支持不友好 详情：
// https://github.com/fabricjs/fabric.js/discussions/8454
// https://github.com/fabricjs/fabric.js/discussions/8208
// -----------------------------------------------------

import {onMounted, ref} from "vue";
import {NCard} from 'naive-ui'

const {Canvas, Rect} = fabric
const context = ref()

const setCanvasSize = () => {
  let container = document.querySelector('#canvas-container')
  console.log(container)
  let {clientHeight, clientWidth} = container
  context.value.height = clientHeight
  context.value.width = clientWidth
}

onMounted(() => {
  setCanvasSize()
  const canvas = new Canvas(context.value)
  const rect = new Rect({
    left: 50,
    top: 50,
    width: 30,
    height: 30,
    fill: 'blue'
  })
  canvas.add(rect)
})

</script>

<style lang="scss" scoped>
#canvas-container {
  height: 100%;
  width: 100%;
  position: relative;

  .widget-test {
    position: absolute;
    border: 3px solid #91caff;
    height: 100px;
    width: 100px;
    top: 0;
    left: 0;
    border-radius: 3px;

    .widget-header {
      height: 30px;
      background-color: wheat;
      width: 100%;
      cursor: move;
    }
  }
}
</style>