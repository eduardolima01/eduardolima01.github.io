import { useEffect, useState } from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
  FaTimes,
} from 'react-icons/fa'

import type { Project } from '@/types/project.types'

type Props = {
  project: Project | null
  open: boolean
  onClose: () => void
}

function imageUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}assets/imagens/${filename}`
}

export function ProjectModal({
  project,
  open,
  onClose,
}: Props) {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    setCurrentImage(0)
  }, [project])

  useEffect(() => {
    if (!open) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  if (!open || !project) return null

  const images = project.image || []

  const hasImages = images.length > 0

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
          max-h-[95vh]
          w-full
          max-w-5xl
          overflow-y-auto
          rounded-2xl
          border
          border-line
          bg-panel
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">
              {project.title}
            </h2>

            {project.subtitle && (
              <p className="text-muted">
                {project.subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-muted
              transition
              hover:bg-bg
              hover:text-ink
            "
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {/* CARROSSEL */}

          {hasImages && (
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-xl border border-line">
                <img
                  src={imageUrl(images[currentImage])}
                  alt={project.title}
                  className="aspect-video w-full object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-black/60
                        p-3
                        text-white
                      "
                    >
                      <FaChevronLeft />
                    </button>

                    <button
                      onClick={nextImage}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-black/60
                        p-3
                        text-white
                      "
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => setCurrentImage(index)}
                      className={`
                        overflow-hidden
                        rounded-lg
                        border
                        ${currentImage === index
                          ? 'border-accent'
                          : 'border-line'
                        }
                      `}
                    >
                      <img
                        src={imageUrl(image)}
                        alt=""
                        className="h-16 w-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VISÃO GERAL */}

          {project.description && (
            <section className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-ink">
                Visão Geral
              </h3>

              <p className="leading-relaxed text-muted">
                {project.description}
              </p>
            </section>
          )}

          {/* HISTÓRIA */}

          {project.story && (
            <section className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-ink">
                História do Projeto
              </h3>

              <p className="leading-relaxed text-muted">
                {project.story}
              </p>
            </section>
          )}

          {/* PROBLEMA */}

          {project.problem && (
            <section className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-ink">
                Problema
              </h3>

              <p className="leading-relaxed text-muted">
                {project.problem}
              </p>
            </section>
          )}

          {/* SOLUÇÃO */}

          {project.solution && (
            <section className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-ink">
                Solução
              </h3>

              <p className="leading-relaxed text-muted">
                {project.solution}
              </p>
            </section>
          )}

          {/* RESULTADO */}

          {project.result && (
            <section className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-ink">
                Resultado
              </h3>

              <p className="leading-relaxed text-muted">
                {project.result}
              </p>
            </section>
          )}

          {/* TECNOLOGIAS */}

          {project.technologies?.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-ink">
                Tecnologias
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="
                      rounded-lg
                      border
                      border-line
                      px-3
                      py-1
                      text-sm
                      text-muted
                    "
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* LINKS */}

          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-line
                  px-4
                  py-2
                  transition
                  hover:bg-bg
                "
              >
                <FaGithub />
                Código Fonte
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-accent
                  px-4
                  py-2
                  text-white
                "
              >
                <FaExternalLinkAlt />
                Acessar Projeto
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
