import Prompt from '../../Prompt.js'
import ResponseAction from '../../ResponseAction.js'
import dotenv from 'dotenv'
dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID
let callbackUser

const callback = (user) => {
  console.log(`callback called by ${user.username}`)
  callbackUser = user
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
  let testChannel = await client.channels.cache.get(testChannelId)

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
  await testPrompt.reactionPromises

  let testBotMessage = await testBot.channels.cache
    .get(testChannel.id)
    .messages.cache.get(botMessage.id)

  await testBotMessage.react(testEmoji)
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        // then have the test bot react to it
        let reactionUsers = botMessage.reactions.cache
          .array()[0]
          .users.cache.array()
        if (
          reactionUsers.find((element) => element == chatBot.user.id) == -1 ||
          reactionUsers.find((element) => element == testBot.user.id) == -1
        )
          throw 'the correct reactions are missing'
        // console.log(
        //   `callbackcalled: ${callBackCalled}  by  ${callbackUser.username}`
        // )
        // console.log(` compared to ${testBot.user.id}`)
        if (callBackCalled && callbackUser.id == testBot.user.id) {
          console.log(`It's the same!`)
          resolve(true)
        }
      }, 2000)
    } catch (err) {
      reject(err)
    }
  })
}

let promptTestSuite = {
  suiteName: 'prompt TestSuite',
  tests: [test],
}

export default promptTestSuite
