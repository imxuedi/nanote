<template>
  <div>
    <h3> 关于 Nanote </h3>
    <p>
      <n-button type="primary" @click="openGithub" dashed size="small"> Github</n-button>
    </p>
    <p> Copyright © 2023 Nickel </p>
    <p> 反馈和联系：
      <n-tag @click="copyEmail" type="primary"> nanote@qq.com</n-tag>
    </p>
    <p> Nanote 开源免费使用，欢迎提交 Issue 和 PR</p>
  </div>
</template>

<script setup>
import {NButton, NTag, useMessage} from "naive-ui";

const openGithub = () => {
  IPC_API.openItem({type: 'browser', args: 'https://github.com/imxuedi/nanote'})
}

const message = useMessage()
const copyEmail = () => {
  navigator.clipboard.writeText("nanote@qq.com")
  message.success("已复制")
}

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