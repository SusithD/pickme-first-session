import type { ComponentType } from 'react'
import Arrived from '../screens/Arrived'
import Fare from '../screens/Fare'
import Finding from '../screens/Finding'
import Help from '../screens/Help'
import Intro from '../screens/Intro'
import Location from '../screens/Location'
import Problem from '../screens/Problem'
import Receipt from '../screens/Receipt'
import Ride from '../screens/Ride'
import Trip from '../screens/Trip'
import Verify from '../screens/Verify'
import Welcome from '../screens/Welcome'
import Where from '../screens/Where'
import { STEP_PATHS } from '../state/rideMachine'
import type { Step } from '../state/rideMachine'

export interface ScreenRoute {
  step: Step
  path: string
  Component: ComponentType
}

const screens: Record<Step, ComponentType> = {
  intro: Intro,
  problem: Problem,
  welcome: Welcome,
  location: Location,
  where: Where,
  ride: Ride,
  fare: Fare,
  verify: Verify,
  finding: Finding,
  trip: Trip,
  arrived: Arrived,
  receipt: Receipt,
  help: Help,
}

export const routes: ScreenRoute[] = (Object.keys(screens) as Step[]).map((step) => ({
  step,
  path: STEP_PATHS[step],
  Component: screens[step],
}))
