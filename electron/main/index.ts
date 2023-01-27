import {app, BrowserWindow, ipcMain, shell} from 'electron'
import * as config from '../common/config'
import {release} from 'node:os'
import {join} from 'node:path'
import {createTray} from "./tray";

// IPC 事件处理器
// import './message'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
    const winSize = config.getWindowSize('medium')
    win = new BrowserWindow({
        // 固定宽高, 不带菜单栏, 透明的主窗口
        width: winSize.width,
        height: winSize.height,
        frame: false,
        resizable: false,
        transparent: true,
        maximizable: false,
        useContentSize: true,

        icon: join(process.env.PUBLIC, 'favicon.ico'),
        webPreferences: {
            // 预加载脚本
            preload,
            // 启用 node 集成, 关闭上下文隔离不安全, 应该使用 contextBridge.exposeInMainWorld
            // docs: https://www.electronjs.org/docs/latest/tutorial/context-isolation
            // nodeIntegration: true,
            // contextIsolation: false,
            spellcheck: false
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return {action: 'deny'}
    })
}

app.whenReady().then(createWindow)

// 解决窗口恢复显示的闪烁问题
app.commandLine.appendSwitch('wm-window-animations-disabled');

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// ----------------------------- UI 设置 --------------------------------------

/**
 * 切换最小化的状态
 */
export const ui_toggle_minimize = () => {
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
export const ui_toggle_close = () => {
    if (!win) return
    // 如果有托盘图标
    if (config.closeAsHidden()) {
        if (win.isVisible()) {
            // 隐藏到托盘
            win.hide()
        } else {
            win.show()
        }
    } else {
        // 关闭程序
        win.close()
    }
}
ipcMain.handle('ui:close', ui_toggle_close)

export const ui_direct_close = () => {
    if (!win) return
    win.close()
}

export const ui_window_open = (): boolean => {
    return win.isVisible()
}

export const ui_window_show = () => {
    if (!win) return
    if (win.isMinimized()) {
        win.restore()
    }
    win.show()
    win.focus()
}

export const ui_window_focused = (): boolean => {
    if (!win) return
    return win.isFocused()
}
// 创建托盘图标
if (config.closeAsHidden()) {
    app.whenReady().then(() => {
        createTray({
            ui_window_show,
            ui_toggle_close,
            ui_window_open,
            // win
        })
    })
}

// ----------------------------- IPC Main -------------------------------------
