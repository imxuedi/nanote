/**
 * @class
 * @author Nickel
 * @copyright Nickel All rights reserved.
 *
 */
export default class Nanote {
  /**
   *
   * @param name {string} 插件名称 [必须]
   * @param type {'widget' | 'main'} [可选] Nanote类型，默认是 main
   */
  constructor({type = 'main', name}) {
    this.hooks = {
      bootstrap: [],
      mount: [],
      unmount: [],
      themeMode: []
    }
    this.listeners = {}
    this.type = type
    if (!name) throw new Error("[Nanote] ------ param 'name' must be provided")
    this.name = name
  }

  onBootstrap(fn) {
    this.hooks.bootstrap.push(fn)
  }

  onMounted(fn) {
    this.hooks.mount.push(fn)
  }

  onUnmount(fn) {
    this.hooks.unmount.push(fn)
  }

  /**
   * @description 事件处理
   *
   * @param event {'themeMode'} 事件名
   * @param listener {function} 回调函数
   */
  on(event, listener) {
    if (event === 'themeMode') {
      this.listeners.themeMode = listener
    } else {
      console.warn('[Nanote] ------ invalid event ', event)
    }
  }

  /**
   * @description 导出生命周期函数 [必须]，在项目入口文件（通常是 main.js），填入类似语句
   * @example
   * const nanote = new Nanote()
   * // ...
   * export default nanote.createHooks()
   *
   */
  createHooks() {
    const that = this
    return {
      async bootstrap() {
        that.hooks.bootstrap.forEach(fn => fn())
      },
      async mount(props) {
        that.props = props
        that.hooks.bootstrap.forEach(fn => fn())
      },
      async unmount() {
        that.hooks.bootstrap.forEach(fn => fn())
      }
    }
  }

  /**
   * 推送消息到顶部栏
   *
   * @param content
   */
  createMessage(content) {
    this.props.createMessage(this.name, content)
  }

  /**
   * 推送消息到宿主机
   *
   * @param content
   */
  createNotification(content) {
    this.props.createNotification(this.name, content)
  }

  /**
   * 推送消息到自定义服务
   *
   * @param args 自定义数据
   */
  sendMessage(args) {
    this.props.sendMessage(this.name, args)
  }
}
