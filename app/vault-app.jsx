'use client'

import { BrowserRouter } from 'react-router-dom'
import AhmadsVaultRouter from '../ahmads-vault/vault-router'

export default function VaultApp() {
  return (
    <BrowserRouter>
      <AhmadsVaultRouter />
    </BrowserRouter>
  )
}
