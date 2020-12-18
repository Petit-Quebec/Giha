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
    // this.zone // what zone it is in
    //

    log(`a new map called ${mapName}`)
  }

  getLocationAt(x, y) {
    return this.topography[(x, y)]
  }
}

const getTestInstance = () => {
  const testLocationStrings = [
    'NNNNNNNNNNNNNNNNNNNNNNN',
    'NSSSSSSSSSSSSSSSSSSSSSN',
    'NSGGSSGGGGSSSSSGGESSSSN',
    'NSGEGGGSSGGGGGGGSSSSSSN',
    'NSGGGGSSGGSSSSSSSSSEGSN',
    'NSSGGSSGGSSSEGGSSGGGGSN',
    'NSSSGSGGSSSSGGGGGGSGGSN',
    'NSSGGSGGGGSSSSSSSGSSGSN',
    'NSSGOSEOOGGGGSSSGGSGGSN',
    'NSGGOSOOOOOGGGGGGSSGSSN',
    'NSGGGSOOOOOOOOOSSSSGSSN',
    'NSGSGSSOOOOOOOOSGGGGGSN',
    'NSGSGGSSSOOOOOSGGGEGGSN',
    'NSGSSGGSSSSGGGGGGGGGGSN',
    'NSGGSSGGSSGGGGGGSGGGGSN',
    'NSGGESSGGGGGGSSSSSGGSSN',
    'NSSSSSSSSSSDSSSSSSSSSSN',
    'NNNNNNNNNNNNNNNNNNNNNNN'
  ]
  let testLocations = parseLocations(testLocationStrings)
  let testInstance = new InstanceMap('Test Instance 0', testLocations)
  return testInstance
}

const mapValidator = () => {
  //make sure all the doors lead somewhere, etc.
  return false
}

export default InstanceMap
export { getTestInstance, mapValidator }
