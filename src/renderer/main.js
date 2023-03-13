import {useIPC} from "./hooks/useIPC"
import devtools from '@vue/devtools'
import {createApp} from 'vue'
import {createPinia} from "pinia"
import "@/style/main.css"
import App from './App.vue'

useIPC().then(() => {
  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)
  app.mount('#app')
  // devtools.connect(null, 7466)
})
