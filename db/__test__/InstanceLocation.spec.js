import { parseLocations, LOCATION_TYPES } from '../InstanceLocation.js'
import InstanceLocation from '../InstanceLocation.js'
describe('Giha class - InstanceLocation', () => {
  let locKeys = Object.keys(LOCATION_TYPES)
  beforeEach(() => {})

  it('should initialize locations with information based on the location types.', () => {
    // make one of each instanceLocation and check them
    locKeys.forEach((typeString) => {
      let testInstanceLocation = new InstanceLocation(typeString)

      let typeKeys = Object.keys(LOCATION_TYPES[typeString])
      typeKeys.forEach((typeKey) => {
        expect(testInstanceLocation).toHaveProperty(typeKey)
        expect(testInstanceLocation).toHaveProperty(
          typeKey,
          LOCATION_TYPES[typeString][typeKey]
        )
      })
      expect(testInstanceLocation).toBeInstanceOf(InstanceLocation)
    })
  })

  it('should reject bad constructor arguments', () => {
    expect(() => {
      new InstanceLocation(
        "please don't make an instance location type with this name"
      )
    }).toThrow(
      '"please don\'t make an instance location type with this name" is not a valid location type >:O'
    )
  })

  it('correctly parse locations from strings', () => {
    let testLocationStringArray = [locKeys]
    let testLocationArray = parseLocations(testLocationStringArray)
    expect(testLocationArray).toHaveLength(1)
    expect(testLocationArray[0]).toHaveLength(locKeys.length)
    testLocationArray.forEach((row) => {
      row.forEach((location) => {
        expect(location).toBeInstanceOf(InstanceLocation)
      })
    })
  })
})
