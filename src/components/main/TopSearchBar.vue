<template>
  <div class="search-all">
  </div>
  <div class="action-win">
    <div @click="minimizeWindow" class="menu-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="35%" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-minimize"/>
      </svg>
    </div>
    <div @click="closeWindow" class="menu-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="35%" viewBox="0 0 1024 1024">
        <use xlink:href="#icon-close"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
const minimizeWindow = () => {
  IPC_API.minimizeWindow()
}

const closeWindow = () => {
  // send ipc signal to close window
  IPC_API.closeWindow()
}
</script>

<style lang="scss" scoped>
.search-all {
  width: 80%;
}

.search-all, .action-win {
  height: 100%;
}

.action-win {
  flex-grow: 1;
  display: inline-block;
  text-align: right;

  .menu-icon {
    width: 45px;
    height: 30px;
    color: #9b9b9b;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    -webkit-app-region: no-drag;
    transition: background-color .3s ease-out;

    &:hover {
      background-color: #f5d0cf;
    }

    &:last-child {
      border-top-right-radius: 5px;
    }
  }
}
</style>