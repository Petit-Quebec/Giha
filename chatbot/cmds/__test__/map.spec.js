import map from '../map.js'

describe('Bot cmds - map', () => {
  let mockMessage
  let mockDelete

  beforeEach(() => {
    mockDelete = jest.fn()
    mockMessage = {
      author: {
        id: 1,
      },
      channel: {
        send: jest.fn(() => {
          return {
            delete: mockDelete,
          }
        }),
      },
    }
  })

  it('should send a message and call render', async () => {
    await map.run(null, mockMessage)
    expect(mockMessage.channel.send).toHaveBeenCalledWith('generating map...')
    expect(mockMessage.channel.send).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalled()
  })
})
