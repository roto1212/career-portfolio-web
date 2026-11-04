export type Profile = {
  name: string
  roleFrom: string
  roleTo: string
  email: string
  siteUrl: string
  careerStart: string // YYYY-MM-DD
  currentStart: string // YYYY-MM-DD
}

export type Org = {
  id: string
  name: string
  ver: string
  role: string
  start: string | null // YYYY-MM
  end: string | null // YYYY-MM | 'present'
  countsAsCareer: boolean
  order: number
  logTitle: string
  summary: string
}

export type ProjectStatus = 'done' | 'rc' | 'planned'
export type ProjectSize = 'large' | 'small'
export type ProjectKind = 'work' | 'side'

export type StarBlock = { s: string; t: string; a: string; r: string }

export type Project = {
  id: string
  name: string
  ver: string
  slug: string
  orgId: string | null
  role: string
  start: string | null // YYYY-MM
  end: string | null // YYYY-MM | 'present'
  status: ProjectStatus
  size: ProjectSize
  stack: string[]
  summary: string
  cardDesc: string
  note: string
  pinned: boolean
  order: number
  kind: ProjectKind // 빈 값은 work
  origin: string // 시작 계기 (side 카드에 노출)
}

export type PinnedProject = Project & { star: StarBlock }

export type Achievement = {
  id: string
  name: string
  metric: string
  baseline: string
  value: string
  unit: string
  projectIds: string[]
  featured: boolean
  order: number
}

export type SkillStatus = 'ctx' | 'add' | 'rc'

export type Skill = {
  id: string
  name: string
  category: string
  level: number
  status: SkillStatus
  note: string
  order: number
  courses: { label: string; url: string }[]
}

export type ChangelogKind = 'major' | 'minor' | 'patch'

export type ChangelogEntry = {
  ver: string
  verHi?: number
  kind: ChangelogKind
  status: ProjectStatus
  start: string | null
  end: string | null
  title: string
  body: string
  note: string
}

export type Portfolio = {
  profile: Profile
  orgs: Org[]
  skills: { hunk: string; rows: Skill[] }[]
  changelog: ChangelogEntry[]
  projects: PinnedProject[]
  sideProjects: PinnedProject[]
  featured: Achievement | null
}
