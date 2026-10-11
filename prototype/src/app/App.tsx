import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { DemoControls, DemoOpener, useIsMobile } from '../components/DemoControls'
import { PhoneFrame } from '../components/PhoneFrame'
import { ProjectPanel } from '../components/ProjectPanel'
import { useFocusReturn } from '../state/FocusReturn'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, stepFromPath } from '../state/rideMachine'
import { routes } from './routes'

function useRouteSync() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { state, dispatch } = useRide()
  const firstRender = useRef(true)
  const focusReturn = useFocusReturn()
  const seenPath = useRef(pathname)

  useLayoutEffect(() => {
    const pathChanged = seenPath.current !== pathname
    seenPath.current = pathname
    const target = STEP_PATHS[state.step]
    if (target === pathname) return

    if (pathChanged) {
      const routeStep = stepFromPath(pathname)
      if (routeStep) dispatch({ type: 'GOTO', step: routeStep })
      return
    }

    navigate(target)
  })

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (document.querySelector('main [role="dialog"]')) return
    const returnId = focusReturn.take()
    const returnTarget = returnId ? document.getElementById(returnId) : null
    if (returnTarget) {
      returnTarget.focus()
      return
    }
    const heading = document.querySelector<HTMLElement>('main h1')
    if (!heading) return
    heading.tabIndex = -1
    heading.focus({ preventScroll: false })
  }, [pathname, focusReturn])

  useEffect(() => {
    const root = document.documentElement
    if (state.reducedMotion === 'system') root.removeAttribute('data-motion')
    else root.setAttribute('data-motion', state.reducedMotion)
  }, [state.reducedMotion])
}

export function App() {
  useRouteSync()
  const mobile = useIsMobile()
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div className="stage">
      {mobile ? null : <ProjectPanel />}
      <PhoneFrame
        mobile={mobile}
        headerAction={mobile ? <DemoOpener onOpen={() => setDemoOpen(true)} /> : null}
      >
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
      <DemoControls mobile={mobile} open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
