import { run } from '../rise.js'

describe('Bot cmds - rise', () => {
  it('rise should create a new hero', async () => {
    const mockEdit = jest.fn()
    const mockMessage = {
      author: {
        id: 1
      },
      channel: {
        send: jest.fn(() => ({
          edit: mockEdit
        }))
      }
    }

    await run(undefined, mockMessage, ['dilbert'])
    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalledWith(
      'Dilbert rises! Huzzah! They are a powerful level 1 Spelunker!'
    )
  })
})
