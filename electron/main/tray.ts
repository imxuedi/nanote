import {Tray, Menu, nativeImage} from 'electron'
import {join} from "node:path";

let tray = null
export const createTray = (core) => {
    // 开发时静态文件放在最外层的 public 目录下
    const path = join(__dirname, "../../public/notes.png")
    const icon = nativeImage.createFromPath(path)
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {
            id: '1',
            label: '显示主界面',
            click: () => {
                core.ui_toggle_close()
            },
            visible: false,
        },
        {
            id: '2',
            label: '隐藏主界面',
            click: () => {
                core.ui_toggle_close()
            },
            visible: true,
        },
        {
            id: '3',
            label: '退出程序',
            role: 'quit'
        }
    ])

    // '显示主界面' 和 '隐藏主界面的' 菜单的切换
    // TODO 存在右键菜单二次点击显示才正确的 BUG
    contextMenu.on('menu-will-show', () => {
        // console.log({visible: core.win.isVisible()})
        // console.log({hide: core.win.isHidden()})

        if (core.ui_window_open()) {
            contextMenu.items[0].visible = false
            contextMenu.items[1].visible = true
        } else {
            contextMenu.items[0].visible = true
            contextMenu.items[1].visible = false
        }
    })

    // 单击显示主界面
    // linux 不一定是左键, 将来可能要做兼容设置
    tray.on('click', () => core.ui_window_show())

    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.setToolTip('Nanote Box')
    // title 只在 macos 上起作用
    tray.setTitle('Nanote Box')
}
