import {ipcMain} from 'electron'

// ipcMain.handle('open-win', (_, arg) => {
//     const childWindow = new BrowserWindow({
//         webPreferences: {
//             preload,
//             nodeIntegration: true,
//             contextIsolation: false,
//         },
//     })
//
//     if (process.env.VITE_DEV_SERVER_URL) {
//         childWindow.loadURL(`${url}#${arg}`)
//     } else {
//         childWindow.loadFile(indexHtml, {hash: arg})
//     }
// })
//
// -------------------------- 以上为模板默认生成 ----------------------------