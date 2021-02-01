// import { log } from '../util/util.js'
// import db from './db.js'

// const mongoose = db.mongoose

// used for parsing string maps
const LOCATION_TYPES = {
  N: {
    // Null: a non modifyable barrier at the edge of the map that
    type: 'null',
    walkable: false,
    translucent: false,
    breakable: false,
    ascii: '█',
  },
  B: {
    // Block: a solid object which can not be walked through or seen Through
    type: 'block',
    walkable: false,
    translucent: false,
    breakable: true,
    ascii: '▓',
  },
  F: {
    // Fog: can be walked through but not seen through
    type: 'fog',
    walkable: true,
    translucent: false,
    ascii: '©',
  },
  O: {
    // Obstacle: can be seen through but not walked through (ie crystal, ice, brambles, rapid waters?)
    type: 'obstacle',
    walkable: false,
    translucent: true,
    ascii: '░',
  },
  S: {
    // Special: specific effect based on Location (water, lava, ice, acid, etc.)
    type: 'special',
    ascii: '¿',
  },
  D: {
    // Door: Where the player enters or leaves from (back to town, next level of the dungeon)
    type: 'door',
    walkable: true,
    translucent: false,
    breakable: false,
    destination: 'town',
    ascii: 'Ð',
  },
  E: {
    // Encounter: Where players encounter content
    type: 'trap-door_closed',
    walkable: true,
    translucent: true,
    breakable: false,
    encounter: 'COMBAT WOMBAT',
    ascii: '¥',
  },
  G: {
    // Ground: Where the player walks atop
    type: 'ground_rock',
    walkable: true,
    translucent: true,
    breakable: false,
    ascii: ' ',
  },
}

let InstanceLocation = class InstanceLocation {
  constructor(locationTypeString) {
    let locationType = LOCATION_TYPES[locationTypeString]
    if (!locationType)
      throw `"${locationTypeString}" is not a valid location type >:O`

    // some of these may be undefined for certain types
    //  ie. special we do not define as walkable or opaque because it changes with zone
    this.type = locationType.type
    this.ascii = locationType.ascii
    this.walkable = locationType.walkable //can walk through
    this.translucent = locationType.translucent // can see through
    this.breakable = locationType.breakable // can be broken
    if (locationType.destination) this.destination = locationType.destination
    if (locationType.encounter) this.encounter = locationType.encounter
    // descriptors
    // encounter
  }
}

// take an array of valid letters and convert to an array of instanceLocations
const parseLocations = (locStringArray) => {
  let locationArray = []
  locStringArray.forEach((row) => {
    let locationRow = []
    for (let index = 0; index < row.length; index++) {
      let location = new InstanceLocation(row[index])
      locationRow.push(location)
    }
    locationArray.push(locationRow)
  })
  return locationArray
}

export default InstanceLocation
export { parseLocations, LOCATION_TYPES }
