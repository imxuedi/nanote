import {defineConfig} from 'vite';

// https://vitejs.dev/config
export default defineConfig(({command}) => {
  const isDev = command === 'serve'
  return {
    publicDir: 'src/electron/static',
    build: {
      sourcemap: isDev,
      outDir: ".vite/electron"
    }
  }
});
