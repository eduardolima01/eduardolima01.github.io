export type Project = {
  id: string

  status:
  | 'em-andamento'
  | 'concluido'
  | 'pausado'

  title: string

  subtitle: string

  description: string

  story?: string

  problem?: string

  solution?: string

  result?: string

  image: string[]

  technologies: string[]

  github?: string

  demo?: string

  featured: boolean
}
