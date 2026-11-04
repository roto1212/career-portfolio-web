import type { StarBlock } from '@/lib/types/portfolio'

/** 인라인 마크다운을 평문으로 (React 이스케이프에 맡기므로 HTML은 만들지 않는다) */
function toPlain(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * 본문의 `## S — …` / `## T — …` / `## A — …` / `## R — …` 블록만 추출한다.
 * 헤딩 형식(대문자 한 글자 + 공백 + 대시)이 정확히 맞을 때만 STAR로 인정하므로,
 * 그 외 헤딩(예: `## 상세 (비공개 메모)`) 아래 내용은 사이트에 노출되지 않는다.
 */
export function parseStar(markdown: string): StarBlock {
  const star: StarBlock = { s: '', t: '', a: '', r: '' }
  const parts = markdown.split(/^##\s+/m).slice(1)
  for (const part of parts) {
    const match = part.match(/^([STAR])\s+[—–-]/)
    if (!match) continue
    const key = match[1].toLowerCase() as keyof StarBlock
    const body = part.slice(part.indexOf('\n') + 1)
    star[key] = toPlain(body)
  }
  return star
}

/**
 * 스킬 본문의 수료증 줄 → 링크. `[강의명](URL)`, `라벨 [수료증](URL)`, `라벨 URL` 형식을 읽는다.
 * https 외 스킴은 버린다
 */
export function parseCourses(
  markdown: string
): { label: string; url: string }[] {
  const courses: { label: string; url: string }[] = []
  for (const raw of markdown.split('\n')) {
    // 불릿(`- `)은 떼고, 줄 전체가 `[강의명](URL)` 한 개면 대괄호 안이 라벨이다
    const line = raw.trim().replace(/^[-*]\s+/, '')
    if (!line || line === '---' || line.startsWith('#')) continue
    const wholeLink = line.match(/^\[((?:\\.|[^\]\\])+)\]\(([^)]+)\)$/)
    const mdLink = wholeLink ?? line.match(/^(.*?)\[[^\]]*\]\(([^)]+)\)\s*$/)
    const label = wholeLink
      ? wholeLink[1].replace(/\\(.)/g, '$1')
      : mdLink
        ? mdLink[1].trim()
        : line.replace(/\s+\S+$/, '')
    const rawUrl = mdLink ? mdLink[2] : (line.split(/\s+/).pop() ?? '')
    const url = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`
    try {
      const parsed = new URL(url)
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        const text = toPlain(label)
        if (text) courses.push({ label: text, url: parsed.toString() })
      }
    } catch {
      // 잘못된 URL은 건너뜀
    }
  }
  return courses
}
