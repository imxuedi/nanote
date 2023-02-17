import {useLogger} from "./useLogger";
import {loadMicroApp} from "qiankun";

export const usePlugin = () => {
  return {
    loadSingleApp() {

    }
  }
}

for (let appName of appNames) {
  if (this.loadedApps[appName]) {
    useLogger.warn(`${appName} was already mounted, it will unmount automatically.`)
    this.loadedApps[appName]?.unmount()
    delete this.loadedApps[appName]
  }
  const app = {
    name: appName,
    entry: `//localhost:7465/${appName}/${this.plugins[appName].main.entry}`,
    container: `#${appName}`, // 挂载具体容器 ID
    props: {brand: 'qiankun'}
  }
  this.loadedApps[appName] = loadMicroApp(app)
}