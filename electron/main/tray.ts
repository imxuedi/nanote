import {Tray, Menu, nativeImage} from 'electron'

let tray = null
export const createTray = (core) => {
    const icon = nativeImage.createFromPath('./notes.png')
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主界面',
            click: () => {
                core.ui_toggle_close()
            }
        },
        {
            label: '退出程序',
            click: () => {
                core.ui_direct_close()
            }
        }
    ])
    tray.setContextMenu(contextMenu)
    tray.setToolTip('Nanote')
    // title 只在 macos 上起作用
    tray.setTitle('This is my title')
}
