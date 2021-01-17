import Resource, { gatherSkills } from '../db/GatheringResource'

let resources = []

const initializeResources = () => {
  // eventually this should get resources from the server or something idk
  const stone = new Resource(gatherSkills.MINING, 'stone')
  const copperTraces = new Resource(gatherSkills.MINING, 'copper traces')
  const copperVein = new Resource(gatherSkills.MINING, 'copper vein')
  const copperSeam = new Resource(gatherSkills.MINING, 'copper seam')
  const tinVein = new Resource(gatherSkills.MINING, 'tin vein')
  const criminiCap = new Resource(gatherSkills.LICHING, 'crimini cap')
  const portabelloTroop = new Resource(gatherSkills.LICHING, 'portabello troop')

  resources.push(
    stone,
    copperTraces,
    copperVein,
    copperSeam,
    tinVein,
    criminiCap,
    portabelloTroop
  )
}

const getResourceByName = (name) => {
  for (resource of resources) {
    if ((resource.name = name)) return resource
  }
  return -1
}

export { initializeResources, getResourceByName }
