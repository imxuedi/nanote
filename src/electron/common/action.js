/**
 * 定义系统托盘图标、处理窗口行为
 */

import {Tray, Menu, nativeImage, ipcMain, app} from 'electron'
import {join} from "node:path";
import {closeAsHidden} from "./config";


/**
 * 切换最小化的状态
 */
const ui_toggle_minimize = (win) => {
  // doing something others
  if (!win) return;
  if (win.isMinimized()) {
    if (win.isVisible()) {
      win.show()
    }
    win.restore()
    win.focus()
  } else {
    win.minimize()
  }
}
ipcMain.handle('ui:minimize', ui_toggle_minimize)


/**
 * 关闭或隐藏到托盘
 */
const ui_toggle_close = (win) => {
  if (!win) return
  // 如果不保存到托盘
  if (!closeAsHidden()) {
    win.close()
    return
  }
  win.isVisible() ? win.hide() : win.show()
}
ipcMain.handle('ui:close', ui_toggle_close)


/**
 * 直接关闭
 */
const ui_direct_close = (win) => win?.close()


/**
 * 窗口是否可见
 */
const ui_window_open = (win) => win?.isVisible()


/**
 * 窗口重现
 */
const ui_window_show = (win) => {
  if (!win) return
  if (win.isMinimized()) {
    win.restore()
  }
  win.show()
  win.focus()
}


/**
 * 窗口是被聚焦
 */
const ui_window_focused = (win) => win?.isFocused()


let tray = null
export const createTray = (win) => {
  if (!closeAsHidden()) return
  app.whenReady().then(() => {
    // 开发时静态文件放在最外层的 public 目录下
    const path = join(__dirname, "static/favicon.png")
    const icon = nativeImage.createFromPath(path)
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      {
        id: '1',
        label: '显示主界面',
        click: () => ui_toggle_close(win),
        visible: false,
      },
      {
        id: '2',
        label: '隐藏主界面',
        click: () => ui_toggle_close(win),
        visible: true,
      },
      {
        id: '3',
        label: '退出程序',
        role: 'quit'
      }
    ])

    // '显示主界面' 和 '隐藏主界面的' 菜单的切换
    // TODO 存在右键菜单二次点击显示才正确的 BUG
    contextMenu.on('menu-will-show', () => {
      // console.log({visible: core.win.isVisible()})
      // console.log({hide: core.win.isHidden()})

      if (ui_window_open(win)) {
        contextMenu.items[0].visible = false
        contextMenu.items[1].visible = true
      } else {
        contextMenu.items[0].visible = true
        contextMenu.items[1].visible = false
      }
    })

    // 单击显示主界面
    // linux 不一定是左键, 将来可能要做兼容设置
    tray.on('click', () => ui_window_show(win))

    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.setToolTip('Nanote Box')
    // title 只在 macos 上起作用
    tray.setTitle('Nanote Box')
  })
}

