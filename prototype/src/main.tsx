import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './app/App'
import { I18nProvider } from './i18n/I18nContext'
import { RideProvider } from './state/RideContext'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element missing')

createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <RideProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </RideProvider>
    </HashRouter>
  </StrictMode>,
)
