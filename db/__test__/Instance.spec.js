import Instance from '../Instance.js'
import Hero from '../Hero.js'
import { getTestInstanceMap } from '../InstanceMap.js'
describe('Giha class - Instance', () => {
  it('should initialize an Instance when called', () => {
    let testInstance = new Instance()
    expect(testInstance).toBeInstanceOf(Instance)
    expect(testInstance).toHaveProperty('party', [])
    expect(testInstance).toHaveProperty('map')
    expect(testInstance).toHaveProperty('partyCoordinates')
  })

  it('should accept a Hero as a new party member', () => {
    let testHero = new Hero(null, 'Dennis Deluxe')
    let testInstance = new Instance()
    let pLength = testInstance.addPartyMember(testHero)
    expect(testInstance).toHaveProperty('party', [testHero])
    expect(pLength).toBe(1)
  })
  it('should reject non-heros as a new party member', () => {
    let testInstance = new Instance()

    expect(() => {
      testInstance.addPartyMember('Naruto')
    }).toThrow('addPartyMember needs an object of instance Hero')
  })
  it('should change maps as expected', () => {
    let testInstance = new Instance()

    expect(testInstance.setMap(getTestInstanceMap())).toBe(true)
    expect(testInstance).toHaveProperty('partyCoordinates', { x: 11, y: 16 })
  })
  it("should throw an error if you try to set the map to something that isn't a map", () => {
    let testInstance = new Instance()

    expect(() => {
      testInstance.setMap('Sasuke Uchiha')
    }).toThrow('INSTANCE_ERROR: can only set a map to an InstanceMap')
  })
})
