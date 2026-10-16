import { Vault3DSceneLoader } from './vault-3d-scene-loader'

export function VaultBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#2a0016]">
      <img
        src="/images/vault-entry-background.png"
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.06] object-cover"
      />
      <Vault3DSceneLoader />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_36%_at_50%_48%,rgba(64,0,30,0.54)_0%,rgba(42,0,22,0.28)_56%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,0,20,0.24)_0%,rgba(42,0,22,0.02)_38%,rgba(28,0,20,0.44)_100%)]" />
    </div>
  )
}
