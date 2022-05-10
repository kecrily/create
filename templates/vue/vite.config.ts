import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({ loose: true }),
    Vue({
      reactivityTransform: true,
    }),
    AutoImport({
      imports: ['vue', 'vue/macros'],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      dts: 'src/types/components.d.ts',
    }),
    // Frontend
    Pages(),
    Layouts(),
    Unocss(),
  ],
})
