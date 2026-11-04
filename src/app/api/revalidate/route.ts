import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'
import { PORTFOLIO_TAG } from '@/lib/notion/queries'

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

/** POST /api/revalidate  — Authorization: Bearer <REVALIDATE_SECRET> */
export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token || !safeEqual(token, env.REVALIDATE_SECRET)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  revalidateTag(PORTFOLIO_TAG)
  return NextResponse.json({ ok: true, revalidated: PORTFOLIO_TAG })
}
