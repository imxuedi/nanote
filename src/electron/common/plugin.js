import {app, ipcMain} from 'electron'
import {join} from "node:path"
import fs from "node:fs"
import {takeData, saveData} from "./storage";

let pluginPath = ''
if (process.env.WEBPACK_SERVE) {
  pluginPath = join(app.getAppPath(), 'src/plugins')
} else {
  pluginPath = join(app.getPath('userData'), 'plugins')
}

takeData({path: "plugins"}).then(plugins => {
  for (let pluginName in plugins) {
    if (plugins[pluginName].enable) {
      // 加载对应的 node 文件（如果有）
      console.log("loading plugin: ", pluginName)
    }
  }
})

/**
 * 安装、卸载插件
 */
function toggleAddPlugin(params) {
  // 检查重复命名
}

/**
 * 启用、禁用插件
 */
async function toggleEnablePlugin({name}) {
  let value = !takeData({path: `plugins.${name}.enable`})
  await saveData({path: `plugins.${name}.enable`, value})
}

/**
 * 固定、取消固定插件到侧边栏
 */
async function toggleFixPlugin() {
  let value = takeData({path: `plugins.${name}.fixed`})
  await saveData({path: `plugins.${name}.fixed`, value: !value})
}

/**
 * 固定、取消固定插件的 widget 到 dashboard
 */
async function toggleFixPluginWidget() {
  let widget = takeData({path: `plugins.${name}.widget`})
  if (!widget) return
  await saveData({path: `plugins.${name}.widget.fixed`, value: !widget.fixed})
}

/**
 * 保存插件状态（大小、位置）
 */
async function savePluginState({x, y, size}) {
  let widget = takeData({path: `plugins.${name}.widget`})
  if (!widget) return
  await saveData({
    path: `plugins.${name}.widget`, value: {...widget, x, y, size}
  })
}

function savePluginData(params) {

}

function takePluginData(params) {

}

function takePluginState(params) {

}

const handler = {
  'toggle:add': toggleAddPlugin,
  'toggle:enable': toggleEnablePlugin,
  'toggle:plugin-fixed': toggleFixPlugin,
  'toggle:widget-fixed': toggleFixPluginWidget,
  'save:state': savePluginState,
  'save:data': savePluginData,

}

ipcMain.handle('plugin', (e, {command, params}) => {
  return handler[command](params)
})

