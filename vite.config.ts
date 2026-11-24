import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const DEFAULT_BUSTAN_API_URL = 'https://mahsol-api-production.up.railway.app'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const bustanApiUrl = env.BUSTAN_API_URL || DEFAULT_BUSTAN_API_URL

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Forward API calls to the Bustan API so the browser only talks to this
      // origin (no CORS). vercel.json does the same in production.
      proxy: {
        '/api': { target: bustanApiUrl, changeOrigin: true },
      },
    },
  }
})
