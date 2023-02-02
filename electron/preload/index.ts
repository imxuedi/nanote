import './loading.js'

const {ipcRenderer, contextBridge} = require('electron')
contextBridge.exposeInMainWorld('IPC_API', {
    minimizeWindow: () => ipcRenderer.invoke('ui:minimize'),
    closeWindow: () => ipcRenderer.invoke('ui:close'),

    showInFolder: (params) => ipcRenderer.invoke('show:folder', params),
    showInBrowser: (params) => ipcRenderer.invoke('show:browser', params),

    saveLocalData: (params) => ipcRenderer.invoke('data:save', params),
    takeLocalData: (params) => ipcRenderer.invoke('data:take', params),
    saveSpecialData: (params) => ipcRenderer.invoke('data:saveAt', params),
    takeSpecialData: (params) => ipcRenderer.invoke('data:takeAt', params),
    removeSpecialData: (params) => ipcRenderer.invoke('data:removeAt', params),
    countSpecialSize: (params) => ipcRenderer.invoke('data:countSizeAt', params),
})
