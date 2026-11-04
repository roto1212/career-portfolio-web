import { parseVer } from '@/lib/career-format'
import type { ChangelogEntry, Org } from '@/lib/types/portfolio'

export type CareerGroup = { head: ChangelogEntry; patches: ChangelogEntry[] }
export type CareerBlock = { org: Org; groups: CareerGroup[] }

/**
 * 변경 이력을 [조직 → 프로젝트 그룹(minor/major) → 하위 patch]로 묶는다.
 * 같은 major.minor의 patch는 해당 .0 항목 아래로 들어간다. (changelog는 최신순)
 */
export function groupCareer(
  changelog: ChangelogEntry[],
  orgs: Org[]
): CareerBlock[] {
  return orgs.map(org => {
    const major = parseVer(org.ver)[0]
    const entries = changelog.filter(e => parseVer(e.ver)[0] === major)
    const groups: CareerGroup[] = entries
      .filter(e => parseVer(e.ver)[2] === 0)
      .map(head => ({ head, patches: [] }))
    for (const e of entries) {
      const [maj, min, patch] = parseVer(e.ver)
      if (patch === 0) continue
      const owner = groups.find(g => {
        const [hMaj, hMin] = parseVer(g.head.ver)
        return hMaj === maj && hMin === min
      })
      if (owner) owner.patches.push(e)
      else groups.push({ head: e, patches: [] }) // 소속 없는 patch는 단독 표기
    }
    return { org, groups }
  })
}
