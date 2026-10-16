import { Route, Routes } from 'react-router-dom'
import { VaultBackdrop } from './components/vault-backdrop'
import EntrancePage from './pages/entrance-page'
import VaultPage from './pages/vault-page'

export default function AhmadsVaultRouter() {
  return (
    <div className="relative min-h-dvh bg-[#2a0016]">
      <VaultBackdrop />
      <Routes>
        <Route path="/" element={<EntrancePage />} />
        <Route path="/vault" element={<VaultPage />} />
      </Routes>
    </div>
  )
}
