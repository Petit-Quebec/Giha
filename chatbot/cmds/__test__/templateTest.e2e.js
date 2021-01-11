import dotenv from 'dotenv'
dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID
const test = async (chatBot, testBot, testEmoji) => {
  return {
    testChannel: chatBot.channels.cache.get(testChannelId),
    testBot: testBot,
    testEmoji: testEmoji,
  }
}

let templateTestSuite = {
  suiteName: 'template TestSuite',
  tests: [test],
}

export default templateTestSuite
