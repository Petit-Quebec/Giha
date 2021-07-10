import { log } from '../util/util.js'
import { getTestInstanceMap } from './InstanceMap.js'
import InstanceMap from './InstanceMap.js'
import Hero from './Hero.js'
import mapRenderer from '../imgGen/map/renderer.js'
import ShroomHunt from '../Giha/Encounters/shroomHunting.js'
import { INSTANCE_STATE } from '../Giha/instanceManager.js'


export default class Instance {
  constructor() {
    log('a new Instance was made!')
    this.map = getTestInstanceMap()
    this.floors = { floor1: this.map }
    this.partyCoordinates = this.map.spawnLocationFrom('town')
    this.party = []
    this.state = INSTANCE_STATE.EXPLORATION
    this.activeEncounter = null
    this.activePrompt = null
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

    renderString =
      renderString.substring(0, index) +
      '@' +
      renderString.substring(index + 1, renderString.length)

    return renderString
  }

  changeState(state) {
    if(state == 'EXPLORATION' || state == 'ENCOUNTER' || state =='PROMPT'){
      this.state = state
      return true
    }
    else throw "InstanceError: state must be a valid INSTANCE_STATE"

  }

  move(direction) {
    // console.log(this.map.topography)
    let x = this.partyCoordinates.x
    let y = this.partyCoordinates.y
    console.log(`x:${x} y:${y}`)
    let newCoords
    switch (direction) {
      case 'up':
        newCoords = { y: y - 1, x: x }
        break
      case 'down':
        newCoords = { y: y + 1, x: x }
        break
      case 'left':
        newCoords = { y: y, x: x - 1 }
        break
      case 'right':
        newCoords = { y: y, x: x + 1 }
        break
      default:
        throw `you fucked up, ${direction} is not a valid direction`
    }
    let newLoc = this.map.topography[newCoords.y][newCoords.x]
    if (newLoc.walkable) {
      // move successful
      this.partyCoordinates = newCoords
      if (newLoc.encounter) {
        // if the new location's encounter is not undefined then state change to encounter, figure out the encounter, and set it as the active encounter
        this.changeState(INSTANCE_STATE.ENCOUNTER)
        this.activeEncounter = new ShroomHunt(7)
        this.activeEncounter.setParentInstance(this)
      } else if (newLoc.type == 'door') {
        if (newLoc.destination == 'town') {
          // ask player if they want to go through the door to town
          this.changeState(INSTANCE_STATE.PROMPT)
        } else if (newLoc.destination) {
          this.changeState(INSTANCE_STATE.PROMPT)
          // ask player if they want to go through the door to the unknown
          // trigger map change
        } else {
          throw 'no way you should have ended up here!'
        }
      }
    } else {
      // move unsuccesssful
    }
    return this.partyCoordinates
  }
  
  getLocation() {
    return this.map.topography[this.partyCoordinates.y][this.partyCoordinates.x]
  }
}
