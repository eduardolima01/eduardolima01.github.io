import { useEffect, useState } from 'react'
import { initPublicDatabase, listProjects } from '@/services/projects.service'
import type { Project } from '@/types/project.types'
import { ProjectCard } from '@/components/ProjectCard'

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel">
      <div className="aspect-video w-full animate-pulse bg-bg" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-bg" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-bg" />
        <div className="h-3 w-full animate-pulse rounded bg-bg" />
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initPublicDatabase()
      .then(() => setProjects(listProjects()))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Portfolio
        </p>
        <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Projetos</h2>
      </header>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-center text-sm text-danger">
          Erro ao carregar projetos: {error}
        </p>
      )}

      {!error && loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!error && !loading && projects.length === 0 && (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-sm text-muted">
          Nenhum projeto publicado ainda.
        </p>
      )}

      {!error && !loading && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  )
}
