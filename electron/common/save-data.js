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

// init bookmark store if first loading
const count = store.bookmark.size
console.log({'bookmark-count': count})
const res = store.bookmark.get('$')
if (!Array.isArray(res)) {
    store.bookmark.set('$', [])
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
    console.log({params})
    if (!store.hasOwnProperty(db)) return null
    if (!excludes.length) {
        return store[db].get(path)
    }
    const res = store[db].get(path)
    if (Array.isArray(res)) {
        return res.map(item => {
            excludes.forEach(name => {
                delete item[name]
            })
            return item
        })
    }
    excludes.forEach(item => {
        delete res[item]
    })
    return res
}

ipcMain.handle('data:save', saveData)
ipcMain.handle('data:take', takeData)
ipcMain.handle('data:saveAt', saveSpecialData)
ipcMain.handle('data:takeAt', takeSpecialData)