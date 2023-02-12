import {defineConfig} from 'vite';
import {fileURLToPath} from "node:url";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: ".vite/electron/preload"
  }
});
