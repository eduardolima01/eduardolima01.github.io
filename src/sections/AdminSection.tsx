import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
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
  story: '',
  problem: '',
  solution: '',
  result: '',
  featured: false,
  github: '',
  demo: '',
  technologies: [],
  image: [],
}

function parseCsv(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean)
}

const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent'

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
  const [techInput, setTechInput] = useState('')
  const [imagesInput, setImagesInput] = useState('')
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

    if (editingId) {
      updateProject(editingId, data)
    } else {
      addProject(data)
    }

    resetForm()
    reload()
    await persist()
  }

  function handleEdit(project: Project) {
    setEditingId(project.id)

    setForm({
      status: project.status,
      title: project.title,
      subtitle: project.subtitle,
      description: project.description,
      story: project.story ?? '',
      problem: project.problem ?? '',
      solution: project.solution ?? '',
      result: project.result ?? '',
      featured: project.featured ?? false,
      github: project.github ?? '',
      demo: project.demo ?? '',
      technologies: project.technologies,
      image: project.image,
    })

    setTechInput(project.technologies.join(', '))
    setImagesInput(project.image.join(', '))
  }

  async function handleDelete(id: string) {
    deleteProject(id)

    if (editingId === id) {
      resetForm()
    }

    reload()
    await persist()
  }

  function setField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted">Carregando projects.sqlite...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">Admin · Projetos</h1>
          <p className="text-sm text-muted">
            Gerencie os projetos exibidos no portfólio.
          </p>
        </div>

        <div className="text-sm">
          {saveState === 'saving' && <span>Salvando...</span>}
          {saveState === 'saved' && <span className="text-emerald-600">✓ Salvo</span>}
          {saveState === 'error' && (
            <span className="text-danger" title={saveError ?? undefined}>
              ✕ Erro ao salvar
            </span>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mb-10 rounded-xl border border-line bg-panel p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <label className={labelClass}>
            Título
            <input className={inputClass} value={form.title} onChange={(e) => setField('title', e.target.value)} />
          </label>

          <label className={labelClass}>
            Subtítulo
            <input className={inputClass} value={form.subtitle} onChange={(e) => setField('subtitle', e.target.value)} />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Descrição
            <textarea className={`${inputClass} min-h-24`} value={form.description} onChange={(e) => setField('description', e.target.value)} />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            História do Projeto
            <textarea className={`${inputClass} min-h-32`} value={form.story ?? ''} onChange={(e) => setField('story', e.target.value)} />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Problema
            <textarea className={`${inputClass} min-h-32`} value={form.problem ?? ''} onChange={(e) => setField('problem', e.target.value)} />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Solução
            <textarea className={`${inputClass} min-h-32`} value={form.solution ?? ''} onChange={(e) => setField('solution', e.target.value)} />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Resultado
            <textarea className={`${inputClass} min-h-32`} value={form.result ?? ''} onChange={(e) => setField('result', e.target.value)} />
          </label>

          <label className={labelClass}>
            Status
            <select className={inputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="em-andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
              <option value="pausado">Pausado</option>
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-ink">
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setField('featured', e.target.checked)} />
            Projeto em destaque
          </label>

          <label className={labelClass}>
            GitHub
            <input className={inputClass} value={form.github} onChange={(e) => setField('github', e.target.value)} />
          </label>

          <label className={labelClass}>
            Demo
            <input className={inputClass} value={form.demo} onChange={(e) => setField('demo', e.target.value)} />
          </label>

          <label className={labelClass}>
            Tecnologias
            <input className={inputClass} value={techInput} onChange={(e) => setTechInput(e.target.value)} />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Imagens
            <input className={inputClass} value={imagesInput} onChange={(e) => setImagesInput(e.target.value)} />
          </label>
        </div>

        <div className="mt-6 flex gap-2">
          <Button type="submit">
            {editingId ? 'Salvar edição' : 'Adicionar projeto'}
          </Button>

          {editingId && (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-ink">
          Projetos cadastrados
        </h2>

        <ul className="flex flex-col gap-3">
          {projects.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-4 rounded-lg border border-line bg-panel p-4">
              <div>
                <div className="flex items-center gap-2">
                  <strong>{p.title}</strong>

                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyles[p.status]}`}>
                    {p.status}
                  </span>

                  {p.featured && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      Destaque
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted">
                  {p.subtitle}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(p)}>
                  Editar
                </Button>

                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
