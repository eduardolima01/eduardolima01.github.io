import { lazy, Suspense, useState } from 'react'
import ProjectsSection from '@/sections/ProjectsSection'
import { Header } from './components'
import Button from './components/ui/Button'

const AdminSection = import.meta.env.DEV
  ? lazy(() => import('@/sections/AdminSection'))
  : null

export function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  if (AdminSection && showAdmin) {
    return (
      <main>
        <button onClick={() => setShowAdmin(false)}>← voltar ao site</button>
        <Suspense fallback={<p>Carregando admin…</p>}>
          <AdminSection />
        </Suspense>
      </main>
    )
  }

  return (
    <main className="flex flex-col w-full gap-10  items-center">
      <Header />
      <ProjectsSection />
      {AdminSection && (
        <Button onClick={() => setShowAdmin(true)}>
          Abrir admin (dev only)
        </Button>
      )}
    </main>
  )
}

