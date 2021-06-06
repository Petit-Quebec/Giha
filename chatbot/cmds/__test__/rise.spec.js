import rise from '../rise.js'

describe('Bot cmds - rise', () => {
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

  it('should create a new hero', async () => {
    await rise.run(null, mockMessage, ['dilbert'])
    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalledWith(
      'Dilbert rises! Huzzah! They are a powerful level 1 Spelunker!'
    )
  })

  it('should throw if no args', async () => {
    await rise.run(null, mockMessage, [])

    expect(mockMessage.channel.send).toHaveBeenCalledWith(
      'performing function...'
    )
    expect(mockEdit).toHaveBeenCalledWith(
      `use the format ${rise.help.format}\nrise requires a hero name (you provided 0)`
    )
  })
})
