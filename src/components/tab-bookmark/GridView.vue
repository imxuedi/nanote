<template>
  <div class="grid-view">
    <span class="single-obj active">
      <svg height="40px" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-folder"/>
      </svg>
      <n-ellipsis style="max-width: 90px" :tooltip="false" title="前端学习笔记真的很重要"> 前端学习笔记真的很重要 </n-ellipsis>
    </span>
    <span class="single-obj">
      <svg height="40px" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-file"/>
      </svg>
      <n-ellipsis style="max-width: 90px" :tooltip="false" title="前端学习笔记真的很重要"> 前端学习笔记真的很重要 </n-ellipsis>
    </span>
  </div>

</template>

<script setup>
import {ref, computed} from 'vue'
import {NEllipsis} from 'naive-ui'

const data = ref([
  {title: '框架文档', type: 'dir', path: '/框架文档'},
  {title: '前端', type: 'dir', path: '/框架文档/前端'},
  {
    title: 'Aotu 前端代码规范',
    type: 'tag',
    path: '/框架文档/前端/Aotu 前端代码规范',
    url: 'https://guide.aotu.io/docs/',
    label: ['前端', '规范']
  },
  {
    title: 'Electron 启动加快',
    type: 'tag',
    path: '/框架文档/前端/Electron 启动加快',
    url: 'https://blog.inkdrop.app/how-to-make-your-electron-app-launch-1000ms-faster-32ce1e0bb52c',
    label: ['Electron']
  }
])

// 单行最长为 6 个汉字字符
const maxLength = 7;
const gridHeight = (item) => {

}

</script>

<style lang="scss" scoped>
.grid-view {
  display: grid;
  margin-top: 20px;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-gap: 20px 20px;
}

.single-obj {
  text-align: center;
  height: 80px;
  width: 100px;
  border-radius: 3px;
  cursor: pointer;

  > svg {
    margin-top: 8px;
  }

  > span {
    font-size: 13px;
  }

  &:hover {
    background-color: #fcf0f0;
  }
}

.single-obj.active {
  border: 1px solid #ddd;
  background-color: #f8e2e1;
}
</style>