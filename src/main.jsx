import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/ui/spotlight-card.css'
import { initGlowPointer } from './lib/useGlowPointer.js'
import App from './App.jsx'

initGlowPointer()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
