import MiningEncounter from '../MiningEncounter'
describe('Giha Class - Mining Encounter', () => {
  let testMiningEncounter = new MiningEncounter()
  it('should be able to instantiate a mining event', () => {
    expect(testMiningEncounter instanceof MiningEncounter)
  })
  it("shouldn't be ready unitl the conditions are met")
})
