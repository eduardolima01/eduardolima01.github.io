import initSqlJs from 'sql.js'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const OUTPUT_PATH = join(
  __dirname,
  '..',
  'public',
  'db.sqlite'
)

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,

    status TEXT NOT NULL,

    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',

    story TEXT,
    problem TEXT,
    solution TEXT,
    result TEXT,

    featured INTEGER NOT NULL DEFAULT 0,

    github TEXT,
    demo TEXT,

    technologies TEXT,
    images TEXT,

    created_at TEXT NOT NULL DEFAULT (
      datetime('now')
    )
  );
`

const SEED_PROJECTS = [
  {
    status: 'concluido',

    featured: true,

    title: 'TrackFlow',

    subtitle:
      'Plataforma de rastreamento de entregas em tempo real',

    description:
      'Aplicação inspirada em soluções como iFood e Mercado Livre para acompanhamento de entregas.',

    story:
      'O projeto nasceu da necessidade de demonstrar conhecimentos além de um CRUD tradicional, abordando geolocalização, atualização em tempo real e arquitetura frontend.',

    problem:
      'Usuários têm dificuldade em acompanhar o progresso das entregas de forma clara e intuitiva.',

    solution:
      'Foi criada uma interface moderna com atualização contínua da posição do entregador e histórico de eventos.',

    result:
      'Projeto utilizado como estudo de arquitetura frontend, modelagem de dados e experiência do usuário.',

    github:
      'https://github.com/seu-usuario/trackflow',

    demo: '',

    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'SQLite',
    ],

    image: [
      'trackflow-cover.png',
      'trackflow-map.png',
      'trackflow-dashboard.png',
    ],
  },
]

async function main() {
  const SQL = await initSqlJs()

  const db = new SQL.Database()

  db.run(SCHEMA)

  for (const p of SEED_PROJECTS) {
    db.run(
      `
        INSERT INTO projects (
          id,

          status,

          title,
          subtitle,
          description,

          story,
          problem,
          solution,
          result,

          featured,

          github,
          demo,

          technologies,
          images
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        randomUUID(),

        p.status,

        p.title,
        p.subtitle,
        p.description,

        p.story,
        p.problem,
        p.solution,
        p.result,

        p.featured ? 1 : 0,

        p.github || null,
        p.demo || null,

        p.technologies?.length
          ? JSON.stringify(p.technologies)
          : null,

        p.image?.length
          ? JSON.stringify(p.image)
          : null,
      ]
    )
  }

  const bytes = db.export()

  await writeFile(
    OUTPUT_PATH,
    bytes
  )

  console.log(
    `✓ Banco gerado em ${OUTPUT_PATH}`
  )

  console.log(
    `  ${SEED_PROJECTS.length} projeto(s) inicial(is).`
  )
}

main().catch((err) => {
  console.error(
    'Erro ao gerar o banco:',
    err
  )

  process.exit(1)
})
