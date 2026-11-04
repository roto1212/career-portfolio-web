import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { TopbarLinks } from './topbar-links'

const STATUS_LABEL = 'R&D · FastAPI + Vue'

export function Header() {
  return (
    <header className="topbar">
      <Link href="#top" className="brand">
        sdb<span className="dim">.log</span>
      </Link>
      <TopbarLinks />
      <span className="status-pill">
        <span className="dot" aria-hidden="true" />
        <span className="status-label">{STATUS_LABEL}</span>
      </span>
      <Link
        className="pdf-btn"
        href="/print?print=1"
        target="_blank"
        rel="noopener"
        aria-label="A4 PDF로 저장 (새 탭에서 인쇄 화면이 열립니다)"
      >
        pdf ↓
      </Link>
      <ThemeToggle />
    </header>
  )
}
