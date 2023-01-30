import {createApp} from 'vue'
import "@/style/main.css"
import "@/style/index.sass"
import App from './App.vue'

const app = createApp(App)
    .mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })
