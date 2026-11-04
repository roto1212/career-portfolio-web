import { Header } from '@/components/layout/header'
import { ChangelogSection } from '@/components/sections/changelog'
import { ContactSection } from '@/components/sections/contact'
import { HeroSection } from '@/components/sections/hero'
import { ProjectsSection } from '@/components/sections/pinned-projects'
import { RevealEffects } from '@/components/sections/reveal-effects'
import { SkillsSection } from '@/components/sections/skills-diff'
import { getPortfolio } from '@/lib/notion/queries'

export const revalidate = 3600

export default async function Home() {
  const { profile, featured, skills, changelog, projects } =
    await getPortfolio()
  const now = new Date()
  const buildDate = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })

  return (
    <>
      <a className="skip-link" href="#top">
        본문 바로가기
      </a>
      <Header />
      <main>
        <HeroSection profile={profile} featured={featured} now={now} />
        <SkillsSection skills={skills} />
        <ChangelogSection changelog={changelog} now={now} />
        <ProjectsSection projects={projects} now={now} />
      </main>
      <ContactSection email={profile.email} buildDate={buildDate} />
      <RevealEffects />
    </>
  )
}
