import { log } from '../util/util.js'
import { getTestInstanceMap } from './InstanceMap.js'


export default class Instance
{
    constructor ()
    {
        log('a new Instance was made!')
        this.map = getTestInstanceMap()
        this.partyCoordinates = {
            x: 0,
            y: 0
        }
        this.party = []
    }
    
    addPartyMember ( character )
    {
        this.party.push( character )
        return this.party.length
    }
}
