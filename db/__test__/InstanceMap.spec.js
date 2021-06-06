import InstanceMap from '../InstanceMap.js'
import { getTestInstanceMap } from '../InstanceMap.js'
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
  let testInstanceMap = getTestInstanceMap()
  it('should provide a valid test instanceMap', () => {
    expect(testInstanceMap).toBeInstanceOf(InstanceMap)
  })
  it('should correctly provide the location of the entrance', () => {
    let expected = { x: 11, y: 16 }
    expect(testInstanceMap.spawnLocationFrom('town')).toStrictEqual(expected)
  })
})

describe('Giha - mapValidator', () => {
  let testInstanceMap
  beforeEach(() => {
    testInstanceMap = undefined
  })
  it('should return true on a map with one door to town', () => {
    testInstanceMap = getTestInstanceMap()
    expect(testInstanceMap.validate()).toBe(true)
  })
  it('should error if there is a door that does not have a destination', () => {
    testInstanceMap = getTestInstanceMap()
    let randRow = Math.floor(Math.random() * testInstanceMap.topography.length)
    let randCol = Math.floor(
      Math.random() * testInstanceMap.topography[randRow].length
    )
    let testLocation = new InstanceLocation('D')
    testLocation.destination = undefined
    testInstanceMap.topography[randRow][randCol] = testLocation
    expect(() => {
      testInstanceMap.validate()
    }).toThrow(
      `INVALID MAP ERROR: every door needs a destination but the door at ${randRow},${randCol} does not have one`
    )
  })
  it('should error if there are no doors to town', () => {
    testInstanceMap = getTestInstanceMap()
    let testLocation = new InstanceLocation('D')
    testLocation.destination = 'Azarbazel'
    testInstanceMap.topography[16][11] = testLocation
    expect(() => {
      testInstanceMap.validate()
    }).toThrow(
      'INVALID MAP ERROR: each map needs exactly 1 door to town, this map has 0'
    )
  })
  it('should error if there are multiple doors to town', () => {
    testInstanceMap = getTestInstanceMap()
    let randRow = Math.floor(Math.random() * testInstanceMap.topography.length)
    let randCol = Math.floor(
      Math.random() * testInstanceMap.topography[randRow].length
    )
    let testLocation = new InstanceLocation('D')
    if (randRow == 16 && randCol == 11) randRow = 14
    testInstanceMap.topography[randRow][randCol] = testLocation
    expect(() => {
      testInstanceMap.validate()
    }).toThrow(
      'INVALID MAP ERROR: each map needs exactly 1 door to town, this map has 2'
    )
  })
})

describe('Giha - map renderASCII', () => {
  let testInstanceMap = getTestInstanceMap()
  let mapRender = testInstanceMap.renderASCII()
  expect(mapRender).toBe(
    '███████████████████████\n' +
      '█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█\n' +
      '█▓  ▓▓    ▓▓▓▓▓  ¥▓▓▓▓█\n' +
      '█▓ ¥   ▓▓       ▓▓▓▓▓▓█\n' +
      '█▓    ▓▓  ▓▓▓▓▓▓▓▓▓¥ ▓█\n' +
      '█▓▓  ▓▓  ▓▓▓¥  ▓▓    ▓█\n' +
      '█▓▓▓ ▓  ▓▓▓▓      ▓  ▓█\n' +
      '█▓▓  ▓    ▓▓▓▓▓▓▓ ▓▓ ▓█\n' +
      '█▓▓ ░▓¥░░    ▓▓▓  ▓  ▓█\n' +
      '█▓  ░▓░░░░░      ▓▓ ▓▓█\n' +
      '█▓   ▓░░░░░░░░░▓▓▓▓ ▓▓█\n' +
      '█▓ ▓ ▓▓░░░¥░░░░▓     ▓█\n' +
      '█▓ ▓  ▓▓▓░░░░░▓   ¥  ▓█\n' +
      '█▓ ▓▓  ▓▓▓▓          ▓█\n' +
      '█▓  ▓▓  ▓▓      ▓    ▓█\n' +
      '█▓  ¥▓▓      ▓▓▓▓▓  ▓▓█\n' +
      '█▓▓▓▓▓▓▓▓▓▓Ð▓▓▓▓▓▓▓▓▓▓█\n' +
      '███████████████████████\n'
  )
})
