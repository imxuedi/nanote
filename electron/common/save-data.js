import Store from 'electron-store'
import {ipcMain} from "electron";

const store = new Store();

export const takeData = (e, path) => {
    return store.get(path)
}

export const saveData = (e, params) => {
    store.set(params.path, params.value)
}

ipcMain.handle('data:save', saveData)
ipcMain.handle('data:take', takeData)