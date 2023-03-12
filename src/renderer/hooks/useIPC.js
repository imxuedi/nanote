let api = null
export const useIPC = () => {
  let key = window.api.getKey()
  api = window.api[key]
  if (!api) throw new Error('invalid IPC_API in useIPC.js')
}

export {api as IPC_API}
