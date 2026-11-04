import type { PageObjectResponse } from '@notionhq/client'

type Prop = PageObjectResponse['properties'][string]

function find<T extends Prop['type']>(
  page: PageObjectResponse,
  name: string,
  type: T
): Extract<Prop, { type: T }> | null {
  const prop = page.properties[name]
  return prop && prop.type === type
    ? (prop as Extract<Prop, { type: T }>)
    : null
}

export function title(page: PageObjectResponse, name: string): string {
  return (
    find(page, name, 'title')
      ?.title.map(t => t.plain_text)
      .join('') ?? ''
  )
}

export function text(page: PageObjectResponse, name: string): string {
  return (
    find(page, name, 'rich_text')
      ?.rich_text.map(t => t.plain_text)
      .join('') ?? ''
  )
}

export function select(page: PageObjectResponse, name: string): string {
  return find(page, name, 'select')?.select?.name ?? ''
}

export function multiSelect(page: PageObjectResponse, name: string): string[] {
  return find(page, name, 'multi_select')?.multi_select.map(o => o.name) ?? []
}

export function num(page: PageObjectResponse, name: string): number {
  return find(page, name, 'number')?.number ?? 0
}

export function checkbox(page: PageObjectResponse, name: string): boolean {
  return find(page, name, 'checkbox')?.checkbox ?? false
}

export function relationIds(page: PageObjectResponse, name: string): string[] {
  return find(page, name, 'relation')?.relation.map(r => r.id) ?? []
}

/** date 속성의 start/end (YYYY-MM-DD). 없으면 null */
export function dateRange(
  page: PageObjectResponse,
  name: string
): { start: string | null; end: string | null } {
  const d = find(page, name, 'date')?.date
  return { start: d?.start ?? null, end: d?.end ?? null }
}

/** 'YYYY-MM-DD' → 'YYYY-MM' (월 단위로 저장된 값) */
export function toMonth(value: string | null): string | null {
  return value ? value.slice(0, 7) : null
}
