import {ipcRenderer, contextBridge} from 'electron'
import {useLoading} from "./loading"

// 只有主窗口需要加载动画
if (location.pathname === '/') {
  useLoading()
}

const api = {
  // params: { action: 'minimize|close|top', options: '' }
  setWindowState: (params) => ipcRenderer.invoke('win:state', params),
  // params: { type: 'browser|file', args: 'url|location' }
  openItem: (params) => ipcRenderer.invoke('open:item', params),

  saveLocalData: (params) => ipcRenderer.invoke('data:save', params),
  takeLocalData: (params) => ipcRenderer.invoke('data:take', params),

  handlePlugin: (params) => ipcRenderer.invoke('plugin', params),
  // env: () => ipcRenderer.invoke('env'),

  // saveSpecialData: (params) => ipcRenderer.invoke('data:saveAt', params),
  // takeSpecialData: (params) => ipcRenderer.invoke('data:takeAt', params),
  removeSpecialData: (params) => ipcRenderer.invoke('data:removeAt', params),
  countSpecialSize: (params) => ipcRenderer.invoke('data:countSizeAt', params),
}

const key = {
  // 利用 Symbol 不可遍历的特性
  value: Symbol('secret'),
  visited: false
}

contextBridge.exposeInMainWorld('api', {
  getKey() {
    if (!key.visited) {
      key.visited = true
      return key.value;
    }
    return null
  },
  [key.value]: api
})


// 加载 vue devtools
// ipcRenderer.invoke('env').then(data => {
//   if (data.isDev) {
//     let script = document.createElement('script')
//     script.src = "http://localhost:" + data.devtoolPort
//     document.addEventListener('DOMContentLoaded', () => {
//       document.head.append(script)
//     })
//   }
// })
