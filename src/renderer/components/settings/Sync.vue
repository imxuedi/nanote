<template>
  <div v-for="item in settings" :key="item.label">
    <template v-if="item.type === 'group'">
      <h3>{{ item.label }}</h3>
      <template v-for="x in item.children" :key="x.label">
        <common-setting :data="x"/>
      </template>
    </template>
    <common-setting :data="item" v-else/>
  </div>
</template>

<script setup>
import {computed} from "vue";
import CommonSetting from "./CommonSetting.vue";
import {useUserStore} from "../../pinia/UserStore";

const userStore = useUserStore()

const settings = computed(() => {
  return [
    {
      type: 'group', label: '基本设置', children: [
        {
          type: 'checkbox', label: '是否开启同步', path: 'sync.enable',
          value: userStore.sync.enable
        },
        {
          type: 'radio-h', label: '同步方式', path: 'sync.manner',
          value: userStore.sync.manner, items: [
            {label: 'SSH', key: 'ssh'},
            {label: 'FTP', key: 'ftp'},
            {label: '阿里云 OSS', key: 'ali-oss'},
            {label: '腾讯云 COS', key: 'tencent-cos'}
          ]
        }
      ]
    },
    {
      type: 'group', label: 'SSH 同步设置', children: [
        {
          label: '主机名 [必填]', type: 'input', path: 'sync.ssh.hostname',
          value: userStore.sync.ssh.hostname
        },
        {
          label: '登录方式', type: 'radio-h', path: 'sync.ssh.loginManner',
          question: '建议在 .ssh/config 配置，而不是这里',
          value: userStore.sync.ssh.loginManner, items: [
            {label: '密码', key: 'password'},
            {label: '密钥', key: 'key'},
          ]
        },
        {label: '密码', type: 'input', path: 'sync.ssh.password', value: userStore.sync.ssh.password},
        {label: '密钥', type: 'manual', path: 'sync.ssh.key', value: userStore.sync.ssh.key},
      ]
    }
  ]
})
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