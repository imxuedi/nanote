<template>
  <!-- 单个选项，表示是否启用某项 -->
  <div class="setting-item" v-if="data.type === 'checkbox'">
    <div>
      <n-checkbox v-model:checked="myValue" :label="data.label"/>
    </div>
  </div>

  <!--  多个单选，选择某一个项  -->
  <div class="setting-item group" v-else-if="data.type.startsWith('radio')">
    <p>
      {{ data.label }}
      <svg viewBox="0 0 1024 1024" height="15px" class="question">
        <use xlink:href="#question"></use>
      </svg>
    </p>
    <div class="indent">
      <n-radio-group v-model:value="myValue" name="radio-group">
        <n-space :vertical="data.type==='radio-v'">
          <n-radio v-for="cc of data.items" :value="cc.key" :label="cc.label"/>
        </n-space>
      </n-radio-group>
    </div>
  </div>

  <!-- 选择器，适合很多项，radio 显示不下时使用 -->
  <div class="setting-item group" v-else-if="data.type === 'select'">
    <p>{{ data.label }}</p>
    <div class="indent">
      <n-select v-model:value="myValue" :options="selectOptions(data)"/>
    </div>
  </div>

  <!-- 选择颜色时使用 -->
  <div class="setting-item group" v-else-if="data.type === 'color'">
    <p>{{ data.label }}</p>
    <div class="indent color">
      <div v-for="cc of data.items" :key="cc.key" :style="{border: '2px solid ' + useColor(cc.key)}">
        <div class="color-box" :style="{backgroundColor: useColor(cc.key)}">
        </div>
        <span>{{ cc.label }}</span>
      </div>
    </div>
  </div>

  <!-- 输入值时使用 -->
  <div class="setting-item group" v-else-if="data.type === 'input'">
    <p>{{ data.label }}</p>
    <div class="indent">
      <n-input v-model="myValue"></n-input>
    </div>
  </div>

  <!-- 打开配置文件自己瞎搞吧 -->
  <div class="setting-item group" v-else-if="data.type === 'manual'">
    <p>{{ data.label }}</p>
    <div class="indent">
      <n-button size="small" type="tertiary">打开配置文件</n-button>
    </div>
  </div>

  <!-- 上面的应该够了，如果有 node 脚本的，支持点击按钮发 IPC 消息，自己处理 -->
  <div class="setting-item" v-else-if="data.type === 'custom'">

  </div>

  <div class="setting-item" v-else>
    <n-alert title="没有这样的配置项" type="error"> 好好看看文档</n-alert>
  </div>
</template>

<script setup>
import {computed, ref, watchEffect} from "vue";
import {NAlert, NRadioGroup, NButton, NSelect, NRadio, NCheckbox, NInput} from 'naive-ui'
import {presetPalettes, presetDarkPalettes} from "@ant-design/colors";

const props = defineProps(['data', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const myValue = ref(props.data.value)

// 省时省力，自动更新
watchEffect(() => emit('update:modelValue', myValue.value))

const useColor = computed(() => {
  return (name) => {
    if (name) {
      if (name !== 'custom') {
        return presetPalettes[name][5]
      }
    }
    return 'var(--PRIMARY)'
  }
})

const selectOptions = (item) => {
  return item.items.map(t => ({label: t.label, value: t.key}))
}

</script>

<style lang="scss" scoped>
svg.question {
  color: var(--BASE6);
}

.setting-item {
  margin: 15px 0;
}

.indent {
  margin-left: 15px;
}

.group:not(:first-child) {
  margin: 25px 0;
}

.color {
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  gap: 30px;

  > div {
    width: 100%;
    padding: 5px;
    height: 50px;
    cursor: pointer;
    border-radius: 5px;

    > span {
      line-height: 40px;
      width: 100%;
      display: block;
      text-align: center;
      white-space: nowrap;
    }
  }

  .color-box {
    border-radius: 5px;
    height: 100%;
    width: 100%;
  }
}

</style>