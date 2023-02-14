import {app, BrowserWindow, session} from "electron";
import {join} from "node:path"
import {loadUserConfig} from './common/config'
import {createTray} from './common/action'

import './common/storage'
// import './common/plugin'

/**
 * 启动前优化
 */
(function optimizeApp() {
  // 处理桌面图标
  if (require('electron-squirrel-startup')) {
    app.quit();
  }

  // 禁用 GPU 加速
  app.disableHardwareAcceleration()

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName())

  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
  }

  // 解决窗口恢复显示的闪烁问题
  app.commandLine.appendSwitch('wm-window-animations-disabled');

  // 关闭安全警告
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  // 是否在开发模式
  global.isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL

})()

/**
 * 创建主窗口
 */
let win = null
const createWindow = async () => {
  const {getWindowSize} = await loadUserConfig()
  const winSize = getWindowSize()

  win = new BrowserWindow({
    // 固定宽高, 不带菜单栏, 透明的主窗口
    width: winSize.width,
    height: winSize.height,
    frame: false,
    resizable: false,
    transparent: true,
    // maximizable: false,
    useContentSize: true,
    icon: join(__dirname, 'favicon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload/index.js'),
      spellcheck: false,
      // nodeIntegration: true,
      // contextIsolation: false
    }
  })
  if (isDev) {
    await win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({mode: 'bottom'})
    // 加载 Vue 扩展
    // app.whenReady()
    //   .then(() => import("electron-devtools-installer"))
    //   .then(({default: installExtension, VUEJS_DEVTOOLS}) =>
    //     installExtension(VUEJS_DEVTOOLS.id, {
    //       loadExtensionOptions: {allowFileAccess: true}
    //     })
    //   )
    //   .catch((e) => console.error("Failed install extension:", e));
  } else {
    await win.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  // 托盘
  await createTray(win)
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});