/** 날짜/버전 포맷 순수 함수 (profile/js/profile.js 이식) */

export const STATUS_TAG = {
  done: 'released',
  rc: 'in progress',
  planned: 'planned',
} as const

/** "YYYY-MM" 또는 "YYYY-MM-DD" → Date (일자 생략 시 1일) */
export function parseDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d || 1)
}

/** start ~ end 근속 기간. 예) "약 4년 8개월" */
export function formatTenure(start: Date, end: Date): string {
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  if (end.getDate() < start.getDate()) months -= 1
  if (months < 0) {
    years -= 1
    months += 12
  }
  return `약 ${years}년 ${months}개월`
}

/** 개월 수 → "N년 N개월" */
export function formatMonths(total: number): string {
  if (total < 1) return '1개월 미만'
  const years = Math.floor(total / 12)
  const months = total % 12
  return [years ? `${years}년` : '', months ? `${months}개월` : '']
    .filter(Boolean)
    .join(' ')
}

/** "YYYY-MM" 시작월부터 now까지 경과 개월 수 (시작 전이면 음수) */
export function monthsSince(start: string, now: Date): number {
  const [y, m] = start.split('-').map(Number)
  return now.getFullYear() * 12 + now.getMonth() - (y * 12 + m - 1)
}

/** 기간 표기. 예) "2026.05 – 현재" */
export function formatPeriod(
  start: string | null,
  end: string | null,
  presentLabel = '현재'
): string {
  if (!start) return ''
  const from = start.replace('-', '.')
  if (!end || end === start) return from
  const to = end === 'present' ? presentLabel : end.replace('-', '.')
  return `${from} – ${to}`
}

/** 진행 중 기간 뒤에 붙일 경과 문구. 해당 없으면 null */
export function elapsedLabel(
  start: string | null,
  end: string | null,
  now: Date
): string | null {
  if (!start || end !== 'present') return null
  const total = monthsSince(start, now)
  return total < 0 ? null : ` (${formatMonths(total)})`
}

/** 숙련도(0~3) → "▮▮▯" */
export function bars(level: number): string {
  return '▮'.repeat(level) + '▯'.repeat(3 - level)
}

/** "v2.11.4" → 숫자 튜플. 문자열 정렬 금지(v2.13.0 > v2.2.0) */
export function parseVer(ver: string): [number, number, number] {
  const [major = 0, minor = 0, patch = 0] = ver
    .replace(/^v/, '')
    .split('.')
    .map(n => Number.parseInt(n, 10) || 0)
  return [major, minor, patch]
}

/** 내림차순(최신 먼저) 비교 */
export function compareVerDesc(a: string, b: string): number {
  const pa = parseVer(a)
  const pb = parseVer(b)
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pb[i] - pa[i]
  }
  return 0
}
