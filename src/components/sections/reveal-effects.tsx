'use client'

import { useEffect } from 'react'

/** 스크롤 시 로그 항목/카드를 나타내는 효과. reduced-motion이면 즉시 표시 */
export function RevealEffects() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      '.log-entry:not(.log-patch), .repo-card'
    )
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(n => n.classList.add('in-view'))
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    targets.forEach(n => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return null
}
