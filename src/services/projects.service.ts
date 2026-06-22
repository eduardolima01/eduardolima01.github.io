import { loadFromUrl, createEmpty, run, query, exportBytes } from '@/lib/db'
import type { Project } from '@/types/project.types'

export const PROJECTS_SCHEMA = `
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

interface ProjectRow {
  id: string
  status: string
  title: string
  subtitle: string
  description: string
  github: string | null
  demo: string | null
  technologies: string | null // JSON
  images: string | null // JSON
  created_at: string
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    status: row.status,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    technologies: row.technologies ? JSON.parse(row.technologies) : undefined,
    image: row.images ? JSON.parse(row.images) : [],
  }
}

export type ProjectInput = {
  status: string
  title: string
  subtitle: string
  description: string
  github?: string
  demo?: string
  technologies?: string[]
  image?: string[]
}

const PROJECTS_DB_URL = `${import.meta.env.BASE_URL}db.sqlite`

export async function initPublicDatabase(): Promise<void> {
  await loadFromUrl(PROJECTS_DB_URL)
}

export function listProjects(): Project[] {
  const rows = query<ProjectRow>('SELECT * FROM projects ORDER BY created_at DESC;')
  return rows.map(rowToProject)
}

export async function initAdminDatabase(): Promise<void> {
  try {
    await loadFromUrl(PROJECTS_DB_URL)
  } catch {
    await createEmpty(PROJECTS_SCHEMA)
  }
}

export function addProject(data: ProjectInput): void {
  const id = crypto.randomUUID()
  run(
    `INSERT INTO projects
      (id, status, title, subtitle, description, github, demo, technologies, images)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      data.status,
      data.title,
      data.subtitle,
      data.description,
      data.github ?? null,
      data.demo ?? null,
      data.technologies?.length ? JSON.stringify(data.technologies) : null,
      data.image?.length ? JSON.stringify(data.image) : null,
    ]
  )
}

export function updateProject(id: string, data: ProjectInput): void {
  run(
    `UPDATE projects SET
      status = ?, title = ?, subtitle = ?, description = ?,
      github = ?, demo = ?, technologies = ?, images = ?
     WHERE id = ?;`,
    [
      data.status,
      data.title,
      data.subtitle,
      data.description,
      data.github ?? null,
      data.demo ?? null,
      data.technologies?.length ? JSON.stringify(data.technologies) : null,
      data.image?.length ? JSON.stringify(data.image) : null,
      id,
    ]
  )
}

export function deleteProject(id: string): void {
  run('DELETE FROM projects WHERE id = ?;', [id])
}

export async function saveDatabase(): Promise<void> {
  const bytes = exportBytes()
  const res = await fetch('/__save-db', {
    method: 'POST',
    body: bytes.buffer as ArrayBuffer,
  })
  if (!res.ok) {
    throw new Error(`Falha ao salvar: ${res.status} ${res.statusText}`)
  }
}
