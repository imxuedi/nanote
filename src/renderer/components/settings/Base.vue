<template>
  <div v-for="item in settings" :key="item.label">
    <template v-if="item.type === 'group'">
      <h3>{{ item.label }}</h3>
      <template v-for="x in item.children" :key="x.label">
        <common-setting :data="x"></common-setting>
      </template>
    </template>
    <common-setting :data="item" v-else></common-setting>
  </div>
</template>

<script setup>
// ------ 写起来是真费力，用起来是真香 ------

import {ref} from "vue";
import CommonSetting from "./CommonSetting.vue";

const settings = ref([
  {
    type: 'group', label: '外观设置', children: [
      {
        type: 'color', label: '预设主题颜色',
        path: 'appearance.theme.primaryColor',
        value: 'volcano',
        items: [
          {label: '薄暮', key: 'red'},
          {label: '火山', key: 'volcano'},
          {label: '日暮', key: 'orange'},
          {label: '金盏花', key: 'gold'},
          {label: '日出', key: 'yellow'},
          {label: '青柠', key: 'lime'},
          {label: '极光绿', key: 'green'},
          {label: '明青', key: 'cyan'},
          {label: '拂晓蓝', key: 'blue'},
          {label: '极客蓝', key: 'geekblue'},
          {label: '酱紫', key: 'purple'},
          {label: '法式洋红', key: 'magenta'},
          {label: '自定义', key: 'custom'}
        ]
      },
      {
        type: 'radio-h', label: '窗口大小',
        path: 'appearance.windowSize',
        value: 'medium',
        items: [
          {label: '小', key: 'small'},
          {label: '中', key: 'medium'},
          {label: '大', key: 'large'}
        ]
      },
      {
        type: 'checkbox', label: '不是真的想关闭',
        path: 'behavior.closeAsHidden', value: true
      },
      {
        type: 'checkbox', label: '开机自动启动',
        path: 'behavior.startWithPC', value: false
      },
    ]
  }
])

</script>

<style lang="scss" scoped>
h3 {
  position: relative;
  padding: 0;
  margin: 0;
  width: max-content;
}

h3::before {
  content: "";
  position: absolute;
  left: -0.5em;
  top: 1em;
  width: calc(100% + 1em);
  height: 8px;
  transform: skew(-12deg);
  background-color: var(--BASE4);
  opacity: .6;
}
</style>