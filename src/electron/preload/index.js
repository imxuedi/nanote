import './loading.js'
import {ipcRenderer, contextBridge} from 'electron'


contextBridge.exposeInMainWorld('IPC_API', {
  // params: { action: 'minimize|close|top', options: '' }
  setWindowState: (params) => ipcRenderer.invoke('win:state', params),
  // params: { type: 'browser|file', options: 'url|location' }
  showItem: (params) => ipcRenderer.invoke('show:item', params),

  saveLocalData: (params) => ipcRenderer.invoke('data:save', params),
  takeLocalData: (params) => ipcRenderer.invoke('data:take', params),
  saveSpecialData: (params) => ipcRenderer.invoke('data:saveAt', params),
  takeSpecialData: (params) => ipcRenderer.invoke('data:takeAt', params),
  removeSpecialData: (params) => ipcRenderer.invoke('data:removeAt', params),
  countSpecialSize: (params) => ipcRenderer.invoke('data:countSizeAt', params),
})
