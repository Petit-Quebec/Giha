import Prompt from '../../Prompt.js'
import ResponseAction from '../../ResponseAction.js'
import dotenv from 'dotenv'
dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID

let callback = () => {
  console.log('callback!!')
  callBackCalled = true
  return
}
let callBackCalled = false

let test = async (chatBot, testBot, testEmoji) => {
  let isReusable = true
  let responseActions
  let client = chatBot
  let msgContent = 'this is a test message'
  let msgOptions = {}
  let testChannel = await client.channels.get(testChannelId)

  responseActions = new ResponseAction('emoji', testEmoji, callback)
  // make a new prompt
  let testPrompt = new Prompt(
    testChannel,
    isReusable,
    responseActions,
    client,
    msgContent,
    msgOptions
  )
  let botMessage = await testPrompt.messagePromise

  let testBotMessage = await testBot.channels
    .get(testChannel.id)
    .messages.get(botMessage.id)
  // wait a second
  setTimeout(async () => {
    // then have the test bot react to it
    await testBotMessage.react(testEmoji)

    let reactionUsers = botMessage.reactions.array()[0].users.array()
    if (
      reactionUsers.find((element) => element == chatBot.user.id) == -1 ||
      reactionUsers.find((element) => element == testBot.user.id) == -1
    )
      throw 'the correct reactions are missing'
  }, 2000)
  return new Promise((resolve, reject) => {
    let reactInterval = setInterval(() => {
      if (callBackCalled) {
        resolve(true)
        clearInterval(reactInterval)
      }
    }, 1000)
  })
}

let PromptTestSuite = {
  suiteName: 'Prompt TestSuite',
  tests: [test],
  numTests: 1,
}

export default PromptTestSuite
