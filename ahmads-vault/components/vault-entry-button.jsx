import { useNavigate, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import {
  VAULT_ENTER_COMPLETE_EVENT,
  VAULT_ENTER_DURATION_MS,
  VAULT_ENTER_EVENT,
} from '@/lib/vault-events'

export function VaultEntryButton() {
  const navigate = useNavigate()
  const ref = useRef(null)
  const [entering, setEntering] = useState(false)

  const handleClick = (e) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || reducedMotion) return
    e.preventDefault()
    if (entering) return
    setEntering(true)
    window.dispatchEvent(new Event(VAULT_ENTER_EVENT))
    window.setTimeout(() => {
      navigate('/vault')
      window.dispatchEvent(new Event(VAULT_ENTER_COMPLETE_EVENT))
    }, VAULT_ENTER_DURATION_MS)
  }

  return (
    <Link
      ref={ref}
      to="/vault"
      onClick={handleClick}
      aria-busy={entering}
      data-entering={entering}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-strawberry to-strawberry-deep px-9 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_48px_-8px_var(--strawberry),0_10px_36px_rgba(20,0,14,0.48)] transition-[transform,box-shadow,opacity] duration-300 ease-out hover:shadow-[0_0_82px_0_var(--strawberry),0_12px_42px_rgba(20,0,14,0.58)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-honey data-[entering=true]:scale-90 data-[entering=true]:opacity-0"
    >
      <span
        aria-hidden="true"
        className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      <span className="relative">Enter Vault</span>
      <ArrowRight
        className="relative size-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  )
}
