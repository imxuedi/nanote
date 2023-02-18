import {app} from 'electron'
import {join} from "node:path"

// ------------- 返回文件（夹）的绝对路径 -----------------
// 将来也可以适配自定义数据位置

const appPath = app.getAppPath()
const userDataPath = app.getPath('userData')
const tempPath = app.getPath('temp')

/**
 * 返回一些绝对路径
 *
 * @param {string} name 文件名
 * @param {Object} [options]
 * @param {string} options.db 当数据过大分库时有用
 */
export const usePath = (name, options) => {
  switch (name) {
    case 'config': {
      return isDev ?
        join(appPath, 'src/user-data/common.json') :
        join(userDataPath, 'nanote-data/user-data/common.json')
    }
    case 'data': {
      return isDev ?
        join(appPath, `src/user-data/db${options.db ?? 0}.json`) :
        join(userDataPath, `nanote-data/user-data/db${options.db ?? 0}.json`)
    }
    case 'temp': {
      return join(tempPath, 'nanote-temp')
    }
  }
}