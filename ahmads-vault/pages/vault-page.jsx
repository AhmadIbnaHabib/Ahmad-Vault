import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import {
  VAULT_BACK_EVENT,
  VAULT_ENTER_COMPLETE_EVENT,
  VAULT_ENTER_DURATION_MS,
} from '@/lib/vault-events'

export default function VaultPage() {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)

  const handleBack = (event) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0 || reducedMotion) return
    event.preventDefault()
    if (leaving) return
    setLeaving(true)
    window.dispatchEvent(new Event(VAULT_BACK_EVENT))
    window.setTimeout(() => {
      navigate('/')
      window.dispatchEvent(new Event(VAULT_ENTER_COMPLETE_EVENT))
    }, VAULT_ENTER_DURATION_MS)
  }

  return (
    <main className="relative z-10 flex h-dvh w-full items-center justify-start overflow-hidden px-6 py-6 md:px-10">
      <Link
        to="/"
        onClick={handleBack}
        aria-label="Back to entrance"
        aria-busy={leaving}
        className="fixed left-6 top-6 z-20 inline-flex size-11 items-center justify-center rounded-full border border-strawberry/45 bg-[#2a0016]/40 text-white/90 shadow-[0_8px_32px_rgba(20,0,14,0.3)] backdrop-blur-md transition-colors hover:border-honey/60 hover:text-honey focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-honey md:left-10 md:top-10"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </Link>
    </main>
  )
}
