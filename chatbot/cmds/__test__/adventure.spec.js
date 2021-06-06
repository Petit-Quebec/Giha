import { run } from '../adventure.js'
import { getHeroById } from '../../../Giha/heroManager.js'
jest.mock('../../../Giha/heroManager.js')

describe('Adventure Test', () => {
  let mockEdit
  let mockMessage
  beforeEach(() => {
    mockEdit = jest.fn()
    mockMessage = {
      author: {
        id: 1,
      },
      channel: {
        send: jest.fn(() => {
          return {
            edit: mockEdit,
          }
        }),
      },
    }
  })

  it('should throw if user has no valid hero', () => {
    expect(run(null, mockMessage, [])).rejects.toEqual(
      '1 does not have a valid hero, please make a hero with !rise <name>'
    )
  })

  it('should throw if too many users are tagged', () => {
    getHeroById.mockReturnValue(true)
    expect(run(null, mockMessage, [1, 2, 3, 4, 5])).rejects.toEqual(
      'too many users tagged'
    )
  })

  it('should throw if any tagged user has no hero', () => {
    getHeroById.mockReturnValueOnce(true).mockReturnValueOnce(false)
    expect(run(null, mockMessage, [1, 2, 3, 4])).rejects.toEqual(
      '2 does not have a valid hero, please make a hero with !rise <name>'
    )
  })
})
