import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Dts from 'vite-plugin-dts'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    Vue(),
    Dts({ cleanVueFileName: true }),
    AutoImport({
      imports: ['vue', 'vue/macros'],
      dts: 'src/types/auto-imports.d.ts',
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: { globals: { vue: 'Vue' } },
    },
  },
})
