// 添加 qiankun 入口
const render = (props) => {
  console.log({props})
  const {onMount, onUnmount} = window
  const {name: appName} = props
  onMount && onMount({
    takeData: (args) => {
      return props.takeData(appName, args)
    },
    saveData: (args) => {
      return props.saveData(appName, args)
    }
  })
}


((global) => {
  global['nanote-todo'] = {
    bootstrap: (xx) => {
      console.log({xx})
      return Promise.resolve();
    },
    mount: (props) => {
      return render(props)
    },
    unmount: () => {
      onUnmount()
      return Promise.resolve();
    },
    update: () => {
      return Promise.resolve();
    }
  };
})(window);
