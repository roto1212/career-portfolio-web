'use client'

import { useId, useState } from 'react'
import { elapsedLabel, formatPeriod } from '@/lib/career-format'
import type { PinnedProject } from '@/lib/types/portfolio'

const STAR_KEYS = ['s', 't', 'a', 'r'] as const

/** 핀 카드 1개. 클릭하면 STAR 패널이 펼쳐진다 */
export function RepoCard({
  project,
  now,
}: {
  project: PinnedProject
  now: Date
}) {
  const [open, setOpen] = useState(false)
  const uid = useId()
  const panelId = `star-${uid}`
  const toggleId = `toggle-${uid}`
  const elapsed = elapsedLabel(project.start, project.end, now)

  return (
    <article className="repo-card">
      <button
        type="button"
        className="repo-toggle"
        id={toggleId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
      >
        <div className="repo-top">
          <span className="repo-name">{project.name}</span>
          <span className={`badge badge-${project.status}`}>
            {project.status}
          </span>
        </div>
        <p className="repo-desc">{project.cardDesc}</p>
        {project.origin && (
          <p className="repo-origin">출발점 · {project.origin}</p>
        )}
        <div className="repo-meta">
          {project.stack.map(t => (
            <span className="tech" key={t}>
              {t}
            </span>
          ))}
          <span className="period">
            {formatPeriod(project.start, project.end, 'present')}
            {elapsed && <span className="period-elapsed">{elapsed}</span>}
          </span>
        </div>
        <span className="expand-hint">
          STAR 상세 보기{' '}
          <span className="chev" aria-hidden="true">
            ›
          </span>
        </span>
      </button>
      <div
        className="repo-star"
        id={panelId}
        role="region"
        aria-labelledby={toggleId}
        hidden={!open}
      >
        <dl>
          {STAR_KEYS.map(key => (
            <div key={key}>
              <dt>{key.toUpperCase()}</dt>
              <dd className="whitespace-pre-line">{project.star[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
