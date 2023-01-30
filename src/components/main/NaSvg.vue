<template>
  <svg xmlns="http://www.w3.org/2000/svg" :viewBox="view" :height="height">
    <use v-bind:xlink:href="icon"></use>
  </svg>
</template>

<script setup>
const props = defineProps({
  icon: {type: String, required: true},
  height: {type: String, default: '50%'},
  view: {type: String, default: '0 0 1024 1024'},
})

</script>

<style lang="scss" scoped>
svg {
  margin: 0 10px;
}
</style>