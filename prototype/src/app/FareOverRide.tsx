import { Inert } from '../components/Inert'
import Fare from '../screens/Fare'
import Ride from '../screens/Ride'

export default function FareOverRide() {
  return (
    <>
      <Inert>
        <Ride />
      </Inert>
      <Fare />
    </>
  )
}
