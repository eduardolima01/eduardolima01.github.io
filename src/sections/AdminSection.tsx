import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import {
  initAdminDatabase,
  listProjects,
  addProject,
  updateProject,
  deleteProject,
  saveDatabase,
  type ProjectInput,
} from '@/services/projects.service'
import type { Project } from '@/types/project.types'

const EMPTY_FORM: ProjectInput = {
  status: 'em-andamento',
  title: '',
  subtitle: '',
  description: '',
  github: '',
  demo: '',
  technologies: [],
  image: [],
}

function parseCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent'

const labelClass = 'flex flex-col gap-1 text-sm font-medium text-ink'

const statusStyles: Record<string, string> = {
  'em-andamento': 'bg-amber-100 text-amber-800',
  concluido: 'bg-emerald-100 text-emerald-800',
  pausado: 'bg-zinc-100 text-zinc-600',
}

export default function AdminSection() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM)
  const [techInput, setTechInput] = useState('') // "react, typescript, vite"
  const [imagesInput, setImagesInput] = useState('') // "capa.png, tela2.png"
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    initAdminDatabase()
      .then(() => setProjects(listProjects()))
      .finally(() => setLoading(false))
  }, [])

  function reload() {
    setProjects(listProjects())
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setTechInput('')
    setImagesInput('')
    setEditingId(null)
  }

  async function persist() {
    setSaveState('saving')
    setSaveError(null)
    try {
      await saveDatabase()
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (err) {
      setSaveState('error')
      setSaveError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return

    const data: ProjectInput = {
      ...form,
      technologies: parseCsv(techInput),
      image: parseCsv(imagesInput),
    }

    if (editingId !== null) {
      updateProject(editingId, data)
    } else {
      addProject(data)
    }

    resetForm()
    reload()
    await persist()
  }

  function handleEdit(p: Project) {
    setEditingId(p.id)
    setForm({
      status: p.status,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      github: p.github ?? '',
      demo: p.demo ?? '',
      technologies: p.technologies ?? [],
      image: p.image ?? [],
    })
    setTechInput((p.technologies ?? []).join(', '))
    setImagesInput((p.image ?? []).join(', '))
  }

  async function handleDelete(id: string) {
    deleteProject(id)
    if (editingId === id) resetForm()
    reload()
    await persist()
  }

  function setField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted">Carregando projects.sqlite…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">Admin · Projetos</h1>
          <p className="text-sm text-muted">
            Cada alteração é salva automaticamente em{' '}
            <code className="rounded bg-bg px-1 py-0.5">public/projects.sqlite</code>.
          </p>
        </div>

        <div className="shrink-0 text-right text-sm">
          {saveState === 'saving' && <span className="text-muted">Salvando…</span>}
          {saveState === 'saved' && (
            <span className="font-medium text-emerald-700">✓ Salvo</span>
          )}
          {saveState === 'error' && (
            <span className="font-medium text-danger" title={saveError ?? undefined}>
              ✕ Erro ao salvar
            </span>
          )}
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-xl border border-line bg-panel p-6 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-semibold text-ink">
          {editingId !== null ? 'Editar projeto' : 'Novo projeto'}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Título
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </label>

          <label className={labelClass}>
            Subtítulo
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(e) => setField('subtitle', e.target.value)}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Descrição
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </label>

          <label className={labelClass}>
            Status
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              <option value="em-andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
              <option value="pausado">Pausado</option>
            </select>
          </label>

          <label className={labelClass}>
            GitHub (URL)
            <input
              className={inputClass}
              value={form.github}
              onChange={(e) => setField('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </label>

          <label className={labelClass}>
            Demo (URL)
            <input
              className={inputClass}
              value={form.demo}
              onChange={(e) => setField('demo', e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className={labelClass}>
            Tecnologias
            <input
              className={inputClass}
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="react, typescript, vite"
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Imagens (nomes dos arquivos)
            <input
              className={inputClass}
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              placeholder="capa.png, tela2.png"
            />
            <span className="text-xs text-muted">
              Coloque os arquivos em{' '}
              <code className="rounded bg-bg px-1 py-0.5">public/assets/imagens/</code> com
              esses nomes exatos.
            </span>
          </label>
        </div>

        <div className="mt-6 flex gap-2">
          <Button type="submit" variant="primary">
            {editingId !== null ? 'Salvar edição' : 'Adicionar projeto'}
          </Button>
          {editingId !== null && (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">
            Projetos cadastrados ({projects.length})
          </h2>
        </div>

        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-muted">
            Nenhum projeto ainda. Use o formulário acima para adicionar o primeiro.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-line bg-panel p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="truncate text-sm text-ink">{p.title}</strong>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[p.status] ?? 'bg-zinc-100 text-zinc-600'
                        }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted">{p.subtitle}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(p)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
