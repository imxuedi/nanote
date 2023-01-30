import {ipcMain,shell} from "electron"

const show_in_browser = async (e, url) => {
    await shell.openExternal(url)
}

/**
 * path format: C:\\dir1\\dir2\\abc.txt
 */
const show_in_folder = async (e, path) => {
    await shell.showItemInFolder(path)
}

ipcMain.handle('show:browser', show_in_browser)
ipcMain.handle('show:folder', show_in_folder)
