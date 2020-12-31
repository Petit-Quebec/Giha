import Discord from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TEST_DBOT_TOKEN
const testChannelId = process.env.TEST_CHANNEL_ID
const testEmojiId = process.env.TEST_EMOJI_ID

const bot = new Discord.Client({})
let testBotReady = false
let testChannel
let testEmoji

const run = () => {
  bot.on('ready', () => {
    console.log(
      '\x1b[32m' +
        ' ✓' +
        '\x1b[0m' +
        ' Test Bot logged in under ' +
        '\x1b[7m' +
        bot.user.tag +
        '\x1b[0m'
    )
    testChannel = bot.channels.get(testChannelId)
    testEmoji = bot.emojis.get(testEmojiId)
    console.log(testEmoji)
    testBotReady = true
    bot.on('message', async (msg) => {
      parseTestMessage(msg)
    })
  })

  bot
    .login(token)
    .then(console.log('  Test bot logging in...'))
    .catch(console.error)
}

const isReady = () => {
  return testBotReady
}

const parseTestMessage = (message) => {
  console.log(message.content)
  return false
}

const getTestChannel = () => {
  return testChannel
}

const shutdown = () => {
  return bot.destroy()
}

const getTestEmoji = () => {
  if (!testBotReady) {
    return new Promise((resolve, reject) => {
      testEmoji = bot.emojis.get(testEmojiId).then(() => {
        resolve(testEmoji)
      })
    })
  }
  return testEmoji
}

export default { run, isReady, shutdown, getTestChannel, getTestEmoji, bot }
