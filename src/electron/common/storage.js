import {app, ipcMain, Notification} from "electron";
import {join} from 'node:path'
import {Low} from 'lowdb'
import {JSONFile} from 'lowdb/node'
import lodash from 'lodash'

let store = {};
let readyState = 'loading'


/**
 * lowdb 在 lodash 加持下更加强大
 */
class LowWithLodash extends Low {
  constructor(adapter) {
    super(adapter);
    this.chain = lodash.chain(this).get('data');
  }
}

/**
 * 数据库初始化配置
 */
async function initStorage() {
  if (readyState === 'complete') return
  let path
  if (isDev) {
    path = join(app.getAppPath(), 'src/user-data')
  } else {
    path = join(app.getPath('userData'), 'nanote-data')
  }
  // 读取基本配置
  const adapter = new JSONFile(join(path, 'common.json'))
  store.base = new LowWithLodash(adapter)
  await store.base.read()
  // 基本配置文件被意外删除
  if (!store.base) {
    new Notification({
      title: "数据文件丢失", body: "错误: #300, 数据文件意外丢失"
    }).show()
    app.exit()
  }
  // 运行数据
  const {storage} = store.base.data
  for (let dbName of storage.db) {
    const adapter = new JSONFile(join(path, dbName + ".json"))
    store[dbName] = new LowWithLodash(adapter)
    await store[dbName].read()
    store[dbName].data ||= {}
    await store[dbName].write()
  }
  readyState = 'complete'
}

/**
 * take data in default db [common.json]
 */
export const takeData = async (e, params) => {
  if (readyState !== 'complete') {
    await initStorage()
  }
  // electron 内部调用
  params ??= e
  const {path, conditions} = params
  // if (conditions) {
  //   data.find()
  // }
  if (path === 'root') {
    return store.base.data
  }
  return store.base.chain.get(path).value()
}

/**
 * save in default db [config.json]
 * params: object
 * { path: string, value: any }
 */
export const saveData = async (e, params) => {
  // electron 内部调用
  params ??= e
  const {path, value} = params
  store.base.chain.set(path, value).value()
  await store.base.write()
}

/**
 * save data in specified db
 * params: object
 * { db: string, path: string, value: any }
 */
export const saveSpecialData = (e, params) => {
  const {db, path, value} = params
  if (store.hasOwnProperty(db)) {
    store[db].set(path, value)
  }
}

/**
 * take data in specified db
 * params: object
 * { db: string, path: string, excludes: array<string> }
 */
export const takeSpecialData = (e, params) => {
  const {db, path, excludes = []} = params
  console.log({takeSpecialData: params})
  if (!store.hasOwnProperty(db)) return null
  if (!excludes.length) {
    return store[db].get(path)
  }
  const res = store[db].get(path)
  if (Array.isArray(res)) {
    return res.map(item => {
      if (!item) return null
      excludes.forEach(name => {
        delete item[name]
      })
      return item
    })
  }
  excludes.forEach(name => {
    delete res[name]
  })
  return res
}

export const countSpecialSize = (e, params) => {
  const {db, path} = params
  if (!store.hasOwnProperty(db)) return -1
  const result = store[db].get(path)
  if (Array.isArray(result)) {
    return result.length
  }
  return -1
}

export const removeSpecialData = (e, params) => {
  const {db, path} = params
  if (!store.hasOwnProperty(db)) return -1
  store[db].delete(path)
}

ipcMain.handle('data:save', saveData)
ipcMain.handle('data:take', takeData)
// ipcMain.handle('data:saveAt', saveSpecialData)
// ipcMain.handle('data:takeAt', takeSpecialData)
// ipcMain.handle('data:countSizeAt', countSpecialSize)
// ipcMain.handle('data:removeAt', removeSpecialData)
