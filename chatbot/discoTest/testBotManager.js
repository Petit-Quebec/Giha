import Discord from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TEST_DBOT_TOKEN
const testEmojiId = process.env.TEST_EMOJI_ID

const bot = new Discord.Client({})
let testBotReady = false
let testEmoji

const run = () => {
  return new Promise((resolve) => {
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
      testEmoji = bot.emojis.cache.get(testEmojiId)
      console.log('testEmoji')
      console.log(testEmoji.id)
      testBotReady = true
      resolve({
        bot: bot,
        testEmoji: testEmoji,
      })
    })

    bot.on('message', async (msg) => {
      console.log(msg.content)
    })

    bot
      .login(token)
      .then(console.log('  Test bot logging in...'))
      .catch(console.error)
  })
}

const isReady = () => {
  return testBotReady
}

const shutdown = () => {
  return bot.destroy()
}

const getTestEmoji = async () => {
  if (testBotReady) return testEmoji
  console.log('tried to get testEmoji before testbot is online')
  return testEmoji
}

export default { run, isReady, shutdown, getTestEmoji, bot }
