import {ipcMain, shell, app, BrowserWindow} from "electron"
import {join} from "node:path";
import {usePath} from "../utils/usePath";


// --------------- 打开设置窗口 ------------------
// 一些思考：为何不用普通模态框，要单开一个新 window 窗口？
// 因为主窗口的插件切换原理是 “display:none;”
// 他的 “重量” 已经很大了，不想再给它施加压力，而且设置窗口打开频次很低，
// 添加这些 DOM 元素到主窗口实在没有必要

let settingWindow = null
let parentWindow = null

export const initSettingWindow = (win) => {
  parentWindow = win
}

const openSettingWindow = () => {
  settingWindow = new BrowserWindow({
    parent: parentWindow,
    // 主窗口暂时失效
    modal: true,
    // width: 800,
    // height: 500,
    width: 1000,
    height: 600,
    frame: false,
    transparent: true,
    resizable: true,
    useContentSize: true,
    webPreferences: {
      preload: join(__dirname, './preload/index.js'),
      spellcheck: false
    }
  })
  if (isDev) {
    let url = new URL('/setting', MAIN_WINDOW_VITE_DEV_SERVER_URL)
    console.log({url: url.href})
    settingWindow.loadURL(url.href)
    settingWindow.webContents.openDevTools({mode: "bottom"})
  } else {
    // 暂时不明确打包后的加载位置
  }
}


// ------------------- IPC 接口 -------------------

ipcMain.handle("open:item", (event, params) => {
  console.log(params)
  const {type, args} = params
  if (type === 'plugin') {
    // open standalone window
  } else if (type === 'setting') {
    if (args === 'close' && settingWindow) {
      settingWindow.close()
    } else {
      openSettingWindow()
    }
  } else if (type === 'file' || type === 'folder') {
    if (args === 'config') {
      shell.showItemInFolder(usePath('config'))
    }
    // 用到时再添加更多
  } else if (type === 'browser') {
    shell.openExternal(args)
  } else if (type === 'reload') {
    // relaunchApp()
    parentWindow.reload()
  } else if (type === 'devtool' && isDev) {
    parentWindow.webContents.toggleDevTools()
  }
})

