import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'
import juliaWindowHandler from './api/julia-window.js'
import { ALLOWED_ORIGINS } from './packages/julia-runtime/src/origins.js'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

const juliaWindowDevApi = {
  name: 'julia-window-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/julia-window', async (req, res) => {
      const chunks = []
      let size = 0
      try {
        if (req.method === 'POST') {
          for await (const chunk of req) {
            size += chunk.length
            if (size > 4096) {
              res.statusCode = 413
              res.end(JSON.stringify({ error: 'Request body is too large' }))
              return
            }
            chunks.push(chunk)
          }
          if (size) {
            try {
              req.body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Request body must be valid JSON' }))
              return
            }
          }
        }
        res.status = (status) => {
          res.statusCode = status
          return res
        }
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(payload))
          return res
        }
        await juliaWindowHandler(req, res)
      } catch (error) {
        console.error('[Julia window dev API] Request failed:', error.message)
        if (!res.headersSent) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'Julia session issuer failed' }))
        }
      }
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), juliaWindowDevApi],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT || 5174),
    strictPort: true,
    cors: { origin: ALLOWED_ORIGINS, preflightContinue: true },
  },
  resolve: {
    alias: {
      'react': path.resolve(projectRoot, './node_modules/react'),
      'react-dom': path.resolve(projectRoot, './node_modules/react-dom'),
    }
  }
})
