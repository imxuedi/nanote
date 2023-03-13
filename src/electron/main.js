import {app, BrowserWindow} from "electron";
import {join} from "node:path"
import './common/optimize' // set isDev
// import './common/env'
import {initStorage} from "./common/storage";
import {initConfig, getWindowSize} from './common/config'
import {initAction, createTray} from './common/action'
import {initKoaApp, loadPluginScript, createManifestCache} from "./common/plugin";
import {initSettingWindow} from "./common/open-item";
/**
 * 一些思考：为什么 win 不放在 global 中使用，这样不是更方便吗？
 *
 * 考虑到一些插件有 nodejs 的脚本需求，放在全局十分危险
 */

let win = null

// -------------- 创建主窗口 -----------------
// 最重要的事情啦！
const createWindow = () => {
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
    // fullscreenable: false,
    icon: join(__dirname, 'favicon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload/index.js'),
      spellcheck: false,
    }
  })
  if (isDev) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // win.webContents.openDevTools({mode: "right"})
    // win.webContents.toggleDevTools()
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
    win.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  // 托盘
  createTray(win)
};

const bindAppListeners = () => {
  // app.on('ready', createWindow);
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
}


// 优雅的代码执行
initStorage()
  .then(() => {
    initConfig()
    initAction()
    initKoaApp()
    loadPluginScript()
    bindAppListeners()
    createWindow()
    createManifestCache()
    initSettingWindow(win)
  })
  .catch((error) => console.error(error))
