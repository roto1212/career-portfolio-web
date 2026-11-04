import type { PageObjectResponse } from '@notionhq/client'
import {
  checkbox,
  dateRange,
  multiSelect,
  num,
  relationIds,
  select,
  text,
  title,
  toMonth,
} from './props'
import type {
  Achievement,
  Org,
  Profile,
  Project,
  ProjectSize,
  ProjectStatus,
  Skill,
  SkillStatus,
} from '@/lib/types/portfolio'

const PROJECT_STATUS: ProjectStatus[] = ['done', 'rc', 'planned']
const SKILL_STATUS: SkillStatus[] = ['ctx', 'add', 'rc']

function oneOf<T extends string>(value: string, allowed: T[], fallback: T): T {
  return (allowed as string[]).includes(value) ? (value as T) : fallback
}

export function mapProfile(page: PageObjectResponse): Profile {
  const day = (name: string) => dateRange(page, name).start ?? text(page, name)
  return {
    name: title(page, 'Name'),
    roleFrom: text(page, 'RoleFrom'),
    roleTo: text(page, 'RoleTo'),
    email: text(page, 'Email'),
    siteUrl: text(page, 'SiteUrl'),
    careerStart: day('CareerStart'),
    currentStart: day('CurrentStart'),
  }
}

export function mapOrg(page: PageObjectResponse): Org {
  const ongoing = checkbox(page, 'Ongoing')
  return {
    id: page.id,
    name: title(page, 'Name'),
    ver: text(page, 'Ver'),
    role: text(page, 'Role'),
    start: toMonth(dateRange(page, 'Start').start),
    end: ongoing ? 'present' : toMonth(dateRange(page, 'End').start),
    countsAsCareer: checkbox(page, 'CountsAsCareer'),
    order: num(page, 'Order'),
    logTitle: text(page, 'LogTitle'),
    summary: text(page, 'Summary'),
  }
}

export function mapProject(page: PageObjectResponse): Project {
  const period = dateRange(page, 'Period')
  const ongoing = checkbox(page, 'Ongoing')
  return {
    id: page.id,
    name: title(page, 'Name'),
    ver: text(page, 'Ver'),
    slug: text(page, 'Slug'),
    orgId: relationIds(page, 'Org')[0] ?? null,
    role: text(page, 'Role'),
    start: toMonth(period.start),
    end: ongoing ? 'present' : toMonth(period.end),
    status: oneOf(select(page, 'Status'), PROJECT_STATUS, 'done'),
    size: oneOf<ProjectSize>(select(page, 'Size'), ['large', 'small'], 'small'),
    stack: multiSelect(page, 'Stack'),
    summary: text(page, 'Summary'),
    cardDesc: text(page, 'CardDesc'),
    note: text(page, 'Note'),
    pinned: checkbox(page, 'Pinned'),
    order: num(page, 'Order'),
  }
}

export function mapAchievement(page: PageObjectResponse): Achievement {
  return {
    id: page.id,
    name: title(page, 'Name'),
    metric: text(page, 'Metric'),
    baseline: text(page, 'Baseline'),
    value: text(page, 'Value'),
    unit: text(page, 'Unit'),
    projectIds: relationIds(page, 'Project'),
    featured: checkbox(page, 'Featured'),
    order: num(page, 'Order'),
  }
}

export function mapSkill(page: PageObjectResponse): Omit<Skill, 'courses'> {
  return {
    id: page.id,
    name: title(page, 'Name'),
    category: select(page, 'Category'),
    level: Math.min(3, Math.max(0, Math.round(num(page, 'Level')))),
    status: oneOf(select(page, 'Status'), SKILL_STATUS, 'ctx'),
    note: text(page, 'Note'),
    order: num(page, 'Order'),
  }
}
