import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const projectFile = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        landing: projectFile('./index.html'),
        admin: projectFile('./admin.html'),
      },
    },
  },
})
