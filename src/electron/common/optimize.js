import {app} from "electron";

// --------------- 启动前优化 -------------
// 做一些常规操作

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
