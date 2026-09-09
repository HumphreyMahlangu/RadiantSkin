import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = {
    '/api': {
      target: env.API_PROXY_TARGET || 'http://127.0.0.1:8080',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api(?=\/|$)/, ''),
    },
  }
  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, proxy },
  }
})
