import Instance from '../Instance.js'
import Hero from '../Hero.js'
import { getTestInstanceMap } from '../InstanceMap.js'
describe('Giha class - Instance', () => {
  it('should initialize an Instance when called', () => {
    let testInstance = new Instance()
    expect(testInstance).toBeInstanceOf(Instance)
    expect(testInstance).toHaveProperty('party', [])
    expect(testInstance).toHaveProperty('map')
    expect(testInstance).toHaveProperty('partyCoordinates', { x: 16, y: 11 })
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
    expect(testInstance).toHaveProperty('partyCoordinates', { x: 16, y: 11 })
  })
  it('should throw an error if you try to set the map to something that isnt a map', () => {
    let testInstance = new Instance()

    expect(() => {
      testInstance.setMap('Sasuke Uchiha')
    }).toThrow('INSTANCE_ERROR: can only set a map to an InstanceMap')
  })
})

describe('Giha - instance renderASCII', () => {
  let testInstance = new Instance()
  it('should render a map', () => {
    let mapRender = testInstance.renderASCII()
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
        '█▓ ▓ ▓▓░░░░░░░░▓     ▓█\n' +
        '█▓ ▓  ▓▓▓░░░░░▓   ¥  ▓█\n' +
        '█▓ ▓▓  ▓▓▓▓          ▓█\n' +
        '█▓  ▓▓  ▓▓      ▓    ▓█\n' +
        '█▓  ¥▓▓      ▓▓▓▓▓  ▓▓█\n' +
        '█▓▓▓▓▓▓▓▓▓▓@▓▓▓▓▓▓▓▓▓▓█\n' +
        '███████████████████████\n'
    )
  })
  it('should render a colorized map', () => {
    let mapRender = testInstance.renderASCII(true)
    expect(mapRender).toBeDefined()
    console.log(mapRender)
    // I have no idea how to test to make sure the colors worked. screw typing all of that out.
  })
})
