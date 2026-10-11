import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { DemoControls } from '../components/DemoControls'
import { PhoneFrame } from '../components/PhoneFrame'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, stepFromPath } from '../state/rideMachine'
import { routes } from './routes'

function useRouteSync() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { state, dispatch } = useRide()
  const firstRender = useRef(true)

  useEffect(() => {
    const step = stepFromPath(pathname)
    if (step && step !== state.step) dispatch({ type: 'GOTO', step })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const target = STEP_PATHS[state.step]
    if (target !== pathname) navigate(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const heading = document.querySelector<HTMLElement>('main h1')
    if (!heading) return
    heading.tabIndex = -1
    heading.focus({ preventScroll: false })
  }, [pathname])

  useEffect(() => {
    const root = document.documentElement
    if (state.reducedMotion === 'system') root.removeAttribute('data-motion')
    else root.setAttribute('data-motion', state.reducedMotion)
  }, [state.reducedMotion])
}

export function App() {
  useRouteSync()

  return (
    <div className="stage">
      <PhoneFrame>
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
      <DemoControls />
    </div>
  )
}
