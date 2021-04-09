import { log } from '../util/util.js'
import { getTestInstanceMap } from './InstanceMap.js'
import InstanceMap from './InstanceMap.js'
import Hero from './Hero.js'

export default class Instance {
  constructor() {
    log('a new Instance was made!')
    this.map = getTestInstanceMap()
    this.floors = { floor1: this.map }
    this.partyCoordinates = this.map.spawnLocationFrom()
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

  move(direction) {
    let x = this.partyCoordinates.x
    let y = this.partyCoordinates.y
    switch (direction) {
      case 'up':
        if (this.map.topography[x + 1][y].walkable) {
          this.partyCoordinates.x++
          return this.partyCoordinates
        } else return false
        break
      case 'down':
        if (this.map.topography[x - 1][y].walkable) {
          this.partyCoordinates.x--
          return this.partyCoordinates
        } else return false
        break
      case 'left':
        if (this.map.topography[x][y - 1].walkable) {
          this.partyCoordinates.y--
          return this.partyCoordinates
        } else return false
        break
      case 'right':
        if (this.map.topography[x][y + 1].walkable) {
          this.partyCoordinates.y++
          return this.partyCoordinates
        } else return false
        break
      default:
        throw 'you fucked up thats not a valid direction'
    }
  }
}
