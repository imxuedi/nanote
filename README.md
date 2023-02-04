# Nanote

## 提醒 | Tips
`zh:` ⚠ Nanote 正在重构中以更好地支持插件系统，届时会更新部分依赖

`en:` ⚠ Nanote is being refactored to better support the plugin system, and some dependencies will be updated at that time

## 使用教程 | Guide

### 下载 | download

`zh:` 中国区需要设置镜像，否则可能会出现连接超时错误

`en:` Mirror needs to be set up in China, otherwise a connection timeout error may occur
```powershell
yarn config set registry https://registry.npmmirror.com/

$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

yarn install
```

### 启动 | launch
```powershell
yarn run dev
```

### 开启 devtools | open devtools

```text
Ctrl + Shift + I
```