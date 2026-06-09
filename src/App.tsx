import { Header } from "./components/Header"
import { Projects } from "./sections/Projects"

export function App() {
  return <div className="flex flex-col w-full items-center min-h-screen">
    <Header />
    <Projects />
  </div>
}

