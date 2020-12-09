import { log } from '../util/util.js'
import instanceLocation from './instanceLocation.js'
import { parseLocations } from './instanceLocation.js'
// import db from './db.js'

// const mongoose = db.mongoose

let InstanceMap = class InstanceMap {
    constructor ( mapName, topography )
    {
        topography.array.forEach( locationRow =>
        {
            locationRow.forEach( location =>
            {
                
                if ( !( location instanceof instanceLocation ) )
                throw "instance maps must be made of instancelocations!!"
            })
            
        });
        this.mapName = 'mapName'
        this.topography = topography //an array of instanceLocations

            log(`a new map called ${mapName}`)
    }
    getLocationAt(x,y) {
        return this.topography[x,y]
    }
}

const getTestInstance = () =>{
    const testLocationStrings =
        [
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
            ['N', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'N'],
            ['N', 'S', ' ', ' ', 'S', 'S', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', ' ', ' ', 'E', 'S', 'S', 'S', 'S', 'N'],
            ['N', 'S', ' ', 'E', ' ', ' ', ' ', 'S', 'S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', 'S', 'N'],
            ['N', 'S', ' ', ' ', ' ', ' ', 'S', 'S', ' ', ' ', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'E', ' ', 'S', 'N'],
            ['N', 'S', 'S', ' ', ' ', 'S', 'S', ' ', ' ', 'S', 'S', 'S', 'E', ' ', ' ', 'S', 'S', ' ', ' ', ' ', ' ', 'S', 'N'],
            ['N', 'S', 'S', 'S', ' ', 'S', ' ', ' ', 'S', 'S', 'S', 'S', ' ', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' ', 'S', 'N'],
            ['N', 'S', 'S', ' ', ' ', 'S', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', 'S', 'S', ' ', 'S', 'N'],
            ['N', 'S', 'S', ' ', 'v', 'S', 'E', 'v', 'v', ' ', ' ', ' ', ' ', 'S', 'S', 'S', ' ', ' ', 'S', ' ', ' ', 'S', 'N'],
            ['N', 'S', ' ', ' ', 'v', 'S', 'v', 'v', 'v', 'v', 'v', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', ' ', 'S', 'S', 'N'],
            ['N', 'S', ' ', ' ', ' ', 'S', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'S', 'S', 'S', 'S', ' ', 'S', 'S', 'N'],
            ['N', 'S', ' ', 'S', ' ', 'S', 'S', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'v', 'S', ' ', ' ', ' ', ' ', ' ', 'S', 'N'],
            ['N', 'S', ' ', 'S', ' ', ' ', 'S', 'S', 'S', 'v', 'v', 'v', 'v', 'v', 'S', ' ', ' ', ' ', 'E', ' ', ' ', 'S', 'N'],
            ['N', 'S', ' ', 'S', 'S', ' ', ' ', 'S', 'S', 'S', 'S', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'N'],
            ['N', 'S', ' ', ' ', 'S', 'S', ' ', ' ', 'S', 'S', ' ', ' ', ' ', ' ', ' ', ' ', 'S', ' ', ' ', ' ', ' ', 'S', 'N'],
            ['N', 'S', ' ', ' ', 'E', 'S', 'S', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', ' ', ' ', 'S', 'S', 'N'],
            ['N', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'T', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'N'],
            ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N']
        ]
    let testLocations = parseLocations(testLocationStrings)
    let testInstance = new InstanceMap( 'Test Instance 0', testLocations )
    return testInstance
}


export default InstanceMap
export {getTestInstance}