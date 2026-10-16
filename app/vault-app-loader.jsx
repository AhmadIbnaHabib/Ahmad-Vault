'use client'

import dynamic from 'next/dynamic'

const VaultApp = dynamic(() => import('./vault-app'), { ssr: false })

export default function VaultAppLoader() {
  return <VaultApp />
}
