/**
 * class representing a resource which can be gathered by players
 * @class
 */
let Resource = class Resource {
  /**
   * @param {*} gatherSkill
   * @param {*} resourceName
   */
  constructor(gatherSkill, resourceName) {
    this.gatherSkill = gatherSkill
    this.name = resourceName
    this.itemRewards = [[]]
  }
}

const gatherSkills = {
  MINING: 'Mining',
  LICHING: 'Liching', //moss, fungi
}

export default Resource
export { gatherSkills }
