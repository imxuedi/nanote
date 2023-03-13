import {defineStore} from "pinia"
import {useTest} from "../hooks/useRegex"
import {generate, presetDarkPalettes, presetPalettes} from '@ant-design/colors'

export const useThemeStore = defineStore('color', {
  state: () => ({
    darkMode: false,
    color: {
      BASE1: "#000",
      BASE2: "#000",
      BASE3: "#000",
      BASE4: "#000",
      BASE5: "#000",
      BASE6: "#000",
      BASE7: "#000",
      BASE8: "#000",
      BASE9: "#000",
      BASE10: "#000",
      primary: '#000',
      background: '#000',
      focused: '#000',
      hover: '#000'
    },
  }),
  actions: {
    patchColor(primaryColor, darkMode) {
      let result = {ORIGIN: primaryColor}
      let colors = null
      // 自定义十六进制颜色
      if (useTest('hexColor', primaryColor)) {
        if (darkMode) {
          colors = generate(primaryColor, {theme: 'dark', backgroundColor: '#14141c'})
        } else {
          colors = generate(primaryColor)
        }
      }
      // AntDesign 预设色板
      else {
        if (darkMode) {
          colors = presetDarkPalettes[primaryColor] ?? presetDarkPalettes['blue']
        } else {
          colors = presetPalettes[primaryColor] ?? presetPalettes['blue']
        }
      }
      result.primary = colors[5]
      colors.forEach((item, index) => {
        result["BASE" + (index + 1)] = item
      })
      if (darkMode) {
        result = {
          ...result,
          background: '#2c2c2e',
          focused: '#636366',
          hover: '#48484a',
          content: '#1c1c1e',
          icon: colors[7]
        }
      } else {
        result = {
          ...result,
          background: colors[1],
          focused: colors[3],
          hover: colors[2],
          content: '#fff',
          icon: colors[4]
        }
      }
      this.$patch({color: result, darkMode})
    }
  },
  getters: {
    cssVariable: (state) => {
      let result = {}
      for (let item in state.color) {
        result['--' + item] = state.color[item]
      }
      return result
    }
  }
})
