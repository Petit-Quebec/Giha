import { log } from '../util/util.js'
import InstanceLocation from './InstanceLocation.js'
import { parseLocations } from './InstanceLocation.js'
import mapRenderer from '../imgGen/map/renderer.js'
// import db from './db.js'

// const mongoose = db.mongoose

let InstanceMap = class InstanceMap {
  constructor(mapName, topography) {
    topography.forEach((locationRow) => {
      locationRow.forEach((location) => {
        if (!(location instanceof InstanceLocation))
          throw 'instance maps must be made of InstanceLocations!!'
      })
    })
    this.name = mapName
    this.topography = topography //an array of InstanceLocations
    this.width = topography[0].length
    this.height = topography.length
    // this.zone // what zone it is in
    //

    log(`a new map called ${mapName}`)
  }

  getLocationAt(x, y) {
    return this.topography[x][y]
  }
  
  renderASCII() {
    let renderString = ''
    this.topography.forEach((row) => {
      row.forEach((location) => {
        renderString += location.ascii
      })
      renderString += '\n'
    })
    return renderString
  }
  
  async renderImg() {
    return await mapRenderer(this)
  }

  validate() {
    // is it impossible to walk out of the map
    // make sure all the doors lead somewhere,
    // that there is exactly one door that leads to town
    let doorsToTown = 0
    let topoLength = this.topography.length
    for (let rowIndex = 0; rowIndex < topoLength; rowIndex++) {
      let row = this.topography[rowIndex]
      let doorIndex = row.findIndex((location) => location.type == 'door')
      while (doorIndex != -1) {
        let door = row[doorIndex]
        if (!door.destination)
          throw `INVALID MAP ERROR: every door needs a destination but the door at ${rowIndex},${doorIndex} does not have one`
        if (door.destination == 'town') doorsToTown++
        row = row.splice(doorIndex + 1, row.length)
        doorIndex = row.findIndex((location) => location.type == 'door')
      }
    }
    if (doorsToTown != 1)
      throw `INVALID MAP ERROR: each map needs exactly 1 door to town, this map has ${doorsToTown}`
    return true
  }

  spawnLocationFrom(origin) {
    let topoLength = this.topography.length

    for (let rowIndex = 0; rowIndex < topoLength; rowIndex++) {
      let row = this.topography[rowIndex]
      let doorIndex = row.findIndex((location) => location.type == 'door')
      while (doorIndex != -1) {
        let door = row[doorIndex]
        if (door.destination == origin) {
          return { x: rowIndex, y: doorIndex }
        } else {
          row = row.splice(doorIndex + 1, row.length)
        }
        doorIndex = row.findIndex((location) => location.type == 'door')
      }
    }
    return false
  }
}

const getTestInstanceMap = () => {
  const testLocationStrings = [
    'NNNNNNNNNNNNNNNNNNNNNNN',
    'NBBBBBBBBBBBBBBBBBBBBBN',
    'NBGGBBGGGGBBBBBGGEBBBBN',
    'NBGEGGGBBGGGGGGGBBBBBBN',
    'NBGGGGBBGGBBBBBBBBBEGBN',
    'NBBGGBBGGBBBEGGBBGGGGBN',
    'NBBBGBGGBBBBGGGGGGBGGBN',
    'NBBGGBGGGGBBBBBBBGBBGBN',
    'NBBGOBEOOGGGGBBBGGBGGBN',
    'NBGGOBOOOOOGGGGGGBBGBBN',
    'NBGGGBOOOOOOOOOBBBBGBBN',
    'NBGBGBBOOOOOOOOBGGGGGBN',
    'NBGBGGBBBOOOOOBGGGEGGBN',
    'NBGBBGGBBBBGGGGGGGGGGBN',
    'NBGGBBGGBBGGGGGGBGGGGBN',
    'NBGGEBBGGGGGGBBBBBGGBBN',
    'NBBBBBBBBBBDBBBBBBBBBBN',
    'NNNNNNNNNNNNNNNNNNNNNNN',
  ]
  let testLocations = parseLocations(testLocationStrings)
  let testInstance = new InstanceMap('Test Instance 0', testLocations)
  return testInstance
}

export default InstanceMap
export { getTestInstanceMap }
