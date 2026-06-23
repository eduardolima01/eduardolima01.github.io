import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import type { Project } from '@/types/project.types'
import { Button } from './ui/Button'

type Props = {
  project: Project
  onViewDetails?: (project: Project) => void
}

const statusStyles: Record<string, string> = {
  'em-andamento':
    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  concluido:
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  pausado: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
}

const statusLabels: Record<string, string> = {
  'em-andamento': 'Em andamento',
  concluido: 'Concluído',
  pausado: 'Pausado',
}

function imageUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}assets/imagens/${filename}`
}

export function ProjectCard({
  project,
  onViewDetails,
}: Props) {
  const cover = project.image?.[0]

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-line
        bg-panel
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-accent/40
        hover:shadow-xl
      "
    >
      <div className="relative aspect-video overflow-hidden bg-bg">
        {cover ? (
          <img
            src={imageUrl(cover)}
            alt={project.title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            Sem imagem
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {project.featured && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-accent
              px-3
              py-1
              text-xs
              font-semibold
              text-white
            "
          >
            Projeto Destaque
          </span>
        )}

        <span
          className={`
            absolute
            right-3
            top-3
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            backdrop-blur-sm
            ${statusStyles[project.status] ?? 'bg-zinc-500/10 text-zinc-400'}
          `}
        >
          {statusLabels[project.status] ?? project.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div>
          <h3 className="text-xl font-bold text-ink">
            {project.title}
          </h3>

          {project.subtitle && (
            <p className="mt-1 text-sm text-muted">
              {project.subtitle}
            </p>
          )}
        </div>

        {project.description && (
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink/80">
            {project.description}
          </p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="
                  rounded-md
                  border
                  border-line
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-muted
                "
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-6">
          <Button
            onClick={() => onViewDetails?.(project)}
            className="
              w-full
              rounded-lg
              bg-accent
              px-4
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            Ver Detalhes
          </Button>

          <div className="mt-3 flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`Repositório de ${project.title}`}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-line
                  px-4
                  py-2.5
                  text-sm
                  text-muted
                  transition
                  hover:bg-bg
                  hover:text-ink
                "
              >
                <FaGithub />
                Código
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                aria-label={`Demo de ${project.title}`}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-line
                  px-4
                  py-2.5
                  text-sm
                  text-muted
                  transition
                  hover:bg-bg
                  hover:text-ink
                "
              >
                <FaExternalLinkAlt size={12} />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
