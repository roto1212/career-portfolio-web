import { RepoCard } from './repo-card'
import type { PinnedProject } from '@/lib/types/portfolio'

export function ProjectsSection({
  projects,
  now,
}: {
  projects: PinnedProject[]
  now: Date
}) {
  return (
    <section id="projects" className="projects">
      <h2 className="section-title">
        <span className="section-eyebrow">04</span>pinned
      </h2>
      <p className="section-desc">
        카드를 누르면 STAR(상황·과제·행동·결과)로 펼쳐집니다.
      </p>
      <div className="repo-grid">
        {projects.map(p => (
          <RepoCard key={p.id} project={p} now={now} />
        ))}
      </div>
    </section>
  )
}
