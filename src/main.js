import {createApp} from 'vue'
import "@/style/main.css"
import "@/style/index.sass"
import App from './App.vue'
// import {ipcHandler} from "@/message/main";

const app = createApp(App)
    .mount('#app')
    .$nextTick(() => {
        // postMessage({ payload: 'removeLoading' }, '*')
    })

// ipcHandler(app.provide)
