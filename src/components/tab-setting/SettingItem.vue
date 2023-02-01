<template>
  <div class="setting-line">
      <span class="label">
        <slot name="setting-title"></slot> &nbsp;&nbsp;
        <n-button text tag="a" @click="handleClick" size="tiny" type="error">
          <slot name="action-title"></slot>
        </n-button>
      </span>
    <slot></slot>
  </div>
  <n-divider/>
</template>

<script setup>
import {NButton, NDivider} from 'naive-ui'

const props = defineProps({
  settingName: {type: String, require: true}
})
const emit = defineEmits(['action'])

const handleClick = () => {
  emit('action', props.settingName)
}
</script>

<style lang="scss" scoped>
.label {
  position: relative;
  display: block;
  margin-bottom: 20px;

  &:before {
    content: '';
    position: absolute;
    width: 5px;
    height: 20px;
    left: -10px;
    background-color: #df6c69;
  }
}
</style>