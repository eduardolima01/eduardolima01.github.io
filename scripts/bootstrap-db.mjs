import initSqlJs from 'sql.js'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'public', 'db.sqlite')

// Precisa bater com PROJECTS_SCHEMA em src/services/projects.service.ts
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    github TEXT,
    demo TEXT,
    technologies TEXT,
    images TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`

const SEED_PROJECTS = [
  {
    status: 'concluido',
    title: 'Projeto exemplo',
    subtitle: 'Um exemplo pra começar',
    description: 'Descrição de exemplo — edite pelo admin.',
    github: 'https://github.com/seu-usuario/projeto-exemplo',
    demo: '',
    technologies: ['react', 'typescript', 'vite'],
    image: [],
  },
]

async function main() {
  const SQL = await initSqlJs()
  const db = new SQL.Database()

  db.run(SCHEMA)

  for (const p of SEED_PROJECTS) {
    db.run(
      `INSERT INTO projects
        (id, status, title, subtitle, description, github, demo, technologies, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        randomUUID(),
        p.status,
        p.title,
        p.subtitle,
        p.description,
        p.github || null,
        p.demo || null,
        p.technologies?.length ? JSON.stringify(p.technologies) : null,
        p.image?.length ? JSON.stringify(p.image) : null,
      ]
    )
  }

  const bytes = db.export()
  await writeFile(OUTPUT_PATH, bytes)

  console.log(`✓ Banco gerado em ${OUTPUT_PATH}`)
  console.log(`  ${SEED_PROJECTS.length} projeto(s) inicial(is).`)
}

main().catch((err) => {
  console.error('Erro ao gerar o banco:', err)
  process.exit(1)
})
