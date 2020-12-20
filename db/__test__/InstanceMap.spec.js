import InstanceMap from '../InstanceMap.js'
import { getTestInstanceMap, mapValidator } from '../InstanceMap.js'
import InstanceLocation from '../InstanceLocation.js'
describe('Giha class - InstanceMap', () => {
  let testLocationArray
  let testLocation
  let testMapName = 'testMap'
  let map

  beforeEach(() => {
    testLocationArray = undefined
    testLocation = undefined
    testMapName = undefined
    map = undefined
  })

  it('should correctly initialize an InstanceMap class when given a valid input', () => {
    testLocationArray = []
    testLocation = new InstanceLocation('N')
    testLocationArray.push([testLocation])
    map = new InstanceMap(testMapName, testLocationArray)
    expect(map).toBeInstanceOf(InstanceMap)
    expect(map).toHaveProperty('name')
    expect(map).toHaveProperty('name', testMapName)
    expect(map).toHaveProperty('topography')
    expect(map).toHaveProperty('topography', [[testLocation]])
  })

  it('should throw a specific error when passed invalid inputs', () => {
    testLocationArray = []
    testLocationArray.push([7])
    expect(() => {
      new InstanceMap(testMapName, testLocationArray)
    }).toThrow('instance maps must be made of InstanceLocations!!')
  })

  it('should return a location when requested', () => {
    testLocationArray = []
    testLocation = new InstanceLocation('N')
    testLocationArray.push([testLocation])
    map = new InstanceMap(testMapName, testLocationArray)
    expect(map.getLocationAt(0, 0) == testLocation)
  })
})
describe('Giha - testInstance', () => {
  it('should provide a valid test instanceMap', () => {
    let testInstance = getTestInstanceMap()
    expect(testInstance).toBeInstanceOf(InstanceMap)
  })
})

describe('Giha - mapValidator', () => {
  it('should return false because it has not been made yet', () => {
    expect(mapValidator()).toBe(false)
  })
})
