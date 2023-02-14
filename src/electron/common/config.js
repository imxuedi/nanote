import {takeData} from "./storage"

const WINDOW_SIZE = {
  small: {
    width: 920,
    height: 600,
  },
  medium: {
    width: 1020,
    height: 660
  }
}

// 1-8 从低到高，值越大，级别越高
const STAY_TOP_LEVEL = [
  "floating", "torn-off-menu", "modal-panel",
  "main-menu", "status", "pop-up-menu", "screen-saver"
]

// 最小化到托盘图标而不是关闭
// const CLOSE_AS_HIDDEN = true

let rootConf = null

export async function loadUserConfig() {
  if (rootConf === null) {
    rootConf = await takeData({path: 'root'})
  }
  return {
    getWindowSize: () => {
      let windowSizeName = rootConf.appearance.windowSize
      return WINDOW_SIZE[windowSizeName] ?? WINDOW_SIZE['medium']
    },
    closeAsHidden: () => {
      return rootConf.behavior.closeAsHidden
    },
    stayTopLevel: () => {
      let level = rootConf.behavior.stayTopLevel
      return STAY_TOP_LEVEL[level - 1] ?? STAY_TOP_LEVEL[0]
    }
  }
}
