import adventure from '../adventure.js'
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

  it('should send an error if user has no valid hero', async () => {
    await adventure.run(undefined, mockMessage, [])
    expect(mockEdit).toBeCalledWith('use the format !adventure @user1 @user2 @user3 @user4\n<@1> does not have a valid hero, please make a hero with !rise <name>')
  })

  it('should send an error if too many users are tagged', async () => {
    getHeroById.mockReturnValue(true)
    await adventure.run(undefined, mockMessage, ['<@!1234>', '<@!2345>', '<@!3456>', '<@!6789>', '<@!5678>'])
    expect(mockEdit).toBeCalledWith('use the format !adventure @user1 @user2 @user3 @user4\ntoo many users tagged')
  })

  it('should send an error if any tagged user has no hero', async () => {
    getHeroById.mockReturnValueOnce(true).mockReturnValueOnce(false)
    await adventure.run(undefined, mockMessage, ['<@!rabel#1234>', '<@!eric#2345>'])
    expect(mockEdit).toBeCalledWith('use the format !adventure @user1 @user2 @user3 @user4\n<@rabel#1234> does not have a valid hero, please make a hero with !rise <name>')
  })
})
