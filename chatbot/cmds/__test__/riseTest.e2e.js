import dotenv from 'dotenv'
import { getHeroByName } from '../../../Giha/heroManager.js'

dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID
const testHeroName = 'Jiraya'
const test = async (chatBot, testBot) => {
  let testChannel = testBot.channels.cache.get(testChannelId)
  let testMessage = await testChannel.send(`!rise ${testHeroName}`)
  return new Promise((resolve) => {
    setInterval(() => {
      if (getHeroByName(testHeroName)) {
        testMessage.delete()
        resolve(true)
      }
    }, 10)
  })
}

let riseTestSuite = {
  suiteName: 'rise TestSuite',
  tests: [test],
}

export default riseTestSuite
