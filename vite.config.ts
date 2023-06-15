import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-ssg-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages(),
    Layouts(),
  ],

  server: {
    watch: {
      // Necessary so that vite works inside Docker with WSL2
      usePolling: true,
    },
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
    ]
  },

  // https://github.com/antfu/vite-ssg
  // @ts-ignore
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false,
    },
    onFinished() { generateSitemap(); },
  },

})
