import {app, ipcMain} from 'electron'
import {join} from "node:path"
import {saveData, takeData} from "./storage";
import Koa from 'koa'
import serve from 'koa-static'
import fs from 'fs'
import snarkdown from "snarkdown";

const fm = require('front-matter')

let manifestCache = {}
let pluginPath = ''


// ----------------- 静态文件服务器 ------------------
// 插件的访问都是基于 http 的，所以配置静态文件服务器

export const initKoaApp = () => {
  const koaApp = new Koa({})
  if (isDev) {
    pluginPath = join(app.getAppPath(), 'src/plugins')
  } else {
    pluginPath = join(app.getPath('userData'), 'nanote-data/plugins')
  }
  koaApp.use(async (ctx, next) => {
    console.log("[Nanote-Plugin-Koa] ------ request file ", ctx.request.url)
    if (isDev) {
      ctx.set("Access-Control-Allow-Origin", '*')
      ctx.set("Access-Control-Allow-Methods", "OPTIONS,GET")
    }
    await next()
  })
  koaApp.use(serve(pluginPath))
  /**
   * why 7465?
   * nanote 的 16 进制形式是 6e616e6f7465
   * 取后四位便是 7465
   */
  koaApp.listen(7465, () => {
    console.log("[Nanote-Plugin-Koa] ------ app is listening on 7465")
    console.log("[Nanote-Plugin-Koa] ------ app is serving at", pluginPath)
  })
}


// ----------------- 加载插件脚本 (xxx.js) ------------------
// 有的插件有自己运行脚本的需求，所以要动态加载

export const loadPluginScript = () => {
  const plugins = takeData({path: "plugins"})
  for (let pluginName in plugins) {
    if (plugins[pluginName].enable) {
      // 加载对应的 node 文件（如果有）
      console.log(`load plugin [${pluginName}] scripts`)
    }
  }
}


// ----------------- 解析 manifest 并缓存 ------------------
// 使用 snarkdown 解析 markdown，front-matter 解析 front matter

const parseManifest = (filePath, name) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        reject(name)
        return
      }
      resolve({...fm(data), name})
    })
  })
}

export const createManifestCache = () => {
  fs.readdir(pluginPath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      return null
      // TODO APP 应该立即 quit，并给出提示
    }
    let tasks = data.map(item => parseManifest(join(pluginPath, item, 'manifest.md'), item))
    let callback = ({status, value, reason}) => {
      if (status === 'rejected') {
        console.log('parse manifest fail, reason: ', reason)
        manifestCache[reason] = {html: '解析错误，manifest 不符合格式', attributes: {}}
      }
      let {name, attributes, body} = value
      manifestCache[name] = {html: snarkdown(body), attributes}
      console.log("[Nanote-Parse-Manifest] ------", name)
    }
    Promise.allSettled(tasks).then(results => results.forEach(callback))
  })
}


// ----------------- IPC 接口 ------------------
// 处理插件的 IPC 事件

/**
 * 获取 Manifest 解析后的缓存
 */
const getManifestCache = ({name}) => {
  return manifestCache[name] ?? "no cache"
}


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
  'take:manifest': getManifestCache
}

ipcMain.handle('plugin', (e, {command, params}) => {
  return handler[command](params)
})

