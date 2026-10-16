import { lazy, Suspense } from 'react'

const Vault3DScene = lazy(() => import('./vault-3d-scene'))

export function Vault3DSceneLoader() {
  return (
    <Suspense fallback={null}>
      <Vault3DScene />
    </Suspense>
  )
}
