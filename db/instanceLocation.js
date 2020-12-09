// import { log } from '../util/util.js'
// import db from './db.js'

// const mongoose = db.mongoose

// used for parsing string maps
const LOCATION_TYPES = {
    N:{ // Null: a non modifyable barrier at the edge of the map that
        type: 'null',
        walkable: false,
        translucent: false,
        breakable: false 
    },         
    B:{ // Block: a solid object which can not be walked through or seen Through
        type: 'block',
        walkable: false,
        translucent: false,
        breakable: true
    },        
    F:{ // Fog: can be walked through but not seen through
        type: 'fog',
        walkable: true,
        translucent: false
    },          
    O:{ // Obstacle: can be seen through but not walked through (ie crystal, ice, brambles, rapid waters?)
        type: 'obstacle',
        walkable: false,
        translucent: true,
    },  
    S:{ // Special: specific effect based on Location (water, lava, ice, acid, etc.)
        type: 'special'
    },      
    D:{ // Door: Where the player enters or leaves from (back to town, next level of the dungeon)
        type: 'door',
        walkable: true,
        translucent: false,
        breakable: false 
    },       
    G: { // Ground: Where the player walks atop
        type: 'ground',
        walkable: true,
        translucent: true,
        breakable: false
    }

}

let InstanceLocation = class InstanceLocation {
    constructor ( locationTypeString )
    {
        let locationType = LOCATION_TYPES[ locationTypeString ]
        if ( !locationType ) throw ( `"${ locationTypeString }" is not a valid location time >:O` )
        
        // some of these may be undefined for certain types 
        //  ie. special we do not define as walkable or opaque because it changes with zone
        this.type = locationType.type
        this.walkable = locationType.walkable //can walk through
        this.translucent = locationType.translucent // can see through
        this.breakable = locationType.breakable // can be broken
    }
}

// take an array of valid letters and convert to an array of instanceLocations
const parseLocations = (locStringArray) =>
{
    let locationArray = [];    
    locStringArray.forEach( row =>
    {
        let locationRow = []
        row.forEach( locationString =>
        {
            let location = new InstanceLocation(locationString)
            locationRow.push(location)
        })
        locationArray.push(locationRow)
    });
    return locationArray
}




export default InstanceLocation
export { parseLocations, LOCATION_TYPES }