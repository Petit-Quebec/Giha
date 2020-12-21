import { log } from '../util/util.js'
import { getTestInstanceMap } from './InstanceMap.js'
import InstanceMap from './InstanceMap.js'
import Hero from './Hero.js'

export default class Instance {
  constructor() {
    log('a new Instance was made!')
    this.map = getTestInstanceMap()
    this.floors = { floor1: this.map }
    this.partyCoordinates = this.map.spawnLocationFrom('town')
    this.party = []
  }

  addPartyMember(hero) {
    if (hero instanceof Hero) {
      this.party.push(hero)
      return this.party.length
    } else {
      throw 'addPartyMember needs an object of instance Hero'
    }
  }

  setMap(map) {
    if (!(map instanceof InstanceMap))
      throw 'INSTANCE_ERROR: can only set a map to an InstanceMap'
    this.map = map
    this.partyCoordinates = map.spawnLocationFrom('town')
    return true
  }

  renderASCII(colored) {
    // console.log(this.map.topography[16][13])
    let renderString = ''
    this.map.topography.forEach((row) => {
      row.forEach((location) => {
        colored
          ? (renderString += location.coloredAscii)
          : (renderString += location.ascii)
      })
      renderString += '\n'
    })
    return renderString
  }
}
