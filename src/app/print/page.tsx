import type { Metadata } from 'next'
import { PrintActions } from '@/components/print/print-actions'
import { Resume } from '@/components/print/resume'
import { getPortfolio } from '@/lib/notion/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '선대범 · 이력서',
  robots: { index: false, follow: false },
}

export default async function PrintPage() {
  const data = await getPortfolio()
  return (
    <div className="print-page">
      <PrintActions />
      <Resume data={data} now={new Date()} />
    </div>
  )
}
