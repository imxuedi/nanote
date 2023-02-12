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

// 最小化到托盘图标而不是关闭
const CLOSE_AS_HIDDEN = true


export const getWindowSize = (name) => WINDOW_SIZE[name] ?? WINDOW_SIZE['medium']
export const closeAsHidden = () => CLOSE_AS_HIDDEN
