import { log } from '../util/util.js'
import InstanceLocation from './InstanceLocation.js'
import { parseLocations } from './InstanceLocation.js'
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

  validate() {
    // is it impossible to walk out of the map
    // make sure all the doors lead somewhere,
    // that there is exactly one door that leads to town
    let doorsToTown = 0
    let topoLength = this.topography.length
    for (let rowIndex = 0; rowIndex < topoLength; rowIndex++) {
      let row = this.topography[rowIndex]
      for (let locationIndex = 0; locationIndex < row.length; locationIndex++) {
        if (row[locationIndex].type == 'door') {
          let door = row[locationIndex]
          if (!door.destination)
            throw `INVALID MAP ERROR: every door needs a destination but the door at ${rowIndex},${locationIndex} does not have one`
          if (door.destination == 'town') doorsToTown++
        }
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
      for (let locationIndex = 0; locationIndex < row.length; locationIndex++) {
        if (row[locationIndex].type == 'door') {
          let door = row[locationIndex]
          if (door.destination == origin) {
            return { x: locationIndex, y: rowIndex }
          }
        }
      }
    }
    return false
  }
}

const getTestInstanceMap = () => {
  const testLocationStrings = [
    'nnnnnnnnnnnnnnnnnnnnnnn',
    'nbbbbbbbbbbbbbbbbbbbbbn',
    'nbggbbggggbbbbbggGbbbbn',
    'nbgGgggbbgggggggbbbbbbn',
    'nbggggbbggbbbbbbbbbGgbn',
    'nbbggbbggbbbGggbbggggbn',
    'nbbbgbggbbbbggggggbggbn',
    'nbbggbggggbbbbbbbgbbgbn',
    'nbbgobGooggggbbbggbggbn',
    'nbggoboooooggggggbbgbbn',
    'nbgggbooooooooobbbbgbbn',
    'nbgbgbboooOoooobgggggbn',
    'nbgbggbbbooooobgggGggbn',
    'nbgbbggbbbbggggggggggbn',
    'nbggbbggbbggggggbggggbn',
    'nbggGbbggggggbbbbbggbbn',
    'nbbbbbbbbbbdbbbbbbbbbbn',
    'nnnnnnnnnnnnnnnnnnnnnnn',
  ]
  let testLocations = parseLocations(testLocationStrings)
  // console.log(testLocations[16][11])
  let testInstance = new InstanceMap('Test Instance 0', testLocations)
  return testInstance
}

export default InstanceMap
export { getTestInstanceMap }
