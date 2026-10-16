import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AhmadsVaultRouter from './ahmads-vault/vault-router'
import './ahmads-vault/styles/vault-theme.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AhmadsVaultRouter />
    </BrowserRouter>
  </React.StrictMode>,
)
