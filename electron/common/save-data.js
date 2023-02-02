// docs: https://github.com/sindresorhus/conf
import Conf from 'conf'
import {ipcMain, app} from "electron";
import {join} from "node:path";

const createOptions = (name) => {
    // [ user data dir ]
    // console.log(app.getPath('userData'))
    // [ app exec dir ]
    // console.log(app.getAppPath())
    const path = join(app.getPath('userData'), 'nanote-data')
    return {cwd: path, configName: name}
}

const store = {
    common: new Conf(createOptions('common')),
    bookmark: new Conf(createOptions('bookmark')),
    plugin: new Conf(createOptions('plugin'))
}

/**
 * TODO check 'null' values and remove, 'null' values will happen when
 * store.plugin.set('$', [
 *     {name: 'hello', value: 100},
 *     {name: 'hello', value: 200},
 *     {name: 'hello', value: 300}
 * ])
 * store.plugin.delete('$[1]')
 */
const removeNull = (arr) => {
    let healthyArr = []
    console.log(typeof arr)
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i] !== null) {
            if (arr[i].subdir) {
                arr[i].subdir = removeNull(arr[i].subdir)
                healthyArr.push(arr[i])
            } else {
                healthyArr.push(arr[i])
            }
        }
    }
    return healthyArr
}


// init bookmark store if first loading
const count = store.bookmark.size
console.log({'bookmark-count': count})
const res = store.bookmark.get('$')
if (!Array.isArray(res)) {
    store.bookmark.set('$', [])
} else {
    const healthyData = removeNull(res)
    store.bookmark.set('$', healthyData)
}

/**
 * take data in default db [config.json]
 * params: object
 * { path: string }
 */
export const takeData = (e, params) => {
    return store.common.get(params.path)
}

/**
 * save in default db [config.json]
 * params: object
 * { path: string, value: any }
 */
export const saveData = (e, params) => {
    store.common.set(params.path, params.value)
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
        delete item[name]
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
ipcMain.handle('data:saveAt', saveSpecialData)
ipcMain.handle('data:takeAt', takeSpecialData)
ipcMain.handle('data:countSizeAt', countSpecialSize)
ipcMain.handle('data:removeAt', removeSpecialData)
