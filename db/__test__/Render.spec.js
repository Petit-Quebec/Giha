import render from '../../imgGen/map/renderer.js'
import InstanceLocation, { LOCATION_TYPES } from '../InstanceLocation.js'
import InstanceMap from '../InstanceMap.js'
import { newInstance } from '../../Giha/instanceManager.js'

describe('Render test', () => {
  const locTypes = Object.keys(LOCATION_TYPES)
  it.each(locTypes)(
    '%s- should be able to render all possible locations separately',
    async (type) => {
      let testLocation = [[new InstanceLocation(type)]]
      let testMap = new InstanceMap('Individual Test Map', testLocation)
      let testInstance = newInstance()
      testInstance.setMap(testMap)
      let imgData = await testInstance.renderMap()
      expect(imgData.slice(16, 20)).toStrictEqual(Buffer.from([0, 0, 0, 32]))
      expect(imgData.slice(20, 24)).toStrictEqual(Buffer.from([0, 0, 0, 32]))
      expect(imgData).toBeInstanceOf(Buffer)
    }
  )

  it('should be able to render all locations together', async () => {
    let testLocations = []
    for (const loc in LOCATION_TYPES) {
      testLocations.push([new InstanceLocation(loc)])
    }
    let testMap = new InstanceMap('All Test Map', testLocations)
    let testInstance = newInstance()
    testInstance.setMap(testMap)
    let imgData = await testInstance.renderMap()
    let heightPixels = 32 * testMap.height
    let widthPixels = 32 * testMap.width
    let Hbyte1 = 0xff & heightPixels
    let Hbyte2 = 0xff & (heightPixels >> 8)
    let Hbyte3 = 0xff & (heightPixels >> 16)
    let Hbyte4 = 0xff & (heightPixels >> 24)
    let Wbyte1 = 0xff & widthPixels
    let Wbyte2 = 0xff & (widthPixels >> 8)
    let Wbyte3 = 0xff & (widthPixels >> 16)
    let Wbyte4 = 0xff & (widthPixels >> 24)
    expect(imgData.slice(20, 24)).toStrictEqual(
      Buffer.from([Hbyte4, Hbyte3, Hbyte2, Hbyte1])
    )
    expect(imgData.slice(16, 20)).toStrictEqual(
      Buffer.from([Wbyte4, Wbyte3, Wbyte2, Wbyte1])
    )
  })

  it('should throw when called on something other than an instance', async () => {
    await expect(render('not a map')).rejects.toEqual(
      'Input should be of type Instance, not string'
    )
    await expect(render(50)).rejects.toEqual(
      'Input should be of type Instance, not number'
    )
  })
})
