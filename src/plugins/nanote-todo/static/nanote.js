// 添加 qiankun 入口
const render = ($) => {
  $('#purehtml-container').html('Hello, render with jQuery');
  return Promise.resolve();
};

((global) => {

  global['obuok'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      // console.log(window.IPC_API);
      console.log('purehtml mount');
      return render($);
    },
    unmount: () => {
      console.log('purehtml unmount');
      return Promise.resolve();
    },
    update: () => {
      console.log('purehtml update');
      return Promise.resolve();
    }
  };
})(window);