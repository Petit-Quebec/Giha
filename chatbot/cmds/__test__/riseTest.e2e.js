import dotenv from 'dotenv'
import { getHeroByName } from '../../../Giha/heroManager.js'

dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID
const testHero1Name = 'Jiraya'
const testHero2Name = 'Orochimaru'
const heroTest = async (chatBot, testBot) => {
  let testChannel = testBot.channels.cache.get(testChannelId)
  let testMessage = await testChannel.send(`!rise ${testHero1Name}`)
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (getHeroByName(testHero1Name)) {
        testMessage.delete()
        resolve(true)
        clearInterval(interval)
      }
    }, 10)
    setTimeout(() => {
      reject('no hero seen in time')
    }, 1500)
  })
}

const messageTest = async (chatBot, testBot) => {
  let testChannel = testBot.channels.cache.get(testChannelId)
  await testChannel.send(`!rise ${testHero2Name}`)
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      let testBotTestMessage = testChannel.messages.cache.find(
        (msg) =>
          (msg.content = `${testHero2Name} rises! Huzzah! They are a powerful level 1 Spelunker!`)
      )
      if (testBotTestMessage) {
        // console.log(testBotTestMessage)
        resolve(true)
        clearInterval(interval)
      }
    }, 100)
    setTimeout(() => {
      reject('no message seen in time')
    }, 1500)
  })
}
let riseTestSuite = {
  suiteName: 'rise TestSuite',
  tests: [messageTest, heroTest],
}

export default riseTestSuite
