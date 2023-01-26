<template>
  <div>
    <h1> I'm BookMark, Hello Everyone! </h1>
    <span>{{ counter }}</span>
    <button @click="counter++">click</button>
  </div>
</template>

<script setup>
import {ref} from "vue";

const counter = ref(0)

</script>

<style lang="scss" scoped>

</style>