// import { log } from '../util/util.js'
// import db from './db.js'

// const mongoose = db.mongoose
const VALID_LOCATION_TYPES = [
    'N', // Null: a non modifyable barrier at the edge of the map that
    'B', // Block: a solid object which can not be walked through or seen Through
    'F', // Fog: can be walked through but not seen through
    'T', // Translucent: can be seen through but not walked through
    'S', // Special: specific effect based on Location (water, lava, ice, acid, etc.)
    'D', // Door: Where the player enters or leaves from (back to town, next level of the dungeon)
]

let InstanceLocation = class InstanceLocation {
    constructor ( locationType )
    {
        if (VALID_LOCATION_TYPES.find(locationType))
        this.type = locationType
    }
}

export default InstanceLocation