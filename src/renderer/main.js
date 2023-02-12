import {createApp} from 'vue'
// import "@/style/main.css"
// import "@/style/index.sass"
import App from './App.vue'

const app = createApp(App)
  .mount('#app')
  .$nextTick(() => {
    // 由于 vite 构建速度实在太快了，所以不得不让动画加载一会儿
    setTimeout(() => {
      postMessage({payload: 'removeLoading'}, '*')
    }, 500)
  })
