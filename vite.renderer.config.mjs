import {defineConfig} from 'vite';
import {fileURLToPath} from "node:url";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config
export default defineConfig(({command, mode}) => {
  const isDev = command === 'serve'
  return {
    plugins: [vue()],
    build: {
      sourcemap: isDev
    },
    publicDir: 'src/public',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/renderer', import.meta.url))
      }
    }
  }
});
