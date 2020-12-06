import { log } from '../util/util.js'
import db from './db.js'

const mongoose = db.mongoose

let InstanceLocation = class InstanceLocation {
    constructor(locationStuff) {
        this.stuff = locationStuff
    }
}

export default InstanceLocation