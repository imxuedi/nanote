<template>
  <div class="container">
    <setting-item @action="actions.viewDoc">
      <template #setting-title>从浏览器导入书签</template>
      <template #action-title>导入说明</template>
      <n-upload :max="1" accept="text/html" action="http://127.0.0.1:7465/upload" @finish="actions.handleFinish">
        <n-button type="tertiary" secondary size="small">选择文件</n-button>
      </n-upload>
      <n-alert type="success" closable v-if="state.upload==='success'" :on-close="actions.clearAlert">
        导入成功, 请回到书签视图查看
      </n-alert>
      <n-alert type="error" closable v-if="state.upload==='fail'" :on-close="actions.clearAlert">
        导入失败, 请检查文件格式
      </n-alert>
    </setting-item>
    <setting-item>
      <template #setting-title>用什么浏览器打开书签</template>
      <n-space>
        <svg height="25px" viewBox="0 0 1024 1024">
          <use xlink:href="#icon-edge"></use>
        </svg>
        <svg height="25px" viewBox="0 0 1024 1024">
          <use xlink:href="#icon-chrome"></use>
        </svg>
        <svg height="25px" viewBox="0 0 16 16" color="#299dd6">
          <use xlink:href="#icon-safari"></use>
        </svg>
      </n-space>
    </setting-item>
    <setting-item>
      <template #setting-title>查看本地数据</template>
      <n-button type="tertiary" secondary size="small" @click="actions.openFolder">所在目录</n-button>
    </setting-item>
    <setting-item>
      <template #setting-title>更新 Icon</template>
      <template #action-title>这是什么？</template>
      <n-button type="tertiary" secondary size="small" @click="IPC_API.updateIcon()">开始更新</n-button>
    </setting-item>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {NSpace, NUpload, NButton, NAlert} from "naive-ui";
import SettingItem from "@/components/tab-setting/SettingItem.vue";

const actions = {
  viewDoc: () => {
    IPC_API.showInBrowser('https://www.nanote.cn')
  },
  openFolder: () => {
    IPC_API.showInFolder({name: 'userData', suffix: 'nanote-data/bookmark.json'})
  },
  handleFinish: ({file, event}) => {
    if (event.target.status === 200) {
      state.value.upload = 'success'
    } else {
      state.value.upload = 'fail'
    }
  },
  clearAlert: () => {
    state.value.upload = ''
  }
}

const state = ref({
  upload: ''
})

</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

  .setting-line {
    //margin-left: 20px;
  }
}


</style>