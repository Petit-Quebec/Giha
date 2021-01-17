// import monsters from './Monster.js'

// is a base class that manages the encounter between heroes and their environment (including monsters
// ie, a party battling a drake
// ie. an herbalist picking mushrooms

// Encounters are built at time of instance generation, then activated when the player(s) come in contact with them

/** Class representing an encounter
 * @class
 */
let Encounter = class Encounter {
  /**
   * @param {string} encounterType
   */

  constructor(encounterType) {
    this.channel
    this.encounterType = encounterType
    this.encounterStatus = encounterStatuses.INITIALIZING
    this.responseActions = []
    this.prompt
    this.completionTasks = [] //an array of callbacks to be called once the encounter is complete
  }

  end() {
    this.isActive = false
  }

  /**
   *function that says if this incounter is finished being built out
   */
  isReady() {
    return this.encounterStatus == encounterStatuses.READY
  }

  isActive() {
    return this.encounterStatus == encounterStatuses.ACTIVE
  }
}

const encounterTypes = {
  FIGHTING: 'Fighting',
  GATHERING: 'Gathering',
}

const encounterStatuses = {
  INITIALIZING: 'Initializing', // Encounter has been made but is not ready for player(s) yet
  READY: 'Ready', //Encounter is ready for player(s)
  ACTIVE: 'Active', // player(s) are actively engaging with the encounter
  COMPLETE: 'Complete', // the encounter has been completed
}
export default Encounter
export { encounterTypes, encounterStatuses }
