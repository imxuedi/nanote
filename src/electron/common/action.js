import {Tray, Menu, nativeImage, ipcMain, app} from 'electron'
import {join} from "node:path";
import {closeAsHidden, stayTopLevel, getWindowSize} from "./config";

let STAY_TOP_LEVEL = 'floating'
let CLOSE_AS_HIDDEN = true
let win = null
let tray = null

// electron 的 api 不准确，要自己判断
let IS_FULLSCREEN = false
let FULLSCREEN_BEFORE = {x: 0, y: 0}

export const initAction = () => {
  STAY_TOP_LEVEL = stayTopLevel()
  CLOSE_AS_HIDDEN = closeAsHidden()
}


/**
 * 设置窗口状态
 */
const setWindowState = (e, {action, options}) => {
  if (!win) return
  // console.log({
  //   visible: win.isVisible(),
  //   minimize: win.isMinimized(),
  //   maximize: win.isMaximized(),
  //   focus: win.isFocused(),
  //   modal: win.isModal(),
  //   normal: win.isNormal(),
  //   enable: win.isEnabled(),
  //   close: win.isClosable(),
  //   fullscreen: win.isFullScreen(),
  //   top: win.isAlwaysOnTop()
  // })

  if (action === 'minimize' && (!win.isMinimized())) {
    win.minimize()
  } else if (action === 'show') {
    win.show()
  } else if (action === 'close') {
    if (CLOSE_AS_HIDDEN) {
      win.isVisible() && win.hide()
    } else {
      win.isClosable() && win.close()
    }
  } else if (action === 'top') {
    if (win.isAlwaysOnTop()) {
      win.setAlwaysOnTop(false)
    } else {
      win.setAlwaysOnTop(true, STAY_TOP_LEVEL)
    }
  } else if (action === 'size') {
    const {width, height} = getWindowSize(options)
    win.setBounds({width, height})
  }
}
ipcMain.handle('win:state', setWindowState)


/**
 * 重启 Nanote
 */
// 一些设置需要重新启动才可以生效
export const relaunchApp = () => {
  app.relaunch()
  app.quit()
  // 调用所有插件的 unmount 生命周期函数
  // 保存 storage 数据
}


/**
 * 创建系统托盘
 */
export const createTray = (mainWindow) => {
  // 如果 win 不存在
  if (!mainWindow) {
    app.quit()
    return
  }
  win = mainWindow

  // 处理全屏相关问题
  handleFullScreen()

  // 如果关闭不是保存到托盘
  if (!CLOSE_AS_HIDDEN) return
  // 加载托盘和托盘菜单
  app.whenReady().then(() => {
    // 开发时静态文件放在最外层的 public 目录下
    const path = join(__dirname, "favicon.png")
    const icon = nativeImage.createFromPath(path)
    tray = new Tray(icon)
    // 单击显示主界面，linux 不一定是左键, 将来可能要做兼容设置
    tray.on('click', () => setWindowState(
      null, {action: 'show'}
    ))
    // 设置右键菜单 修好了多年的老毛病 => 'menu-will-show'
    createContextMenu()
    win.on('show', () => createContextMenu(true))
    win.on('hide', () => createContextMenu(false))

    tray.setIgnoreDoubleClickEvents(true)
    tray.setToolTip('Nanote Box')
    // title 只在 macos 上起作用
    tray.setTitle('Nanote Box')
  })
  app.on('will-quit', () => tray?.destroy())
}

const createContextMenu = (state = true) => {
  let menu = []
  if (state) {
    menu.push({
      label: '隐藏主界面',
      click: () => setWindowState(null, {action: 'close'})
    })
  } else {
    menu.push({
      label: '显示主界面',
      click: () => setWindowState(null, {action: 'show'})
    })
  }
  menu.push({label: '重新启动', click: () => relaunchApp()})
  menu.push({label: '退出程序', role: 'quit'})
  const contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)
}

const handleFullScreen = () => {
  win.on('enter-full-screen', () => {
    const {x, y} = win.getBounds()
    IS_FULLSCREEN = true
    FULLSCREEN_BEFORE = {x, y}
  })
  win.on('moved', () => {
    if (IS_FULLSCREEN) {
      const {width, height} = getWindowSize()
      const {x, y} = FULLSCREEN_BEFORE
      win.setBounds({x, y, width, height})
      IS_FULLSCREEN = false
    }
  })
}