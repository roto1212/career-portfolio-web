'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="hero">
      <p className="prompt">~/career$ error</p>
      <p className="load-error" role="alert">
        데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <p className="role">
        <button type="button" className="underline" onClick={reset}>
          다시 시도
        </button>
      </p>
    </section>
  )
}
