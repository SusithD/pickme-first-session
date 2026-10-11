import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './app/App'
import { readEmbedRequest } from './app/embed'
import { SCENES } from './app/scenes'
import { I18nProvider } from './i18n/I18nContext'
import { EmbedProvider } from './state/EmbedContext'
import { FocusReturnProvider } from './state/FocusReturn'
import { RideProvider } from './state/RideContext'

const container = document.getElementById('root')
if (!container) throw new Error('Root element missing')

const request = readEmbedRequest()
const scene = SCENES[request.scene]

function renderApp() {
  return (
    <HashRouter>
      <RideProvider initialState={request.embed ? scene.state : undefined}>
        <I18nProvider>
          <FocusReturnProvider>
            <App embed={request.embed} />
          </FocusReturnProvider>
        </I18nProvider>
      </RideProvider>
    </HashRouter>
  )
}

if (request.embed) {
  document.documentElement.setAttribute('data-embed', '')
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}#${scene.route}`,
  )
}

createRoot(container).render(
  <StrictMode>
    {request.embed ? (
      <EmbedProvider local={scene.local ?? {}}>{renderApp()}</EmbedProvider>
    ) : (
      renderApp()
    )}
  </StrictMode>,
)
