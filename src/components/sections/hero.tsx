import { formatTenure, parseDate } from '@/lib/career-format'
import type { Achievement, Profile } from '@/lib/types/portfolio'

type Props = { profile: Profile; featured: Achievement | null; now: Date }

export function HeroSection({ profile, featured, now }: Props) {
  const stats: { cmd: string; value: string; note?: string }[] = [
    {
      cmd: '$ career --uptime',
      value: formatTenure(parseDate(profile.careerStart), now),
    },
    {
      cmd: '$ company --tenure',
      value: formatTenure(parseDate(profile.currentStart), now),
    },
  ]
  if (featured) {
    stats.push({
      cmd: '$ commerce --processed',
      value: featured.value.endsWith(featured.unit)
        ? featured.value
        : `${featured.value}${featured.unit}`,
      note: featured.metric,
    })
  }

  return (
    <section id="top" className="hero">
      <p className="prompt">
        ~/career$ whoami
        <span className="cursor" aria-hidden="true" />
      </p>
      <h1>{profile.name}</h1>
      <p className="role">
        <span>{profile.roleFrom}</span>
        <br />
        <span className="arrow" aria-hidden="true">
          →
        </span>{' '}
        <span>{profile.roleTo}</span>
      </p>
      <dl className="stats" aria-label="경력 지표">
        {stats.map(s => (
          <div className="stat" key={s.cmd}>
            <dt>{s.cmd}</dt>
            <dd>
              {s.value}
              {s.note && <span className="stat-note">{s.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
