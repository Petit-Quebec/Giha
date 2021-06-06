import stats from '../stats.js'
import { getHeroById } from '../../../Giha/heroManager.js'
jest.mock('../../../Giha/heroManager.js')

describe('Bot cmds - stats', () => {
  let mockMessage
  let mockEdit

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

  it('should tell you if there is no matching hero', async () => {
    await stats.run(null, mockMessage, ['Dilbert'])
    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalledWith(
      'There is no hero matching this name.'
    )
  })

  it('should tell you if you have no hero', async () => {
    await stats.run(null, mockMessage, [])
    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalledWith(
      'This command requires a hero! Create a hero with !rise.'
    )
  })

  it('should print stats if you have a hero', async () => {
    getHeroById.mockReturnValue({
      statsBlob: jest.fn(() => 'Mock Hero Stats Blob'),
    })

    await stats.run(null, mockMessage, [])
    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalledWith('Mock Hero Stats Blob')
  })

  it('should catch if there is an issue', async () => {
    getHeroById.mockReturnValue('String')
    await stats.run(null, mockMessage, [])
    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalled()
  })
})
