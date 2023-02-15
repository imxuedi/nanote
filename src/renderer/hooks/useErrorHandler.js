import {addGlobalUncaughtErrorHandler} from "qiankun";
import {useLogger} from "./useLogger";

// qiankun 全局错误处理
export const handleQiankunError = () => {
  addGlobalUncaughtErrorHandler((event) => {
    const {reason} = event
    useLogger.warn(`[nanote-plugin-${reason.appOrParcelName}] ----------- 发生错误`)
    if (reason.toString().includes('is a read-only and non-configurable data property')) {
      useLogger.info("潘多拉的盒子不可以打开！")
    }
  })
}
