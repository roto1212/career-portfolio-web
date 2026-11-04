'use client'

import { useEffect, useState } from 'react'

const SECTIONS = ['skills', 'career', 'projects', 'contact'] as const

/** 상단 섹션 링크 + 스크롤 위치에 따른 활성 표시 (scroll spy) */
export function TopbarLinks() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const nodes = SECTIONS.map(id => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null
    )
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    nodes.forEach(n => observer.observe(n))

    // 마지막 섹션(contact)은 짧아서 중앙 밴드를 못 지나므로 페이지 하단 도달도 활성으로 본다
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom) setActive('contact')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav className="toplinks" aria-label="섹션 이동">
      {SECTIONS.map(id => (
        <a
          key={id}
          href={`#${id}`}
          className={active === id ? 'active' : undefined}
          aria-current={active === id ? 'true' : undefined}
        >
          {id}
        </a>
      ))}
    </nav>
  )
}
