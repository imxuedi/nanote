import chalk from "chalk";

const log = console.log

const contentToString = (content) => {
  let str = ''
  for (let item of content) {
    if (typeof item === 'string') {
      str += item
      continue
    }
    str += item.toString()
  }
  return str
}

export const useLogger = {
  error: (...content) => {
    log(chalk.bgHex('#f7e1e1').hex('#bc3e33')(`  ${contentToString(content)}  `))
  },
  info: (...content) => {
    log(chalk.bgHex('#d4eef9').hex('#146a90')(`  ${contentToString(content)}  `))
  },
  warn: (...content) => {
    log(chalk.bgHex('#fff5d8').hex('#886701')(`  ${contentToString(content)}  `))
  },
  purple: (...content) => {
    log(chalk.bgHex('#f4d7f3').hex('#782175')(`  ${contentToString(content)}  `))
  }
}