import {takeData} from "./storage"

let rootConf = null

const WINDOW_SIZE = {
  small: {width: 920, height: 600,},
  medium: {width: 1020, height: 660}
}

// 1-8 从低到高，值越大，级别越高
const STAY_TOP_LEVEL = [
  "floating", "torn-off-menu", "modal-panel",
  "main-menu", "status", "pop-up-menu", "screen-saver"
]


export const initConfig = () => {
  rootConf = takeData({path: 'root'})
}

export const getWindowSize = () => {
  let windowSizeName = rootConf.appearance.windowSize
  return WINDOW_SIZE[windowSizeName] ?? WINDOW_SIZE['medium']
}

export const closeAsHidden = () => {
  return rootConf.behavior.closeAsHidden
}

export const stayTopLevel = () => {
  let level = rootConf.behavior.stayTopLevel
  return STAY_TOP_LEVEL[level - 1] ?? STAY_TOP_LEVEL[0]
}

