import {ipcRenderer, contextBridge} from 'electron'

contextBridge.exposeInMainWorld('IPC_API', {
  // params: { type: 'browser|file', args: 'url|location' }
  openItem: (params) => ipcRenderer.invoke('open:item', params),
})