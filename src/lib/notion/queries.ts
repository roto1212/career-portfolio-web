import 'server-only'
import { unstable_cache } from 'next/cache'
import type { PageObjectResponse } from '@notionhq/client'
import { env } from '@/lib/env'
import { compareVerDesc } from '@/lib/career-format'
import { notion } from './client'
import { parseCourses, parseStar } from './markdown'
import {
  mapAchievement,
  mapOrg,
  mapProfile,
  mapProject,
  mapSkill,
} from './mappers'
import type {
  ChangelogEntry,
  PinnedProject,
  Portfolio,
  Skill,
} from '@/lib/types/portfolio'

export const PORTFOLIO_TAG = 'portfolio'
const REVALIDATE_SECONDS = 3600
const CONCURRENCY = 3 // Notion API 평균 3 req/s 제한 대응

/**
 * 기본은 Public=true 행만 조회한다 (쿼리 단계에서 강제).
 * Profile DB는 Public 속성이 없는 1행짜리 공개 프로필이라 publicFilter=false로 호출한다.
 */
async function queryPublic(
  dataSourceId: string,
  options: { publicFilter?: boolean } = {}
): Promise<PageObjectResponse[]> {
  const { publicFilter = true } = options
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      ...(publicFilter && {
        filter: {
          property: 'Public',
          checkbox: { equals: true },
        } as const,
      }),
      page_size: 100,
      start_cursor: cursor,
    })
    for (const r of res.results) {
      if (r.object === 'page' && 'properties' in r) pages.push(r)
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)
  return pages
}

async function pageMarkdown(pageId: string): Promise<string> {
  const res = await notion.pages.retrieveMarkdown({ page_id: pageId })
  return res.markdown
}

async function mapLimited<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    out.push(...(await Promise.all(items.slice(i, i + CONCURRENCY).map(fn))))
  }
  return out
}

async function loadPortfolio(): Promise<Portfolio> {
  const [profilePages, orgPages, projectPages, skillPages, achievementPages] =
    await Promise.all([
      queryPublic(env.NOTION_PROFILE_DS_ID, { publicFilter: false }),
      queryPublic(env.NOTION_ORGS_DS_ID),
      queryPublic(env.NOTION_PROJECTS_DS_ID),
      queryPublic(env.NOTION_SKILLS_DS_ID),
      queryPublic(env.NOTION_ACHIEVEMENTS_DS_ID),
    ])

  const profilePage = profilePages[0]
  if (!profilePage) throw new Error('Profile 행이 없습니다.')
  const profile = mapProfile(profilePage)

  const orgs = orgPages.map(mapOrg)
  const projects = projectPages.map(mapProject)

  // 변경 이력: 조직(major) + Ver가 있는 프로젝트(large=minor / small=patch)
  const changelog: ChangelogEntry[] = [
    ...orgs
      .filter(o => o.ver)
      .map<ChangelogEntry>(o => ({
        ver: o.ver,
        kind: 'major',
        status: o.end === 'present' ? 'rc' : 'done',
        start: o.start,
        end: o.end,
        title: o.logTitle || o.name,
        body: o.summary,
        note: '',
      })),
    ...projects
      .filter(p => p.ver)
      .map<ChangelogEntry>(p => ({
        ver: p.ver,
        kind: p.size === 'large' ? 'minor' : 'patch',
        status: p.status,
        start: p.start,
        end: p.end,
        title: p.name,
        body: p.summary,
        note: p.note,
      })),
  ].sort((a, b) => compareVerDesc(a.ver, b.ver))

  // 핀 카드: STAR 본문은 페이지 마크다운에서 추출
  const pinned = projects
    .filter(p => p.pinned)
    .sort((a, b) => a.order - b.order)
  const pinnedWithStar = await mapLimited<
    (typeof pinned)[number],
    PinnedProject
  >(pinned, async p => ({
    ...p,
    star: parseStar(await pageMarkdown(p.id)),
  }))

  // 스킬: 수료증 링크는 페이지 본문에서 추출
  const skills = await mapLimited(skillPages.map(mapSkill), async s => ({
    ...s,
    courses: parseCourses(await pageMarkdown(s.id)),
  }))
  const groups = new Map<string, Skill[]>()
  for (const s of [...skills].sort((a, b) => a.order - b.order)) {
    groups.set(s.category, [...(groups.get(s.category) ?? []), s])
  }

  const featured =
    achievementPages
      .map(mapAchievement)
      .filter(a => a.featured)
      .sort((a, b) => a.order - b.order)[0] ?? null

  return {
    profile,
    orgs: [...orgs].sort((a, b) => compareVerDesc(a.ver, b.ver)),
    skills: [...groups].map(([hunk, rows]) => ({ hunk, rows })),
    changelog,
    projects: pinnedWithStar,
    featured,
  }
}

const cachedPortfolio = unstable_cache(loadPortfolio, ['portfolio-v1'], {
  tags: [PORTFOLIO_TAG],
  revalidate: REVALIDATE_SECONDS,
})

/**
 * 포트폴리오 전체 데이터.
 * 운영: 1시간 캐시 + `portfolio` 태그로 온디맨드 갱신.
 * 개발: Notion 수정이 바로 보이도록 캐시를 쓰지 않는다.
 */
export const getPortfolio =
  process.env.NODE_ENV === 'development' ? loadPortfolio : cachedPortfolio
