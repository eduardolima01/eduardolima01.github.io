import { SocialLinks } from "./SocialLinks"

import { FaGithub } from "react-icons/fa"

export const Header = ({ }) => {
  return <div className="flex flex-col gap-1 py-3">
    <div className="mb-2">
      <h1 className="text-xl font-bold">Eduardo Lima</h1>
      <h3 className="text-sm">Desenvolvedor Front-end</h3>
    </div>
    <SocialLinks
      links={[
        {
          link: "https://github.com/eduardolima01",
          icon: <FaGithub />
        }
      ]} />
  </div>
}
