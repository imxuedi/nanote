<template>
  <div>
    <h4>{{ props.data.label }}</h4>
    <n-radio-group v-model:value="myValue" name="radio-group">
      <n-space :vertical="props.data.type==='radio-v'">
        <n-radio v-for="item of props.data.items" :value="item.key" :label="item.label"/>
      </n-space>
    </n-radio-group>
  </div>
</template>

<script setup>
import {isProxy, ref, watchEffect} from "vue";
import {NRadio, NRadioGroup, NSpace} from "naive-ui";

const props = defineProps(['data', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

console.log(isProxy(props.data))

const myValue = ref("medium")

watchEffect(() => {
  console.log(myValue.value)
  emit('update:modelValue', myValue.value)
})
</script>

<style lang="scss" scoped>

</style>