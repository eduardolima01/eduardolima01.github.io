import { lazy, Suspense, useState } from 'react'
import ProjectsSection from '@/sections/ProjectsSection'
import ContactSection from '@/sections/ContactSection'
import { Button } from './components/ui/Button'
import { Hero } from './sections/HeroSection'

const AdminSection = import.meta.env.DEV
  ? lazy(() => import('@/sections/AdminSection'))
  : null

export function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  if (AdminSection && showAdmin) {
    return (
      <main>
        <Button variant="secondary" onClick={() => setShowAdmin(false)}>← voltar ao site</Button>
        <Suspense fallback={<p>Carregando admin…</p>}>
          <AdminSection />
        </Suspense>
      </main>
    )
  }

  return (
    <main className="flex flex-col w-full gap-10  items-center">
      <Hero />
      <ProjectsSection />
      <ContactSection />
      {AdminSection && (
        <Button className="fixed bottom-4 right-4" onClick={() => setShowAdmin(true)}>
          Abrir admin (dev only)
        </Button>
      )}
    </main>
  )
}

