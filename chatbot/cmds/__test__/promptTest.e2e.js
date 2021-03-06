import Prompt from '../../Prompt.js'
import ResponseAction from '../../ResponseAction.js'
import dotenv from 'dotenv'
dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID
let callbackUser

let reactionCallBacks = 0
const reactionCallback = (user) => {
  console.log(`callback called by ${user.username}`)
  callbackUser = user
  reactionCallBacks++
  return
}

let promptBehaviorTest = async (chatBot, testBot, testEmoji) => {
  let behavior = 'oneClick'
  let responseActions
  let client = chatBot
  let msgContent = 'this is a test message checking prompt behavior'
  let msgOptions = {}
  let testChannel = await client.channels.cache.get(testChannelId)

  responseActions = new ResponseAction('emoji', testEmoji, reactionCallback)

  // make a new prompt
  let testPrompt = new Prompt(
    testChannel,
    behavior,
    responseActions,
    client,
    msgContent,
    msgOptions,
    { time: 15000 }
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
          reject('the correct reactions are missing')
        if (reactionCallBacks != 1 || callbackUser.id != testBot.user.id) {
          reject('first reaction failed')
        }
        // try to react again (unreact, re-react) , expect no additional callback
        // prompt.refreshReactions
        // react again, expect one additional callback

        await testPrompt.message.edit('testing reaction removal...')
        await testBotMessage.reactions

        const userReactions = testBotMessage.reactions.cache.filter(
          (reaction) => reaction.users.cache.has(testBot.user.id)
        )

        for (const reaction of userReactions.values()) {
          // log(reaction.user.cache)
          reaction.users.cache.forEach((user) => {
            // console.log(user)
            if (user.id == testBot.user.id) {
              reaction.users
                .remove(user.id)
                .then((res) => {
                  resolve(res)
                })
                .catch((err) => {
                  reject(err)
                  console.log('failed to remove reactions', true)
                })
            }
          })
        }

        // await testPrompt.addReactionButtons()
        await testBotMessage.react(testEmoji)

        if (reactionCallBacks != 1) {
          reject('second reaction failed')
        }

        await testPrompt.message.edit('testing the refreshing of reactions..')
        await testPrompt.stripReactions()
        setTimeout(() => {
          testBotMessage.react(testEmoji)
        }, 500)
        if (reactionCallBacks != 2) {
          reject('third reaction failed')
        }

        resolve(true)
      }, 1500)
    } catch (err) {
      reject(err)
    }
  })
}

let collectorExpiredCallBackCalled = false
const collectorExpiredCallback = () => {
  console.log('collector timed out')
  collectorExpiredCallBackCalled = true
}

let promptTimeoutTest = async (chatBot, testBot, testEmoji) => {
  let behavior = 'oneClick'
  let responseActions
  let client = chatBot
  let msgContent =
    'this is a second test message looking for a reaction timeout event'
  let msgOptions = {}
  let testChannel = await client.channels.cache.get(testChannelId)

  responseActions = new ResponseAction('emoji', testEmoji, reactionCallback)

  // make a new prompt
  let testPrompt = new Prompt(
    testChannel,
    behavior,
    responseActions,
    client,
    msgContent,
    msgOptions,
    { time: 100 },
    collectorExpiredCallback
  )
  await testPrompt.messagePromise
  await testPrompt.reactionPromises

  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        if (collectorExpiredCallBackCalled) resolve(true)
        else reject('timeout collector did not trigger')
      }, 1500)
    } catch (err) {
      reject(err)
    }
  })
}

let promptTestSuite = {
  suiteName: 'prompt TestSuite',
  tests: [promptBehaviorTest, promptTimeoutTest],
}

export default promptTestSuite
