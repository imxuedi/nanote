import {generate, presetPalettes, presetDarkPalettes} from '@ant-design/colors';

/**
 * 使用预设或者自定义色板
 *
 * @param primaryColor {String} eg. #409eff 或 orange
 * @param dark {Boolean}
 */
export const usePalettes = (primaryColor, dark = false) => {
  let result = {}
  // 自定义颜色
  if (primaryColor.startsWith('#')) {
    result.PRIMARY = primaryColor
    generate(primaryColor, {theme: dark ? "dark" : 'default'})
      .forEach((item, index) => {
        result["BASE" + (index + 1)] = item
      })
    return result
  }
  // 预设颜色
  let colors = dark ?
    presetDarkPalettes[primaryColor] ?? presetDarkPalettes['volcano'] :
    presetPalettes[primaryColor] ?? presetPalettes['volcano']
  result.PRIMARY = colors[5]
  colors.forEach((item, index) => {
    result["BASE" + (index + 1)] = item
  })
  return result
}

