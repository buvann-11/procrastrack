import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// `base` must match the repository name for GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/procrastrack/',
})
