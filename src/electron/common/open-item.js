import {ipcMain, shell, app} from "electron"
import {join} from "node:path";

const show_in_browser = async (e, url) => {
    await shell.openExternal(url)
}

/**
 * name or path, only one need
 *
 * suffix 弥补 name 不能打开特定文件的不足, 如 name: userData, suffix: config.json
 * 则 path 为 userData/config.json
 *
 * name: 'home' | 'appData' | 'userData'
 * path format: C:\\dir1\\dir2\\abc.txt
 */
const show_in_folder = async (e, {name, path, suffix}) => {
    if (path) {
        await shell.showItemInFolder(path)
        return
    }
    const _path = app.getPath(name)
    if (suffix) {
        await shell.showItemInFolder(join(_path, suffix))
    } else {
        await shell.showItemInFolder(_path)
    }
}

ipcMain.handle('show:browser', show_in_browser)
ipcMain.handle('show:folder', show_in_folder)
