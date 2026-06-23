import { useEffect, useMemo, useState } from 'react'
import { FaGithub } from 'react-icons/fa'

import { ProjectCard } from '@/components/ProjectCard'
import {
  initPublicDatabase,
  listProjects,
} from '@/services/projects.service'

import type { Project } from '@/types/project.types'
import { ProjectModal } from '@/components/project/ProjectModal'

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="aspect-video animate-pulse bg-bg" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-bg" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-bg" />
        <div className="h-4 w-full animate-pulse rounded bg-bg" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-bg" />
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        await initPublicDatabase()

        const data = listProjects()

        setProjects(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar projetos.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured),
    [projects]
  )

  const otherProjects = useMemo(
    () => projects.filter((project) => !project.featured),
    [projects]
  )

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null)

  return (
    <section
      id="projects"
      className="mx-auto max-w-7xl px-4 py-24"
    >
      <header className="mx-auto mb-20 max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Portfólio
        </span>

        <h2 className="mt-4 text-4xl font-bold text-ink sm:text-5xl">
          Projetos
        </h2>

        <p className="mt-6 text-lg leading-relaxed text-muted">
          Projetos desenvolvidos para explorar arquitetura de software,
          experiência do usuário, performance e resolução de problemas
          através de aplicações modernas.
        </p>
      </header>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-center text-danger">
          Erro ao carregar projetos: {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">
            Nenhum projeto publicado ainda.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <>
          {featuredProjects.length > 0 && (
            <div className="mb-20">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-ink">
                  Projetos em Destaque
                </h3>

                <p className="mt-2 text-muted">
                  Aplicações que representam minha forma de pensar
                  arquitetura, organização de código e construção
                  de produtos.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            </div>
          )}

          {otherProjects.length > 0 && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-ink">
                  Explorações e Estudos
                </h3>

                <p className="mt-2 text-muted">
                  Projetos utilizados para aprofundar conhecimentos,
                  validar ideias e experimentar novas abordagens.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {otherProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={setSelectedProject}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 text-center">
            <p className="mb-4 text-muted">
              Mais projetos, estudos e experimentos disponíveis no GitHub.
            </p>

            <a
              href="https://github.com/seuusuario"
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex
                items-center
                gap-3
                rounded-xl
                border
                border-line
                px-6
                py-3
                font-medium
                text-ink
                transition
                hover:bg-panel
              "
            >
              <FaGithub />
              Acessar GitHub
            </a>
          </div>
        </>
      )}
      <ProjectModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
