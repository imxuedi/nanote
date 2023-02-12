import {defineConfig} from 'vite';
import {fileURLToPath} from "node:url";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config
export default defineConfig({
  publicDir: 'src/public',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [vue()]
});
