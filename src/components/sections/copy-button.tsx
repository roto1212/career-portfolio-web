'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 1800)
  }

  return (
    <>
      <button id="copy-btn" type="button" onClick={copy}>
        {state === 'copied' ? 'copied' : 'copy'}
      </button>
      <span className="copy-feedback" role="status" aria-live="polite">
        {state === 'copied' && '이메일이 복사되었습니다.'}
        {state === 'failed' && '복사에 실패했습니다. 직접 선택해 복사해주세요.'}
      </span>
    </>
  )
}
