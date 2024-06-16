import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { compression } from 'vite-plugin-compression2';
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    vue(),
    compression({
      threshold: 1024 * 5,
      skipIfLargerOrEqual: true,
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: require('./package.json').name || 'Vite App',
        }
      }
    }),
    AutoImport({}),
    Components({}),
  ],
})
