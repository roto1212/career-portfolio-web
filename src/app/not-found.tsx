import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="hero">
      <p className="prompt">~/career$ cd 404</p>
      <h1>404</h1>
      <p className="role">페이지를 찾을 수 없습니다.</p>
      <p className="role">
        <Link href="/" className="underline">
          처음으로
        </Link>
      </p>
    </section>
  )
}
