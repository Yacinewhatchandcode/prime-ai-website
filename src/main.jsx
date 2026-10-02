import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
window.Buffer = Buffer
import './index.css'
import App from './App.jsx'
import './styles/sovereign-gold-tokens.css'
import './styles/sovereign-gold.css'

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(error => {
    console.error('Offline app installation failed:', error.message)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
