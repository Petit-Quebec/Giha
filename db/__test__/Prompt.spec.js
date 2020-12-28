import Prompt from '../Prompt'
import { Client, DMChannel, Emoji, TextChannel } from 'discord.js'

describe('Giha class - Prompt', () => {
  let testClient = MockClient
  let testTextChannel = MockTextChannel
  // let testDMChannel = new DMChannel(testClient, {})
  let testIsReusable = true
  let testResponseAction = new jest.mock('./ResponseAction')
  let testResponseActionArray = [testResponseAction]
  let testMsgContent =
    'Yeah, I’m a smash player. Along with that I know many things that most don’t know about these communities. Melee isn’t part of the actual smash community and I’m not saying that because I don’t like them. I’m saying that based off of years of research.'
  let testMsgOptions = {}
  it('should correctly initialize when passed good arguments (single responseAction)', () => {
    let testPrompt = new Prompt(
      testTextChannel,
      testIsReusable,
      testResponseAction,
      testClient,
      testMsgContent,
      testMsgOptions
    )
    expect(testPrompt).toHaveProperty('channel', testTextChannel)
    expect(testPrompt).toHaveProperty('isReusable', testIsReusable)
    expect(testPrompt).toHaveProperty('responseActions', testResponseAction)
    expect(testPrompt).toHaveProperty('client', testClient)
    expect(testPrompt).toHaveProperty('msgContent', testMsgContent)
    expect(testPrompt).toHaveProperty('msgOptions', testMsgOptions)
  })
  //   it('should correctly initialize when passed good arguments (array of responseActions and DM channel)', () => {
})
