<template>
  <div class="top-bar" :style="topBarStyle">
    <div class="title">
      <span></span>
    </div>
    <div class="info">
      <n-space justify="center" align="center">
        <n-auto-complete
            v-model:value="searchValue"
            :options="searchOptions"
            clearable
            placeholder="找点东西~"
            size="small"
        />
        <div style="display: flex; align-items: center">
          <n-popselect
              v-model:value="selectedMessages"
              :options="messages" trigger="click" size="small"
          >
            <svg height="20px" viewBox="0 0 1024 1024">
              <use xlink:href="#app-message"></use>
            </svg>
            <template #empty>
              <span class="message-empty">🤷‍♂️ 还没有消息呢 🤷‍♀️</span>
            </template>
            <template #action>
              <n-button size="tiny" quaternary>清空全部</n-button>
              <n-button size="tiny" quaternary style="float: right" type="success">全部已读</n-button>
            </template>
          </n-popselect>
          <svg height="20px" viewBox="0 0 1024 1024" :class="isSync?'sync':''" @click="syncSettings">
            <use xlink:href="#app-sync"></use>
          </svg>
          <n-dropdown
              size="small"
              trigger="click"
              :options="options"
              @select="selectOptions"
          >
            <svg height="20px" viewBox="0 0 1024 1024" @click="showSettingMenu=true">
              <use xlink:href="#app-more"></use>
            </svg>
          </n-dropdown>
        </div>
        <n-switch :round="false" @update:value="toggleTheme" :value="themeStore.darkMode">
          <template #checked-icon>
            <svg height="20px" viewBox="0 0 1024 1024" class="exception">
              <use xlink:href="#dark-switch"></use>
            </svg>
          </template>
          <template #unchecked-icon>
            <svg height="20px" viewBox="0 0 1024 1024" class="exception">
              <use xlink:href="#light-switch"></use>
            </svg>
          </template>
        </n-switch>
      </n-space>
    </div>
    <div class="action">
      <svg height="13px" viewBox="0 0 1024 1024" @click="setWindowState('top')"
           :style="{backgroundColor: top ? 'var(--hover)': ''}"
      >
        <use xlink:href="#stay-top"></use>
      </svg>
      <svg height="13px" viewBox="0 0 1024 1024" @click="setWindowState('minimize')">
        <use xlink:href="#app-minimize"></use>
      </svg>
      <svg height="13px" viewBox="0 0 1024 1024" @click="setWindowState('close')">
        <use xlink:href="#app-close"></use>
      </svg>
    </div>
  </div>
</template>

<script setup>
import {NButton, NSpace, NSwitch, NDropdown, NAutoComplete, NPopselect} from "naive-ui";
import {computed, ref} from "vue";
import {IPC_API} from "@/hooks/useIPC";
import {useThemeStore} from '@/pinia/ThemeStore'

// 动态搜索
const searchValue = ref("")
const searchOptions = computed(() => {
  return [
    {label: '书签', key: '999'}
  ]
})


// 全局消息
const messages = ref([
  // {label: '1231231', value: '13131'}
])
const selectedMessages = ref([])


// 状态
const top = ref(false)
const setWindowState = (action) => {
  if (action === 'top') top.value = !top.value;
  IPC_API.setWindowState({action})
}


// 设置菜单
const showSettingMenu = ref(false)
const options = [
  {label: '⚙ 系统设置', key: 'setting'},
  {label: '🗃 插件设置', key: 'plugin'},
  {label: '🎉 换个主题', key: 'theme'},
]
const selectOptions = (option) => {
  console.log(option)
  IPC_API.openItem({type: 'setting', args: option})
}

// 数据同步
const isSync = ref(false)
const syncSettings = () => {
  isSync.value = !isSync.value
}

// 亮色、深色主题切换
const themeStore = useThemeStore()
const topBarStyle = computed(() => {
  if (!themeStore.darkMode) {
    let color = themeStore.hexToRgb(themeStore.color.primary)
    return {
      'border-bottom': `2px solid rgba(${color}0.1)`,
      'background': '#fff'
    }
  }
})

const toggleTheme = (dark) => {
  themeStore.patchColor(themeStore.color.ORIGIN, dark)
}


</script>

<style lang="scss" scoped>
// TODO 做媒体查询写三套即可
.top-bar {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
  align-items: center;
  justify-items: center;
  color: var(--icon);
  background: var(--background);

  .action {
    align-self: start;
    justify-self: end;

    svg {
      padding: 6px 13px;
      transition: all .3s ease-in-out;
      -webkit-app-region: no-drag;
      border-radius: 2px;

      &:focus, &:hover {
        background-color: var(--hover);
      }

      &:last-child:hover {
        color: white;
        background-color: #fb7373;
      }
    }
  }

  .info {
    -webkit-app-region: no-drag;

    svg:not(.exception) {
      padding: 5px;
      margin: auto 5px;
      outline: none;
      border-radius: 2px;

      &:focus, &:hover {
        background-color: var(--hover);
      }
    }
  }
}

.title {
  -webkit-app-region: no-drag;

  span {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: bold;
  }
}

.sync {
  &:hover {
    background-color: inherit !important;
  }

  animation: rotate 1s linear infinite;
}

@-webkit-keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.message-empty {
  display: inline-block;
  height: 100px;
  line-height: 100px;
  text-align: center;
  width: 150px;
}
</style>
