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

/** 본문의 `## S — …` / `## T — …` / `## A — …` / `## R — …` 블록만 추출 */
export function parseStar(markdown: string): StarBlock {
  const star: StarBlock = { s: '', t: '', a: '', r: '' }
  const parts = markdown.split(/^##\s+/m).slice(1)
  for (const part of parts) {
    const key = part.charAt(0).toLowerCase()
    if (key === 's' || key === 't' || key === 'a' || key === 'r') {
      const body = part.slice(part.indexOf('\n') + 1)
      star[key] = toPlain(body)
    }
  }
  return star
}

/** 스킬 본문의 "라벨 URL" 줄 → 수료증 링크. https 외 스킴은 버린다 */
export function parseCourses(
  markdown: string
): { label: string; url: string }[] {
  const courses: { label: string; url: string }[] = []
  for (const raw of markdown.split('\n')) {
    const line = raw.trim()
    if (!line || line === '---') continue
    const mdLink = line.match(/^(.*?)\[[^\]]*\]\(([^)]+)\)\s*$/)
    const label = mdLink ? mdLink[1].trim() : line.replace(/\s+\S+$/, '')
    const rawUrl = mdLink ? mdLink[2] : (line.split(/\s+/).pop() ?? '')
    const url = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`
    try {
      const parsed = new URL(url)
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        courses.push({ label: toPlain(label), url: parsed.toString() })
      }
    } catch {
      // 잘못된 URL은 건너뜀
    }
  }
  return courses
}
