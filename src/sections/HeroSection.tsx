import { Button } from "@/components/ui/Button";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export function Hero() {
  const scrollToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex min-h-screen items-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="space-y-4">
          <span className="text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Portfólio Profissional
          </span>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Eduardo Lima
          </h1>

          <h2 className="text-2xl font-medium text-zinc-300 md:text-3xl">
            Frontend Developer
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            Construo aplicações web focadas em experiência do usuário,
            arquitetura organizada e resolução de problemas reais através de
            soluções modernas e escaláveis.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            variant={'secondary'}
            onClick={scrollToProjects}
          >
            Ver Projetos
          </Button>
          <Button
            variant={'primary'}
            onClick={scrollToContact}
          >
            Entrar em Contato
          </Button>
        </div>

        <div className="flex items-center gap-5 pt-4">
          <a
            href="https://github.com/eduardolima01"
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-zinc-400 transition hover:text-white"
          >
            <FiGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/eduardo-lima-881b69409"
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-zinc-400 transition hover:text-white"
          >
            <FiLinkedin />
          </a>

          <a
            href="mailto:eduardosilvaprogramador@hotmail.com"
            className="text-2xl text-zinc-400 transition hover:text-white"
          >
            <FiMail />
          </a>
        </div>
      </div>
    </section>
  );
}
