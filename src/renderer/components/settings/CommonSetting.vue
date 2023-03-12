<template>
  <!-- 单个选项，表示是否启用某项 -->
  <div class="setting-item" v-if="data.type === 'checkbox'">
    <div>
      <n-checkbox
          v-model:checked="myValue" :label="data.label"
          @update:checked="handleValueChange"
      />
      <span :title="data.question" v-if="data.question">
        <svg viewBox="0 0 1024 1024" height="15px" class="question">
          <use xlink:href="#question"/>
        </svg>
      </span>
    </div>
  </div>

  <!--  多个单选，选择某一个项  -->
  <div class="setting-item group" v-else-if="data.type.startsWith('radio')">
    <p>
      {{ data.label }}
      <span :title="data.question" v-if="data.question">
        <svg viewBox="0 0 1024 1024" height="15px" class="question">
          <use xlink:href="#question"/>
        </svg>
      </span>
    </p>
    <div class="indent">
      <n-radio-group
          v-model:value="myValue" name="radio-group"
          @update:value="handleValueChange">
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
      <n-select
          v-model:value="myValue"
          :options="selectOptions(data)"
          @update:value="handleValueChange"
      />
    </div>
  </div>

  <!-- 选择颜色时使用 -->
  <div class="setting-item group" v-else-if="data.type === 'color'">
    <p>
      {{ data.label }}
      <span :title="data.question" v-if="data.question">
        <svg viewBox="0 0 1024 1024" height="15px" class="question">
          <use xlink:href="#question"/>
        </svg>
      </span>
      &nbsp;
      <n-button
          title="手动改一下" size="small" @click="openConfig" tertiary> 配置文件
      </n-button>
    </p>
    <div class="indent color">
      <template v-for="cc of data.items" :key="cc.key" :style="{border: '2px solid ' + useColor(cc.key)}">
        <div v-if="cc.key !== 'custom'"
             class="color-box"
             @click="changeThemeColor(cc.key)"
             :style="{backgroundColor: useColor(cc.key)}">
          <span>{{ cc.label }}</span>
        </div>
      </template>
    </div>
  </div>

  <!-- 输入值时使用 -->
  <div class="setting-item group" v-else-if="data.type === 'input'">
    <!--    <p>{{ data.label }}</p>-->
    <div class="">
      <n-input
          v-model="myValue"
          autosize style="min-width: 20%"
          @update:value="handleValueChange"
          :placeholder="data.label"
          clearable
          size="small"
      />
    </div>
  </div>

  <!-- 打开配置文件自己瞎搞吧 -->
  <div class="setting-item group" v-else-if="data.type === 'manual'">
    <p>{{ data.label }}
      <span :title="data.question" v-if="data.question">
        <svg viewBox="0 0 1024 1024" height="15px" class="question">
          <use xlink:href="#question"/>
        </svg>
      </span>
    </p>
    <div class="indent">
      <n-button size="small" tertiary>打开配置文件</n-button>
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
import {computed, ref, watch} from "vue";
import {IPC_API} from "@/hooks/useIPC";
import {
  NAlert, NRadioGroup, NButton,
  NSelect, NRadio, NCheckbox,
  NInput
} from 'naive-ui'
import {presetPalettes, presetDarkPalettes} from "@ant-design/colors";
import {useColorStore} from "@/pinia/ColorStore";
import {useUserStore} from "@/pinia/UserStore";
import {usePalettes} from "@/hooks/useColor";
import {useLogger} from "@/hooks/useLogger";

const props = defineProps(['data'])
const colorStore = useColorStore()
const userStore = useUserStore()
const myValue = ref(props.data.value)

// 传递用户数据
watch(props, () => myValue.value = props.data.value)

const handleValueChange = (value) => {
  useLogger.purple(props.data.path, " ----> ", value)
  IPC_API.saveLocalData({path: props.data.path, value})

  // 执行回调函数（原来为调整大小而专门设置的）
  if (props.data.callback) {
    props.data.callback(value)
  }
}

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


const changeThemeColor = (color) => {
  useLogger.purple(props.data.path, " ----> ", color)
  IPC_API
      .saveLocalData({path: props.data.path, value: color})
      .then(() => {
        userStore.appearance.theme.primaryColor = color
        const darkMode = userStore.theme.darkMode
        const colors = usePalettes(color, darkMode)
        console.log({colors})
        colorStore.$patch(colors)
      })
}


const openConfig = () => {
  IPC_API.openItem({type: 'file', args: "config"})
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
  gap: 30px 40px;
  margin-bottom: 40px;

  > div {
    padding: 5px;
    height: 40px;
    cursor: pointer;
    border-radius: 5px;

    > span {
      line-height: 40px;
      width: 100%;
      display: block;
      text-align: center;
      white-space: nowrap;
      color: #ffffff;
    }
  }

  .color-box {
    border-radius: 5px;
    //height: 100%;
    //width: 100%;
  }
}

</style>