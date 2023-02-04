<template>
  <svg
      v-if="props.type==='svg'"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="props.svgViewBox"
      :height="props.height"
      :style="props.style"
  >
    <use v-bind:xlink:href="props.src"></use>
  </svg>
  <img v-else :src="props.src" alt="Icon" :width="props.height" :style="props.style" class="icon-img">
  <slot></slot>
</template>

<script setup>

const props = defineProps({
  // 'svg' | 'img'
  type: {type: String, default: 'svg'},
  // '#icon-name' | 'url' | 'base64:something'
  src: {type: String, default: '#icon-globe'},
  // '50%' | '50px'
  height: {default: 30},
  // required when type is 'svg', format: '0 0 32 32'
  svgViewBox: {default: '0 0 1024 1024'},
  // optional
  style: {}
})
</script>

<style lang="scss" scoped>
svg, img {
  margin: 0 10px;
  vertical-align: middle;
}
</style>