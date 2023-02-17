import {ipcMain, shell, app, BrowserWindow} from "electron"
import {join} from "node:path";

/**
 * name or path, only one need
 *
 * suffix 弥补 name 不能打开特定文件的不足, 如 name: userData, suffix: config.json
 * 则 path 为 userData/config.json
 *
 * name: 'home' | 'appData' | 'userData'
 * path format: C:\\dir1\\dir2\\abc.txt
 */
const show_in_folder = async (e, {name, path, suffix}) => {
  if (path) {
    await shell.showItemInFolder(path)
    return
  }
  const _path = app.getPath(name)
  if (suffix) {
    await shell.showItemInFolder(join(_path, suffix))
  } else {
    await shell.showItemInFolder(_path)
  }
}


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

// 一些设置需要重新启动才可以生效
const reloadApp = () => {

  // 调用所有插件的 unmount 生命周期函数
  // 保存 storage 数据
}


// ------------------- IPC 接口 -------------------

ipcMain.handle("open:item", (event, params) => {
  const {type, args} = params
  if (type === 'plugin') {
    // open standalone window
  } else if (type === 'setting') {
    if (args === 'close' && settingWindow) {
      settingWindow.close()
    } else {
      openSettingWindow()
    }
  } else if (type === 'folder') {
    // 只能打开特定的文件或文件夹
  } else if (type === 'browser') {
    shell.openExternal(args)
  }
})

