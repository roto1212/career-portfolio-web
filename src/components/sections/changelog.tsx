import { STATUS_TAG, elapsedLabel, formatPeriod } from '@/lib/career-format'
import type { ChangelogEntry } from '@/lib/types/portfolio'

const KIND_LABEL = {
  major: '메이저 릴리스, 소속 조직 변경.',
  minor: '마이너 릴리스, 큰 프로젝트.',
  patch: '패치 릴리스, 작은 프로젝트.',
} as const

export function ChangelogSection({
  changelog,
  now,
}: {
  changelog: ChangelogEntry[]
  now: Date
}) {
  return (
    <section id="career" className="changelog">
      <h2 className="section-title">
        <span className="section-eyebrow">03</span>CHANGELOG
        <span className="ext">.md</span>
      </h2>
      <p className="section-desc">
        소속 조직 · 프로젝트 단위로 버전을 매긴 경력 로그입니다. 경력 집계는
        2021-02 첫 입사부터이며, v0.1.0 국비과정은 경력에 포함하지 않았습니다.
        일부 소규모 프로젝트는 기간 기록이 남아있지 않아 제목만 표기했습니다.
      </p>
      <p className="log-schema">
        v&lt;major&gt;.&lt;minor&gt;.&lt;patch&gt; = 소속 조직 · 큰 프로젝트 ·
        작은 프로젝트
      </p>
      <p className="log-legend">
        <span className="legend-item">
          <span className="hmark hmark-major" aria-hidden="true" />
          메이저 · 소속 조직
        </span>
        <span className="legend-item">
          <span className="hmark hmark-minor" aria-hidden="true" />
          마이너 · 큰 프로젝트
        </span>
        <span className="legend-item">
          <span className="hmark hmark-patch" aria-hidden="true" />
          패치 · 작은 프로젝트
        </span>
      </p>
      <p className="log-legend">
        <span className="legend-item">
          <span className="tag tag-done">released</span>완료된 릴리스
        </span>
        <span className="legend-item">
          <span className="tag tag-rc">in progress</span>진행 중
        </span>
        <span className="legend-item">
          <span className="tag tag-planned">planned</span>예정
        </span>
      </p>

      <ol className="log-list" aria-label="경력 변경 이력(최신순)">
        {changelog.map(entry => {
          const elapsed = elapsedLabel(entry.start, entry.end, now)
          return (
            <li className={`log-entry log-${entry.kind}`} key={entry.ver}>
              {entry.note && (
                <p className="log-note">
                  <span aria-hidden="true">#</span> {entry.note}
                </p>
              )}
              <div className="log-head">
                <span className="sr-only">{KIND_LABEL[entry.kind]}</span>
                <span className="ver">{entry.ver}</span>
                <span className={`tag tag-${entry.status}`}>
                  {STATUS_TAG[entry.status]}
                </span>
                {entry.start && (
                  <time dateTime={entry.start}>
                    {formatPeriod(entry.start, entry.end)}
                    {elapsed && (
                      <span className="period-elapsed">{elapsed}</span>
                    )}
                  </time>
                )}
              </div>
              <h3 className="log-title">{entry.title}</h3>
              {entry.body && <p className="log-body">{entry.body}</p>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
