import { log } from '../util/util.js'
import { getTestInstanceMap } from './InstanceMap.js'
import Hero from './Hero.js'


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
    
    addPartyMember ( hero )
    {
        if ( hero instanceof Hero )
        {
            this.party.push( hero )
            return this.party.length
        }
        else
        {
            throw "addPartyMember needs an object of instance Hero"
        }
    }
}
