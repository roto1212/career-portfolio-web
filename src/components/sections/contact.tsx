import { CopyButton } from './copy-button'

export function ContactSection({
  email,
  buildDate,
}: {
  email: string
  buildDate: string
}) {
  return (
    <footer id="contact" className="contact">
      <p className="prompt">~/career$ contact --email</p>
      <div className="contact-row">
        <code>{email}</code>
        <CopyButton text={email} />
      </div>
      <p className="build-line">
        build {buildDate} · Claude Code + Notion 기반 기록 자동화로 제작
      </p>
    </footer>
  )
}
