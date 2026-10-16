import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import { VaultEntryButton } from './vault-entry-button'
import { VAULT_ENTER_EVENT } from '@/lib/vault-events'

function RevealLetters({ text, start }) {
  return (
    <>
      {Array.from(text).map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="animate-letter-in inline-block"
          style={{ animationDelay: `${start + i * 70}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

export function VaultEntryScreen() {
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const handleEnter = () => setEntering(true)
    window.addEventListener(VAULT_ENTER_EVENT, handleEnter)
    return () => window.removeEventListener(VAULT_ENTER_EVENT, handleEnter)
  }, [])

  return (
    <main className="relative z-10 flex h-dvh w-full items-center justify-center overflow-hidden">
      <section className={`relative z-10 flex max-w-2xl flex-col items-center px-6 text-center transition-[opacity,transform] duration-300 ease-out ${entering ? 'pointer-events-none -translate-y-2 opacity-0' : ''}`}>
        <span
          className="animate-fade-up flex items-center gap-2 rounded-full border border-strawberry/55 bg-[#2a0016]/35 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.35em] text-strawberry-soft shadow-[0_8px_32px_rgba(20,0,14,0.25)] backdrop-blur-md"
          style={{ animationDelay: '900ms' }}
        >
          <Lock className="size-3" aria-hidden="true" />
          Private Space
        </span>

        <h1 className="mt-8 font-serif text-6xl leading-none text-foreground [text-shadow:0_6px_50px_rgba(20,0,14,0.82)] md:text-8xl">
          <span className="sr-only">Ahmad&apos;s Vault</span>
          <RevealLetters text="Ahmad's " start={1100} />
          <span aria-hidden="true" className="animate-vault-title inline-block bg-gradient-to-r from-strawberry via-honey to-strawberry bg-[length:200%_100%] bg-clip-text italic text-transparent">
            Vault
          </span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-md text-pretty text-base leading-relaxed text-white/90 [text-shadow:0_2px_18px_rgba(20,0,14,0.8)] md:max-w-none md:whitespace-nowrap md:text-lg"
          style={{ animationDelay: '2000ms' }}
        >
          A private cinematic space for memories, light &amp; emotion.
        </p>

        <div className="animate-fade-up mt-10" style={{ animationDelay: '2300ms' }}>
          <VaultEntryButton />
        </div>

        <p
          className="animate-fade-up mt-6 text-xs font-medium tracking-[0.25em] text-white/90 [text-shadow:0_1px_8px_rgba(42,0,22,0.9)]"
          style={{ animationDelay: '2600ms' }}
        >
          {"Enter when you're ready"}
        </p>
      </section>
    </main>
  )
}
