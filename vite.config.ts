import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { writeFile } from 'node:fs/promises'

function saveDbPlugin(filename: string): Plugin {
  return {
    name: 'save-db-locally',
    configureServer(server) {
      server.middlewares.use('/__save-db', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(chunk as Buffer)
        }
        const bytes = Buffer.concat(chunks)

        const outPath = path.resolve(__dirname, 'public', filename)
        await writeFile(outPath, bytes)

        console.log(`✓ ${filename} salvo (${bytes.length} bytes) em ${outPath}`)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: true }))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), saveDbPlugin('db.sqlite')],
  base: "/",
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
