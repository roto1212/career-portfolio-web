import {
  STATUS_TAG,
  bars,
  elapsedLabel,
  formatMonths,
  formatPeriod,
  formatTenure,
  monthsSince,
  parseDate,
} from '@/lib/career-format'
import { groupCareer } from '@/lib/group-career'
import type { ChangelogEntry, Portfolio, Skill } from '@/lib/types/portfolio'

const MARKER = { ctx: ' ', add: '+', rc: '~' } as const
const STAR_LABEL = {
  s: ['S', '상황'],
  t: ['T', '과제'],
  a: ['A', '행동'],
  r: ['R', '결과'],
} as const

function periodText(entry: ChangelogEntry, now: Date): string {
  const text = formatPeriod(entry.start, entry.end)
  if (!text) return ''
  return text + (elapsedLabel(entry.start, entry.end, now) ?? '')
}

function SectionTitle({
  eyebrow,
  title,
  ext,
}: {
  eyebrow: string
  title: string
  ext?: string
}) {
  return (
    <h2 className="r-h2">
      <span className="r-eyebrow">{eyebrow}</span>
      {title}
      {ext && <span className="r-ext">{ext}</span>}
    </h2>
  )
}

function SkillRow({ row }: { row: Skill }) {
  return (
    <tr className={row.status}>
      <td className="mk">{MARKER[row.status]}</td>
      <td className="nm">{row.name}</td>
      <td className="lv">{bars(row.level)}</td>
      <td className="nt">
        {row.note}
        {row.courses.length > 0 && (
          <ul className="courses">
            {row.courses.map(c => (
              <li key={c.url}>
                {c.label} <a href={c.url}>(수료증)</a>
              </li>
            ))}
          </ul>
        )}
      </td>
    </tr>
  )
}

export function Resume({ data, now }: { data: Portfolio; now: Date }) {
  const { profile, featured, skills, changelog, orgs, projects } = data
  const stats = [
    {
      cmd: '$ career --uptime',
      value: formatTenure(parseDate(profile.careerStart), now),
      note: undefined as string | undefined,
    },
    {
      cmd: '$ company --tenure',
      value: formatTenure(parseDate(profile.currentStart), now),
      note: undefined,
    },
    ...(featured
      ? [
          {
            cmd: '$ commerce --processed',
            value: featured.value.endsWith(featured.unit)
              ? featured.value
              : `${featured.value}${featured.unit}`,
            note: featured.metric,
          },
        ]
      : []),
  ]
  const blocks = groupCareer(changelog, orgs)
  const date = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })

  return (
    <main className="sheet" id="resume">
      <header className="r-head">
        <div className="r-id">
          <h1 className="r-name">{profile.name}</h1>
          <p className="r-role">
            <span>{profile.roleFrom}</span>
            <span>
              <span className="r-arrow" aria-hidden="true">
                →{' '}
              </span>
              {profile.roleTo}
            </span>
          </p>
        </div>
        <ul className="r-contact">
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <a href={profile.siteUrl}>
              {profile.siteUrl.replace(/^https?:\/\//, '')}
            </a>
          </li>
        </ul>
      </header>

      <dl className="r-stats" aria-label="경력 지표">
        {stats.map(s => (
          <div className="r-stat" key={s.cmd}>
            <dt>{s.cmd}</dt>
            <dd>
              {s.value}
              {s.note && <span className="r-stat-note">{s.note}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="r-sec">
        <SectionTitle eyebrow="01" title="skills" ext=".diff" />
        <p className="r-legend">
          <span>
            <b className="mk">&nbsp;</b>변화 없음 · 기존 보유
          </span>
          <span className="add">
            <b className="mk">+</b>새로 습득
          </span>
          <span className="rc">
            <b className="mk">~</b>학습 · 예정
          </span>
          <span className="lv">
            숙련도 ▮▮▮ 상 · ▮▮▯ 중 · ▮▯▯ 초급 · ▯▯▯ 예정
          </span>
        </p>
        {skills.map(block => (
          <div className="hunk" key={block.hunk}>
            <h3 className="hunk-h">@@ {block.hunk} @@</h3>
            <table className="r-table">
              <colgroup>
                <col className="c-mk" />
                <col className="c-nm" />
                <col className="c-lv" />
                <col />
              </colgroup>
              <tbody>
                {block.rows.map(row => (
                  <SkillRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="r-sec">
        <SectionTitle eyebrow="02" title="CHANGELOG" ext=".md" />
        <p className="r-note">
          소속 조직 · 프로젝트 단위의 경력 로그입니다. 경력 집계는 2021-02 첫
          입사부터이며 국비과정은 경력에 포함하지 않았습니다. 일부 소규모
          프로젝트는 기간 기록이 남아있지 않아 제목만 표기했습니다. 버전 표기:
          v&lt;major&gt;.&lt;minor&gt;.&lt;patch&gt; = 소속 조직 · 큰 프로젝트 ·
          작은 프로젝트.
        </p>
        {blocks.map(({ org, groups }) => {
          let orgPeriod = formatPeriod(org.start, org.end)
          if (org.end === 'present' && org.start) {
            orgPeriod += ` (${formatMonths(monthsSince(org.start, now))})`
          }
          return (
            <div className="org" key={org.id}>
              <div className="org-head">
                <h3 className="org-name">{org.name}</h3>
                <span className="org-role">{org.role}</span>
                <span className="org-period">{orgPeriod}</span>
              </div>
              <ol className="proj-list">
                {groups.map(({ head: e, patches }) => (
                  <li className={`proj proj-${e.kind}`} key={e.ver}>
                    {e.note && <p className="proj-note"># {e.note}</p>}
                    <div className="proj-head">
                      <span className="ver">{e.ver}</span>
                      <span className={`tag tag-${e.status}`}>
                        {STATUS_TAG[e.status]}
                      </span>
                      <h4 className="proj-title">{e.title}</h4>
                      <span className="proj-period">{periodText(e, now)}</span>
                    </div>
                    {e.body && <p className="proj-body">{e.body}</p>}
                    {patches.length > 0 && (
                      <div className="patches">
                        <p className="patches-h">기타 작업</p>
                        <ul>
                          {patches.map(p => {
                            const period = periodText(p, now)
                            return (
                              <li key={p.ver}>
                                <span className="ver">{p.ver}</span> {p.title}
                                {period && (
                                  <span className="pp"> · {period}</span>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>

      <div className="r-sec r-sec-projects">
        <SectionTitle eyebrow="03" title="pinned" />
        {projects.map(p => (
          <article className="star-card" key={p.id}>
            <div className="star-head">
              <h3 className="repo">{p.name}</h3>
              <span className={`badge badge-${p.status}`}>{p.status}</span>
              <span className="star-period">
                {formatPeriod(p.start, p.end, 'present')}
                {elapsedLabel(p.start, p.end, now)}
              </span>
            </div>
            <p className="star-desc">{p.cardDesc}</p>
            <p className="star-tech">
              {p.stack.map(t => (
                <span className="tech" key={t}>
                  {t}
                </span>
              ))}
            </p>
            <dl className="star-grid">
              {(['s', 't', 'a', 'r'] as const).map(key => (
                <div className="star-row" key={key}>
                  <dt>
                    {STAR_LABEL[key][0]}
                    <small>{STAR_LABEL[key][1]}</small>
                  </dt>
                  <dd className="whitespace-pre-line">{p.star[key]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <footer className="r-foot">
        생성일 {date} · {profile.siteUrl.replace(/^https?:\/\//, '')}
      </footer>
    </main>
  )
}
