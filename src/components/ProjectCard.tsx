import { FaGithub, FaLink } from 'react-icons/fa'
import type { Project } from '@/types/project.types'

type Props = {
  project: Project
}

const statusStyles: Record<string, string> = {
  'em-andamento': 'bg-amber-100 text-amber-800',
  concluido: 'bg-emerald-100 text-emerald-800',
  pausado: 'bg-zinc-100 text-zinc-600',
}

const statusLabels: Record<string, string> = {
  'em-andamento': 'Em andamento',
  concluido: 'Concluído',
  pausado: 'Pausado',
}

function imageUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}assets/imagens/${filename}`
}

export function ProjectCard({ project }: Props) {
  const cover = project.image?.[0]

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden bg-bg">
        {cover ? (
          <img
            src={imageUrl(cover)}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            sem imagem
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-ink">{project.title}</h3>
            <p className="mt-0.5 text-sm text-muted">{project.subtitle}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[project.status] ?? 'bg-zinc-100 text-zinc-600'
              }`}
          >
            {statusLabels[project.status] ?? project.status}
          </span>
        </div>

        {project.description && (
          <p className="line-clamp-3 text-sm text-ink/80">{project.description}</p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded bg-bg px-2 py-1 text-xs font-medium text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`Repositório de ${project.title} no GitHub`}
              className="text-muted transition hover:text-accent"
            >
              <FaGithub size={18} />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              aria-label={`Demo de ${project.title}`}
              className="text-muted transition hover:text-accent"
            >
              <FaLink size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
