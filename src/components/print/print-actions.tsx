'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const FONT_WAIT_MS = 4000 // 폰트가 막혀도 인쇄가 멈추지 않도록

async function waitForFonts(): Promise<void> {
  if (!document.fonts) return
  const loading = document.fonts
    .load('400 10pt sans-serif')
    .then(() => document.fonts.ready)
    .catch(() => undefined)
  const timeout = new Promise(resolve =>
    window.setTimeout(resolve, FONT_WAIT_MS)
  )
  await Promise.race([loading, timeout])
}

/** 상단 툴바(화면 전용) + `?print=1`이면 폰트 로딩 후 자동으로 인쇄창을 연다 */
export function PrintActions() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('print') !== '1') return
    let cancelled = false
    void waitForFonts().then(() => {
      if (!cancelled) window.print()
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="toolbar no-print">
      <Link className="tb-link" href="/">
        ← 사이트로
      </Link>
      <span className="tb-hint">
        인쇄 창에서 대상을 <b>PDF로 저장</b>, 용지 <b>A4</b>, 여백 <b>기본값</b>
        , <b>머리글 및 바닥글</b> 끄기를 권장합니다.
      </span>
      <button className="tb-btn" type="button" onClick={() => window.print()}>
        PDF로 저장
      </button>
    </div>
  )
}
