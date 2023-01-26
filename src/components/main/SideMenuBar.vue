<template>
  <div class="logo">
    <span>Nanote</span>
  </div>
  <div @click="switchTab('Dashboard')" :class="bindClass('Dashboard')">
    <svg xmlns="http://www.w3.org/2000/svg" height="45%" viewBox="0 0 1024 1024">
      <use xlink:href="#icon-dashboard"/>
    </svg>
  </div>
  <div @click="switchTab('Bookmark')" :class="bindClass('Bookmark')">
    <svg xmlns="http://www.w3.org/2000/svg" height="45%" viewBox="0 0 1024 1024">
      <use xlink:href="#icon-bookmark"/>
    </svg>
  </div>
  <div @click="switchTab('Cloud')" :class="bindClass('Cloud')">
    <svg xmlns="http://www.w3.org/2000/svg" height="45%" viewBox="0 0 1024 1024">
      <use xlink:href="#icon-cloud"/>
    </svg>
  </div>
  <div @click="switchTab('Setting')" :class="bindClass('Setting')">
    <svg xmlns="http://www.w3.org/2000/svg" height="50%" viewBox="0 0 1024 1024">
      <use xlink:href="#icon-setting"/>
    </svg>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps(['tabName'])
const emit = defineEmits(['update:tabName'])
const switchTab = (tabName) => {
  emit('update:tabName', tabName)
}

const bindClass = computed(() => {
  return (tabName) => {
    if (tabName === props.tabName) {
      return ['menu-icon', 'active']
    }
    return ['menu-icon']
  }
})
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;

  span {
    display: inline-block;
    line-height: 50px;
    text-align: center;
    width: 100%;
  }
}

// TODO 图标设置动态大小
.menu-icon {
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color .3s ease-out;
  -webkit-app-region: no-drag;
  cursor: pointer;

  &.active {
    background-color: #f6d8d7;
  }

  &:hover {
    background-color: #f8e2e1;
  }

  &:hover.active {
    background-color: #f5d0cf;
  }

  svg {
    color: #d64541;
  }
}

</style>