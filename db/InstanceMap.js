import { log } from '../util/util.js'
import db from './db.js'

const mongoose = db.mongoose

let InstanceMap = class InstanceMap {
    constructor(mapString) {
        this.mapName = "New Map"
        this.topography = [] //an array of instanceLocations
    }
    getLocationAt(x,y) {
        return this.topography[x,y]
    }
}

export default InstanceMap