import { run } from '../avatar.js'
describe('Bot cmds - avatar', () => {
  const mockUrl = 'HTTPS://gromlet.org/TEE_HEE_SEKRIT_STRING.jif'
  let mockDelete, mockMessage
  beforeEach(() => {
    mockDelete = jest.fn()
    mockMessage = {
      channel: {
        send: jest.fn(() => {
          return {
            delete: mockDelete,
          }
        }),
      },
      author: {
        displayAvatarURL: mockUrl,
      },
    }
  })

  it('should delete the message when it is done.', async () => {
    await run(undefined, mockMessage)
    expect(mockDelete).toHaveBeenCalled()
  })

  it('should send a message with a file to the channel', async () => {
    await run(undefined, mockMessage)
    expect(mockMessage.channel.send).toHaveBeenCalledTimes(2)

    expect(mockMessage.channel.send).toHaveBeenNthCalledWith(
      1,
      'generating avatar...'
    )

    expect(mockMessage.channel.send).toHaveBeenNthCalledWith(2, {
      files: [
        {
          attachment: mockUrl,
          name: 'avatar.png',
        },
      ],
    })
  })
})
