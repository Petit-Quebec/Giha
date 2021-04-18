import Instance from '../../db/Instance'
import { getInstances, newInstance } from '../instanceManager'

describe('Giha Core - instanceManager', () => {
  it('should make a new instance and make sure that it is added into the instance array', () => {
    // let initialInstances = getInstances()
    let testInstance = newInstance()
    let newInstances = getInstances()
    expect(testInstance).toBeInstanceOf(Instance)
    expect(newInstances.length).toEqual(1)
  })
})
