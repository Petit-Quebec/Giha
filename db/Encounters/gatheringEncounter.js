import Resource, { gatherSkills } from '../Resources.js'
import Encounter from './Encounter.js'
import encounterTypes from './Encounter.js'
import encounterStatuses from './Encounter.js'
/**
 * class representing a mining encounter
 * @class
 * @requires ./Encounter
 */
class ResourceEncounter extends Encounter {
  /**
   *
   * @param {string} gatherSkill - which profession this encounter will use
   */
  constructor(gatherSkill) {
    this.gatherSkill = gatherSkill
    super(encounterTypes.GATHERING)
    this.resource
  }

  setResource(resource) {
    this.resource = resource
  }

  isReady() {
    if (
      !this.resource instanceof Resource ||
      this.resource.gatherSkill == undefined
    )
      throw 'gathering encounters need something to gather'
    this.encounterStatus = encounterStatuses.READY
    return true
  }
}
export default ResourceEncounter
