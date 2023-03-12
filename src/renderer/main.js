import {createApp} from 'vue'
import {createPinia} from "pinia"
import "@/style/main.css"
import App from './App.vue'
import {useIPC} from "./hooks/useIPC"
useIPC()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
