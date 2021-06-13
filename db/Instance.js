import { log } from '../util/util.js'
import { getTestInstanceMap } from './InstanceMap.js'
import InstanceMap from './InstanceMap.js'
import Hero from './Hero.js'
import mapRenderer from '../imgGen/map/renderer.js'

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

  async renderMap() {
    return await mapRenderer(this)
  }

  renderASCII() {
    let renderString = ''
    this.map.topography.forEach((row) => {
      row.forEach((location) => {
        renderString += location.ascii
      })
      renderString += '\n'
    })
    let rowLength = this.map.topography[0].length
    let index =
      this.partyCoordinates.y * (rowLength + 1) + this.partyCoordinates.x
    console.log(index)
    console.log(renderString[index])

    renderString =
      renderString.substring(0, index) +
      '@' +
      renderString.substring(index + 1, renderString.length)

    return renderString
  }

  move(direction) {
    // console.log(this.map.topography)
    let x = this.partyCoordinates.x
    let y = this.partyCoordinates.y
    console.log(`x:${x} y:${y}`)
    switch (direction) {
      case 'up':
        if (this.map.topography[y - 1][x].walkable) {
          this.partyCoordinates.y--
          return this.partyCoordinates
        } else return false
      case 'down':
        if (this.map.topography[y + 1][x].walkable) {
          this.partyCoordinates.y++
          return this.partyCoordinates
        } else return false
      case 'left':
        if (this.map.topography[y][x - 1].walkable) {
          this.partyCoordinates.x--
          return this.partyCoordinates
        } else return false
      case 'right':
        if (this.map.topography[y][x + 1].walkable) {
          this.partyCoordinates.x++
          return this.partyCoordinates
        } else return false
      default:
        throw 'you fucked up thats not a valid direction'
    }
  }
}
