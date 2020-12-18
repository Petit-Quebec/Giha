import { log } from '../util/util.js'
import instanceLocation from './instanceLocation.js'
import { parseLocations } from './instanceLocation.js'
// import db from './db.js'

// const mongoose = db.mongoose

let InstanceMap = class InstanceMap {
  constructor(mapName, topography) {
    topography.array.forEach((locationRow) => {
      locationRow.forEach((location) => {
        if (!(location instanceof instanceLocation))
          throw 'instance maps must be made of instancelocations!!'
      })
    })
    this.mapName = 'mapName'
    this.topography = topography //an array of instanceLocations
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
    'NS  SS    SSSSS  ESSSSN',
    'NS E   SS       SSSSSSN',
    'NS    SS  SSSSSSSSSE SN',
    'NSS  SS  SSSE  SS    SN',
    'NSSS S  SSSS      S  SN',
    'NSS  S    SSSSSSS SS SN',
    'NSS vSEvv    SSS  S  SN',
    'NS  vSvvvvv      SS SSN',
    'NS   SvvvvvvvvvSSSS SSN',
    'NS S SSvvvvvvvvS     SN',
    'NS S  SSSvvvvvS   E  SN',
    'NS SS  SSSS          SN',
    'NS  SS  SS      S    SN',
    'NS  ESS      SSSSS  SSN',
    'NSSSSSSSSSSTSSSSSSSSSSN',
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
