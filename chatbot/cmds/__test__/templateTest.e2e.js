import dotenv from 'dotenv'
dotenv.config()
const testChannelId = process.env.TEST_CHANNEL_ID
const test = async (chatBot, testBot, testEmoji) => {}

let templateTestSuite = {
  suiteName: 'template TestSuite',
  tests: [test],
}

export default templateTestSuite
