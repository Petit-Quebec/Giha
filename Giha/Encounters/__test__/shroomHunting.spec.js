import ShroomHunt from '../shroomHunting'

describe('Giha Encounters - shroomHunting', () => {
  let numShrooms = Math.ceil(Math.random() * 19)
  let testHunt = new ShroomHunt(numShrooms)
  it('should make a new shroomHunt with all the shroom gubbins', () => {
    expect(testHunt).toHaveProperty('mushrooms')
    expect(testHunt).toHaveProperty('score')
    expect(testHunt.score).toEqual(0)
    expect(testHunt.mushrooms.length).toEqual(numShrooms)
  })
  it('should increment score when mushroom is picked', () => {
    let testShroom = testHunt.mushrooms[0]
    testHunt.pick(testShroom)
    expect(testHunt.score).toEqual(testShroom.quality)
  })
  it("shouldn't let you make more than 20 mushrooms in one place?", () => {
    expect(() => {
      new ShroomHunt(21)
    }).toThrow(
      new Error('Only 20 mushrooms can be in the same place at the same time!')
    )
  })
})
