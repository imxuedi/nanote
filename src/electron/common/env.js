import {app, ipcMain} from 'electron'

ipcMain.handle('env', () => {
  return {
    version: app.getVersion(),
    isDev: isDev,
    devtoolPort: 7466
  }
})
