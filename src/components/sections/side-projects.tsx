import { RepoCard } from './repo-card'
import type { PinnedProject } from '@/lib/types/portfolio'

/** 회사 업무 외 프로젝트 (학습 · 개인 프로젝트) */
export function SideProjectsSection({
  projects,
  now,
}: {
  projects: PinnedProject[]
  now: Date
}) {
  return (
    <section id="side" className="projects">
      <h2 className="section-title">
        <span className="section-eyebrow">05</span>side
      </h2>
      <p className="section-desc">
        회사 업무와 별개로 학습하며 만든 프로젝트입니다.
      </p>
      <div className="repo-grid">
        {projects.map(p => (
          <RepoCard key={p.id} project={p} now={now} />
        ))}
      </div>
    </section>
  )
}
