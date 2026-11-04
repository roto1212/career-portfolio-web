import { bars } from '@/lib/career-format'
import type { Portfolio, Skill } from '@/lib/types/portfolio'

const MARKER = { ctx: ' ', add: '+', rc: '~' } as const

function srLabel(row: Skill): string {
  if (row.status === 'ctx') return '(기존 보유)'
  if (row.status === 'add') return '(신규 습득)'
  return row.level === 0 ? '(학습 예정)' : '(학습 중)'
}

export function SkillsSection({ skills }: { skills: Portfolio['skills'] }) {
  return (
    <section id="skills" className="skills">
      <h2 className="section-title">
        <span className="section-eyebrow">02</span>skills
        <span className="ext">.diff</span>
      </h2>
      <p className="section-desc">
        SI 5년 동안 쌓은 기반 위에, R&amp;D 전환 이후 습득한 스택을 diff로
        표기했습니다.
      </p>
      <p className="diff-legend">
        <span className="legend-item">
          <span className="marker" aria-hidden="true">
            &nbsp;
          </span>
          변화 없음 · 기존 보유
        </span>
        <span className="legend-item add">
          <span className="marker" aria-hidden="true">
            +
          </span>
          새로 습득
        </span>
        <span className="legend-item rc">
          <span className="marker" aria-hidden="true">
            ~
          </span>
          학습 · 예정
        </span>
      </p>

      {skills.map(block => (
        <div className="diff-block" key={block.hunk}>
          <p className="diff-hunk">@@ {block.hunk} @@</p>
          <ul className="diff-list">
            {block.rows.map(row => (
              <li className={`diff-row ${row.status}`} key={row.id}>
                <span className="marker" aria-hidden="true">
                  {MARKER[row.status]}
                </span>
                <span className="name">
                  {row.name}
                  <span className="sr-only">{srLabel(row)}</span>
                </span>
                <span className="bars" aria-hidden="true">
                  {bars(row.level)}
                </span>
                <span className="note">{row.note}</span>
                {row.courses.length > 0 && (
                  <ul className="courses">
                    {row.courses.map(c => (
                      <li key={c.url}>
                        {c.label}{' '}
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          (수료증)
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
