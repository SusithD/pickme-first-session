import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { DemoControls, DemoOpener, useIsMobile } from '../components/DemoControls'
import { PhoneFrame } from '../components/PhoneFrame'
import { ProjectPanel } from '../components/ProjectPanel'
import { useEmbed } from '../state/EmbedContext'
import { useFocusReturn } from '../state/FocusReturn'
import { useRide } from '../state/RideContext'
import { STEP_PATHS, stepFromPath } from '../state/rideMachine'
import { routes } from './routes'

const EMBED_DEVICE_W = 414
const EMBED_DEVICE_H = 868

function useRouteSync() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { state, dispatch } = useRide()
  const firstRender = useRef(true)
  const focusReturn = useFocusReturn()
  const seenPath = useRef(pathname)
  const { quiet } = useEmbed()

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
    if (quiet()) return
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
  }, [pathname, focusReturn, quiet])

  useEffect(() => {
    const root = document.documentElement
    if (state.reducedMotion === 'system') root.removeAttribute('data-motion')
    else root.setAttribute('data-motion', state.reducedMotion)
  }, [state.reducedMotion])
}

function ScreenRoutes() {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function useFitScale(): number {
  const compute = () =>
    Math.min(window.innerWidth / EMBED_DEVICE_W, window.innerHeight / EMBED_DEVICE_H)
  const [scale, setScale] = useState(compute)
  useEffect(() => {
    const update = () => setScale(compute())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return scale
}

function EmbedStage() {
  const scale = useFitScale()
  return (
    <div className="embed-stage">
      <div
        className="embed-fit"
        style={{
          width: EMBED_DEVICE_W,
          height: EMBED_DEVICE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <PhoneFrame mobile={false}>
          <ScreenRoutes />
        </PhoneFrame>
      </div>
    </div>
  )
}

export function App({ embed = false }: { embed?: boolean }) {
  useRouteSync()
  const mobile = useIsMobile()
  const [demoOpen, setDemoOpen] = useState(false)

  if (embed) return <EmbedStage />

  return (
    <div className="stage">
      {mobile ? null : <ProjectPanel />}
      <PhoneFrame
        mobile={mobile}
        headerAction={mobile ? <DemoOpener onOpen={() => setDemoOpen(true)} /> : null}
      >
        <ScreenRoutes />
      </PhoneFrame>
      <DemoControls mobile={mobile} open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
