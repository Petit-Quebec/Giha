import Encounter from './Encounter.js'
import encounterTypes from './Encounter.js'
import encounterStatuses from './Encounter.js'
/**
 * @class
 * @requires ./Encounter
 */
class MiningEncounter extends Encounter {
  /**
   *
   * @param {Monster} enemy
   */
  constructor() {
    super(encounterTypes.MINING)
  }

  isReady() {
    if (this.miningTarget == undefined)
      ///maybe should be instanceOf resource and type = mining or something
      throw 'mining encounters need something to mine'
    this.encounterStatus = encounterStatuses.READY
    return true
  }
}
export default MiningEncounter
