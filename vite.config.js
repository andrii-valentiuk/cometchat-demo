import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // CodeSandbox (and similar) proxies the dev server under *.csb.app hostnames.
  server: {
    allowedHosts: ['.csb.app', '.codesandbox.io'],
  },
  preview: {
    allowedHosts: ['.csb.app', '.codesandbox.io'],
  },
})
