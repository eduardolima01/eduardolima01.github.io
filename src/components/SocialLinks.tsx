type SocialLink = {
  label?: string
  link?: string
  icon?: React.ReactNode
}

type Props = {
  links: SocialLink[]
}

export const SocialLinks = ({ links }: Props) => {
  return (
    <div className="flex gap-4">
      {links.map((link) => (
        <a
          key={link.link}
          href={link.link}
          target="_blank"
          rel="noreferrer"
          className="underline flex gap-1 items-center"
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  )
}
