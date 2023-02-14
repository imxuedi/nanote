<template>
  <div class="side-bar" :style="colorStore.cssVariable">
    <div class="app-logo">
      <svg height="18px" viewBox="0 0 1024 1024">
        <use xlink:href="#alphabet-N"></use>
      </svg>
      <svg height="18px" viewBox="0 0 1024 1024">
        <use xlink:href="#alphabet-A"></use>
      </svg>
    </div>
    <div class="app-icon">
      <div class="icon-outline active">
        <svg height="25px" viewBox="0 0 1024 1024">
          <use xlink:href="#app-widget"></use>
        </svg>
      </div>
      <div class="icon-outline">
        <svg height="25px" viewBox="0 0 1024 1024">
          <use xlink:href="#app-home"></use>
        </svg>
      </div>
      <div class="icon-outline">
        <svg height="25px" viewBox="0 0 1024 1024">
          <use xlink:href="#app-home"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useColorStore} from "../../pinia/ColorStore";
const colorStore = useColorStore()

</script>

<style lang="scss" scoped>
.side-bar {
  height: 100%;
  color: var(--PRIMARY);
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
        //color: var(--BASE3);
        background-color: var(--BASE3);
      }
    }
  }
}
</style>