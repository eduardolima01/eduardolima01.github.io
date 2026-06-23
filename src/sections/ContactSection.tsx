import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa'

import { Button } from '@/components/ui/Button'

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-4xl px-4 py-24"
    >
      <div
        className="
          rounded-3xl
          border
          border-line
          bg-panel
          p-8
          text-center
          md:p-12
        "
      >
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Contato
        </span>

        <h2 className="mt-4 text-4xl font-bold text-ink">
          Vamos conversar
        </h2>

        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">
          Estou sempre aberto para conversar sobre
          desenvolvimento de software, oportunidades
          profissionais, projetos ou novas ideias.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href="mailto:eduardosilvaprogramador@hotmail.com"
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-line
              p-4
              transition
              hover:bg-bg
            "
          >
            <FaEnvelope />
            <span>eduardosilvaprogramador@hotmail.com</span>
          </a>

          <a
            href="https://github.com/eduardolima01"
            target="_blank"
            rel="noreferrer"
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-line
              p-4
              transition
              hover:bg-bg
            "
          >
            <FaGithub />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/eduardo-lima-881b69409"
            target="_blank"
            rel="noreferrer"
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-line
              p-4
              transition
              hover:bg-bg
            "
          >
            <FaLinkedin />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="mt-10">
          <Button
            asChild
            size="lg"
          >
            <a href="mailto:eduardosilvaprogramador@hotmail.com">
              Entrar em contato
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
